import mongoose from "mongoose";

const weighingRecordSchema = new mongoose.Schema({
  serialNo: { type: String, required: true, unique: true },
  vehicleNo: { type: String, required: true },
  goodsName: { type: String, required: true },
  specification: { type: String, default: "" },
  senderUnit: { type: String, required: true },
  receiverUnit: { type: String, required: true },

  grossWeight: { type: Number, required: true, default: 0 },
  tareWeight: { type: Number, required: true, default: 0 },
  netWeight: { type: Number, required: true, default: 0 },
  actualWeight: { type: Number, required: true, default: 0 },
  amount: { type: Number, required: true, default: 0 },

  grossTime: { type: Date },
  tareTime: { type: Date },

  operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  remark: { type: String, default: "" },

  isOffline: { type: Boolean, default: false },
  offlineId: { type: String },
  syncStatus: { type: String, enum: ["pending", "synced", "failed"], default: "synced" },
  syncError: { type: String },

  // 👇 多组织隔离：每条称重记录属于当前组织
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

weighingRecordSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const WeighingRecord = mongoose.model("WeighingRecord", weighingRecordSchema);
export default WeighingRecord;