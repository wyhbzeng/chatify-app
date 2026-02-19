import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import weighingRoutes from "./routes/weighing.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// CORS 配置（简化版，确保兼容 Socket.IO）
const corsOptions = {
  origin: [
    "http://localhost:5173", // 电脑本地前端
    "http://192.168.1.76:5173", // 手机访问的前端地址（替换成你的实际IP和端口）
  ], // 允许所有来源（开发环境）
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
};

// 中间件配置
app.use(express.json({ limit: "5mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());

// 路由配置
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/weighing", weighingRoutes);

// 生产环境静态资源托管
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
    success: false,
  });
});


// 启动服务
async function startServer() {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
    
    // 核心修改：监听 0.0.0.0，允许局域网访问
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on: http://0.0.0.0:${PORT}`);
      console.log(`✅ LAN access: http://192.168.1.76:${PORT}`); // 打印你的局域网IP
      console.log(`✅ Socket IO ready at: http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
}

// 启动
startServer();