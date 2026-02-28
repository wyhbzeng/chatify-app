import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  orgCode: { type: String, required: true },
  status: { type: Boolean, default: true },
  remark: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

// 组织编码唯一索引
organizationSchema.index({ orgCode: 1 }, { unique: true });

const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);

export default Organization;