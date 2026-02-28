import WeighingRecord from "../models/WeighingRecord.js";
import { v4 as uuidv4 } from "uuid";

// 生成流水号（按日期+序号）
const generateSerialNo = () => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${dateStr}${random}`;
};

// 1. 创建称重记录
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

    // ====================== 这里修复！======================
    const organizationId = req.organizationId; // 不是 currentOrganizationId
    // ======================================================

    if (!organizationId) {
      return res.status(400).json({
        message: "创建称重记录失败：请先切换到有效的组织"
      });
    }

    // 自动计算净重
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
      organizationId,
      remark: remark || "",
      isOffline: isOffline || false,
      offlineId: isOffline ? (offlineId || uuidv4()) : null,
      syncStatus: isOffline ? "pending" : "synced",
    });

    await newRecord.save();
    res.status(201).json(newRecord);

  } catch (error) {
    console.error("创建称重记录失败:", error);
    res.status(400).json({ message: "创建称重记录失败: " + error.message });
  }
};

// 2. 获取称重记录列表
export const getWeighingRecords = async (req, res) => {
  try {
    const { page = 1, limit = 10, vehicleNo, startDate, endDate } = req.query;
    const query = {};

    // ====================== 这里修复！======================
    const organizationId = req.organizationId;
    // ======================================================

    if (organizationId) {
      query.organizationId = organizationId;
    }

    if (vehicleNo) query.vehicleNo = new RegExp(vehicleNo, "i");
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

// 3. 同步离线记录
export const syncOfflineRecords = async (req, res) => {
  try {
    let { offlineRecords } = req.body;
    const operatorId = req.user._id;

    if (!Array.isArray(offlineRecords)) {
      offlineRecords = [offlineRecords];
    }

    if (offlineRecords.length === 0) {
      return res.status(400).json({ message: "离线记录不能为空" });
    }

    // ====================== 这里修复！======================
    const organizationId = req.organizationId;
    // ======================================================

    if (!organizationId) {
      return res.status(400).json({
        message: "同步离线记录失败：请先切换到有效的组织"
      });
    }

    const syncedRecords = [];
    for (const record of offlineRecords) {
      if (!record) continue;

      const existing = await WeighingRecord.findOne({ offlineId: record.offlineId });
      if (!existing) {
        const newRecord = new WeighingRecord({
          ...record,
          operatorId,
          organizationId,
          isOffline: false,
          syncStatus: "synced",
          serialNo: generateSerialNo()
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

// 4. 删除称重记录
export const deleteWeighingRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await WeighingRecord.findById(id);
    if (!record) {
      return res.status(404).json({ message: "称重记录不存在" });
    }

    await WeighingRecord.findByIdAndDelete(id);
    res.status(200).json({ message: "称重记录删除成功" });
  } catch (error) {
    console.error("删除称重记录失败:", error);
    res.status(500).json({ message: "删除称重记录失败: " + error.message });
  }
};