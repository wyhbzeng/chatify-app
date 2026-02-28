import express from 'express';
import multer from 'multer';
// 1. 把 switchCurrentOrg 也引入进来
import { login, signup, logout, updateProfile, switchCurrentOrg,bindOrg } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// 2. 配置 multer
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB 限制
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protectRoute, logout);
router.put("/update-profile", protectRoute, upload.single('profilePic'), updateProfile);
router.post("/bind-org", protectRoute, bindOrg);

// 3. 关键：注册切换组织的路由，和 Postman 的 URL 对齐
router.post("/switch-org", protectRoute, switchCurrentOrg);

router.get("/check", protectRoute, (req, res) => {
  res.status(200).json(req.user);
});

export default router;