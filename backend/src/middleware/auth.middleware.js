import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

    // 1. 从多个位置获取 Token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.body?.token) {
      token = req.body.token;
    } else if (req.query?.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 2. 验证 Token
    let decoded;
    try {
      decoded = jwt.verify(token, ENV.JWT_SECRET);
    } catch (verifyError) {
      if (verifyError.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Token Expired" });
      }
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 3. 查找用户
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;

    // ====================== 【核心修复】精准放行创建组织接口 ======================
    // 如果是 POST /organization/add，直接跳过组织校验，放行！
    if (req.method === "POST" && req.originalUrl.includes("/organization/add")) {
      return next();
    }
    // ==========================================================================

    // 4. 其他所有接口，必须校验当前组织
    const currentOrgId = req.headers['organization-id'] || user.currentOrgId;
    if (!currentOrgId) {
      return res.status(400).json({ message: "请先选择组织 / Missing currentOrgId" });
    }
    req.organizationId = currentOrgId;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};