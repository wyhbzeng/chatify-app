// lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";
import Message from "../models/Message.js";

const app = express();
const server = http.createServer(app);

// Socket.IO 配置（简化版，强制轮询）
const io = new Server(server, {
  cors: {
    origin: true, // 允许所有来源
    credentials: true,
  },
  // 强制使用轮询，解决 WebSocket 连接问题
  transports: ["polling"],
  allowEIO3: true, // 兼容旧版客户端
  pingTimeout: 60000,
  pingInterval: 25000,
});

// 应用认证中间件
io.use(socketAuthMiddleware);

// 在线用户映射 { userId: socketId }
const userSocketMap = {};

// 获取接收方 Socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// 导出 io 供其他模块使用
export { io };

// 核心 Socket 逻辑
io.on("connection", (socket) => {
  console.log("✅ User connected:", {
    name: socket.user?.fullName || "Unknown",
    userId: socket.userId,
    socketId: socket.id,
  });

  // 1. 用户上线：更新在线列表并广播
  const userId = socket.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    // 广播在线用户列表
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // 监听 join 事件
  socket.on("join", (data) => {
    console.log(`👤 User ${data.userId} joined`);
  });

  // 2. 监听发送消息事件
  socket.on("sendMessage", async (messageData) => {
    try {
      if (!messageData || !messageData.receiverId || !messageData.senderId) {
        console.error("❌ Invalid message data:", messageData);
        socket.emit("messageError", "Invalid message format");
        return;
      }

      // 从数据库获取完整消息
      const message = await Message.findById(messageData._id)
        .populate("senderId", "fullName profilePic _id")
        .populate("receiverId", "fullName profilePic _id")
        .lean();

      if (!message) {
        console.error("❌ Message not found in DB:", messageData._id);
        socket.emit("messageError", "Message not saved to database");
        return;
      }

      // 格式化消息
      const formattedMessage = {
        ...message,
        senderId: message.senderId._id.toString(),
        receiverId: message.receiverId._id.toString(),
        _id: message._id.toString(),
      };

      // 推送给接收方
      const receiverSocketId = getReceiverSocketId(formattedMessage.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", formattedMessage);
        console.log("📤 Message sent to online user:", formattedMessage.receiverId);
      } else {
        console.log("📥 User offline, message stored in DB:", formattedMessage.receiverId);
      }

      // 回传给发送方
      socket.emit("newMessage", formattedMessage);

    } catch (error) {
      console.error("❌ Send message error:", error);
      socket.emit("messageError", "Failed to send message");
    }
  });

  // 3. 监听断开连接
  socket.on("disconnect", (reason) => {
    console.log("❌ User disconnected:", {
      name: socket.user?.fullName || "Unknown",
      userId: socket.userId,
      reason,
    });

    // 更新在线列表
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });

  // 4. 监听连接错误
  socket.on("connect_error", (err) => {
    console.error("❌ Socket connection error:", err.message);
  });
});

// 导出核心对象
export { app, server };