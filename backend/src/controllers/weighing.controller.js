// backend/controllers/weighing.controller.js
import WeighingRecord from "../models/weighing.record.model.js";
import { v4 as uuidv4 } from "uuid";

// 生成流水号（按日期+序号）
const generateSerialNo = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${dateStr}${random}`;
};

// 1. 创建称重记录（支持离线）
export const createWeighingRecord = async (req, res) => {
  try {
    const {
      vehicleNo,
      goodsName,
      specification,
      senderUnit,
      receiverUnit,
      grossWeight,
      tareWeight,
      netWeight,
      actualWeight,
      amount,
      grossTime,
      tareTime,
      remark,
      isOffline,
      offlineId,
    } = req.body;

    const operatorId = req.user._id;

    // 自动计算净重（如果前端未传）
    const finalNetWeight = netWeight || (grossWeight - tareWeight);

    const newRecord = new WeighingRecord({
      serialNo: generateSerialNo(),
      vehicleNo,
      goodsName,
      specification: specification || "",
      senderUnit,
      receiverUnit,
      grossWeight: grossWeight || 0,
      tareWeight: tareWeight || 0,
      netWeight: finalNetWeight,
      actualWeight: actualWeight || finalNetWeight,
      amount: amount || 0,
      grossTime: grossTime ? new Date(grossTime) : new Date(),
      tareTime: tareTime ? new Date(tareTime) : null,
      operatorId,
      remark: remark || "",
      isOffline: isOffline || false,
      offlineId: isOffline ? (offlineId || uuidv4()) : null,
      syncStatus: isOffline ? "pending" : "synced",
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("创建称重记录失败:", error);
    res.status(500).json({ message: "创建称重记录失败: " + error.message });
  }
};

// 2. 获取称重记录列表（支持分页、筛选）
export const getWeighingRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicleNo, startDate, endDate } = req.query;
    const query = {};

    // 按车号筛选
    if (vehicleNo) query.vehicleNo = new RegExp(vehicleNo, "i");
    // 按时间范围筛选
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const records = await WeighingRecord.find(query)
      .populate("operatorId", "fullName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await WeighingRecord.countDocuments(query);

    res.status(200).json({
      data: records,
      pagination: { page, limit, total },
    });
  } catch (error) {
    console.error("获取称重记录失败:", error);
    res.status(500).json({ message: "获取称重记录失败: " + error.message });
  }
};

// 3. 同步离线称重记录（修复版：兼容单对象/数组 + 自动生成serialNo）
export const syncOfflineRecords = async (req, res) => {
  try {
    let { offlineRecords } = req.body;
    const operatorId = req.user._id;

    // 核心修复1：兼容单个对象传入（自动包装成数组）
    if (!Array.isArray(offlineRecords)) {
      offlineRecords = [offlineRecords];
    }

    // 核心修复2：空值校验
    if (offlineRecords.length === 0) {
      return res.status(400).json({ message: "离线记录不能为空" });
    }

    const syncedRecords = [];
    for (const record of offlineRecords) {
      // 跳过空记录
      if (!record) continue;

      const existing = await WeighingRecord.findOne({ offlineId: record.offlineId });
      if (!existing) {
        const newRecord = new WeighingRecord({
          ...record,
          operatorId,          // 补充操作员ID
          isOffline: false,     // 同步后标记为在线记录
          syncStatus: "synced", // 同步状态改为已同步
          serialNo: generateSerialNo() // 核心修复：自动生成流水号
        });
        await newRecord.save();
        syncedRecords.push(newRecord);
      }
    }

    res.status(200).json({
      message: `成功同步 ${syncedRecords.length} 条离线记录`,
      syncedCount: syncedRecords.length,
      syncedRecords,
    });
  } catch (error) {
    console.error("同步离线记录失败:", error);
    res.status(500).json({ message: "同步离线记录失败: " + error.message });
  }
};

// 4. 补全：删除称重记录
export const deleteWeighingRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查记录是否存在
    const record = await WeighingRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: "称重记录不存在" });
    }

    // 删除记录
    await WeighingRecord.findByIdAndDelete(id);
    res.status(200).json({ message: "称重记录删除成功" });
  } catch (error) {
    console.error("删除称重记录失败:", error);
    res.status(500).json({ message: "删除称重记录失败: " + error.message });
  }
};