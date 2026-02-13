import express from 'express';
// 1. 导入 multer 模块（处理文件上传的核心）
import multer from 'multer';
import { login, signup, logout, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// 2. 配置 multer 为内存存储（适配 MinIO 直接读取文件缓冲区，无需本地临时文件）
const storage = multer.memoryStorage();
// 可选：添加文件大小限制（比如 5MB），避免超大文件上传
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB 限制，单位是字节
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

// 3. 关键补充：在路由中添加 upload.single('profilePic') 中间件
//    注意顺序：protectRoute（认证） -> upload（解析文件） -> updateProfile（业务逻辑）
router.put("/update-profile", protectRoute, upload.single('profilePic'), updateProfile);

router.get("/check", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

export default router;