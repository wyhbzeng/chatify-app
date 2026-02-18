// backend/models/WeighingRecord.js
import mongoose from "mongoose";

const weighingRecordSchema = new mongoose.Schema({
  // 核心业务字段
  serialNo: { type: String, required: true, unique: true }, // 流水号，如 202501020501
  vehicleNo: { type: String, required: true }, // 车号
  goodsName: { type: String, required: true }, // 货名
  specification: { type: String, default: "" }, // 规格
  senderUnit: { type: String, required: true }, // 发货单位
  receiverUnit: { type: String, required: true }, // 收货单位

  // 重量数据
  grossWeight: { type: Number, required: true, default: 0 }, // 毛重 (kg)
  tareWeight: { type: Number, required: true, default: 0 }, // 皮重 (kg)
  netWeight: { type: Number, required: true, default: 0 }, // 净重 (kg)
  actualWeight: { type: Number, required: true, default: 0 }, // 实重 (kg)
  amount: { type: Number, required: true, default: 0 }, // 金额

  // 时间戳
  grossTime: { type: Date }, // 毛重时间
  tareTime: { type: Date }, // 皮重时间

  // 操作员与备注
  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 操作员ID（复用聊天用户）
  remark: { type: String, default: "" }, // 备注

  // 离线称重支持（关键）
  isOffline: { type: Boolean, default: false }, // 是否为离线称重记录
  offlineId: { type: String }, // 离线时生成的唯一ID，用于同步
  syncStatus: { type: String, enum: ["pending", "synced", "failed"], default: "synced" }, // 同步状态
  syncError: { type: String }, // 同步失败原因

  // 元数据
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// 自动更新时间戳
weighingRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const WeighingRecord = mongoose.model("WeighingRecord", weighingRecordSchema);
export default WeighingRecord;