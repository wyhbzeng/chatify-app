import express from "express";   
import { protectRoute } from '../middleware/auth.middleware.js';
import multer from 'multer';
import { getAllContacts, 
    getChatPartners, 
    getMessagesByUserId, 
    sendMessage 
} from "../controllers/message.controller.js";

const router = express.Router();
// 添加文件上传支持
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.use(protectRoute);
router.get("/contacts",getAllContacts);
router.get("/chats",getChatPartners);
router.get("/:id",getMessagesByUserId);
// 添加 upload 中间件支持图片消息
router.post("/send/:id", upload.single('image'), sendMessage);

export default router;