import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const socketAuthMiddleware = async (socket, next) => {
  try {
    // 多来源获取 Token（兼容前端传递方式）
    let token = null;
    
    // 1. 优先从 Socket auth 字段获取
    if (socket.handshake.auth?.token) {
      token = socket.handshake.auth.token;
    }
    // 2. 从 URL 查询参数获取
    else if (socket.handshake.query?.token) {
      token = socket.handshake.query.token;
    }
    // 3. 从 Cookie 获取（兜底）
    else if (socket.handshake.headers.cookie) {
      token = socket.handshake.headers.cookie
        .split("; ")
        .find((row) => row.startsWith("jwt="))
        ?.split("=")[1];
    }

    // 无 Token 拒绝连接
    if (!token) {
      console.log("Socket connection rejected: No token provided");
      return next(new Error("Unauthorized - No Token Provided"));
    }

    // 验证 Token（带过期校验）
    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (verifyError) {
      if (verifyError.name === "TokenExpiredError") {
        console.log("Socket connection rejected: Token expired");
        return next(new Error("Unauthorized - Token Expired"));
      }
      console.log("Socket connection rejected: Invalid token", verifyError.message);
      return next(new Error("Unauthorized - Invalid Token"));
    }

    // 核心修复：读取 decoded.id 而非 decoded.userId
    if (!decoded || !decoded.id) {
      console.log("Socket connection rejected: Invalid token payload (missing 'id')");
      return next(new Error("Unauthorized - Invalid Token Payload"));
    }

    // 查询用户（使用 lean() 提升性能）
    const user = await User.findById(decoded.id).select("-password").lean(); // 用 decoded.id
    if (!user) {
      console.log("Socket connection rejected: User not found");
      return next(new Error("User not found"));
    }

    // 挂载用户信息（统一转字符串）
    socket.user = user;
    socket.userId = user._id.toString();

    console.log(`✅ Socket authenticated for user: ${user.fullName} (${user._id})`);
    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Unauthorized - Authentication failed"));
  }
};