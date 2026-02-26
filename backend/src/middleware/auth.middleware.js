import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = null;

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

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ====================== 我帮你改好的代码 ======================
    // 创建组织接口：不检查 organizationId，直接放行
    // 用 req.originalUrl.includes 来判断，不受路由前缀影响
    if (req.method === "POST" && req.originalUrl.includes("/organization/add")) {
      req.user = user;
      return next();
    }
    // ==================================================================

    // 你原来的逻辑，完全不动！聊天、登录、其他接口全部正常
    const organizationId = req.headers['organization-id'] || user.organizationId;
    if (!organizationId) {
      return res.status(400).json({ message: "Missing organizationId" });
    }

    req.organizationId = organizationId;
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};