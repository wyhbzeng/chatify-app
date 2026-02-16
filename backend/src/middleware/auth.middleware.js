import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;
    
    // 1. 从 Authorization 头读取
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token from Authorization header");
    }
    // 2. 从 Cookie 读取
    else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      console.log("🔑 Token from cookie");
    }
    // 3. 从请求体读取（兜底）
    else if (req.body?.token) {
      token = req.body.token;
      console.log("🔑 Token from request body");
    }

    if (!token) {
      console.log("❌ No token provided");
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 核心修复：解码后读取 `id` 字段（和生成Token时一致）
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    if (!decoded || !decoded.id) { // 把 decoded.userId → decoded.id
      console.log("❌ Invalid token payload: missing 'id' field");
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.id).select("-password"); // 用 decoded.id 查询
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};