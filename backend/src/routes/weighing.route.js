// backend/routes/weighing.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createWeighingRecord,
  getWeighingRecords,
  syncOfflineRecords,
} from "../controllers/weighing.controller.js";

const router = express.Router();

router.use(protectRoute); // 所有接口需要登录
router.post("/records", createWeighingRecord);
router.get("/records", getWeighingRecords);
router.post("/sync-offline", syncOfflineRecords); // 离线同步接口

export default router;