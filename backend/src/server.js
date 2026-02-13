// index.js (主入口文件)
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// CORS 配置（简化版，确保兼容 Socket.IO）
const corsOptions = {
  origin: true, // 允许所有来源（开发环境）
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
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on port: ${PORT}`);
      console.log(`✅ Socket IO ready at: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
}

// 启动
startServer();