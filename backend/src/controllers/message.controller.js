import Message from "../models/Message.js";
import User from "../models/User.js";
import minioClient from "../lib/minioClient.js";
import { ENV } from "../lib/env.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
// 导入 io 实例和获取 Socket ID 的方法
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllcontacts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    if (!userToChatId) {
      return res.status(400).json({ error: "目标聊天用户ID不能为空" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId:", error.message);
    res.status(500).json({ error: "获取聊天消息失败：" + error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const bucketName = ENV.MINIO_BUCKET_NAME || "chatify-profiles";

    let imageUrl;
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      await minioClient.putObject(bucketName, fileName, req.file.buffer);
      imageUrl = `http://${ENV.MINIO_ENDPOINT || 'localhost'}:${ENV.MINIO_PORT || '9000'}/${bucketName}/${fileName}`;
    }

    // 创建并保存新消息
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    const savedMessage = await newMessage.save();

    // 填充用户信息，用于前端显示
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("senderId", "fullName profilePic _id")
      .populate("receiverId", "fullName profilePic _id")
      .lean();

    // 格式化消息（统一 ID 为字符串）
    const formattedMessage = {
      ...populatedMessage,
      senderId: populatedMessage.senderId._id.toString(),
      receiverId: populatedMessage.receiverId._id.toString(),
      _id: populatedMessage._id.toString(),
    };

    // 关键：通过 Socket 实时推送
    const receiverSocketId = getReceiverSocketId(receiverId.toString());
    const senderSocketId = getReceiverSocketId(senderId.toString());

    // 推送给接收方
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", formattedMessage);
      console.log("📤 Message sent to receiver:", receiverId);
    }
    // 推送给发送方（确保发送方也能实时更新）
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", formattedMessage);
      console.log("📤 Message sent to sender:", senderId);
    }

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) => {
          return msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString();
        })
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};