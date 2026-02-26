import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  orgCode: { type: String, required: true, unique: true },
  status: { type: Boolean, default: true },
  remark: { type: String, default: "" },
  createdBy: { // 新增创建者字段，关联用户
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const Organization = mongoose.models.Organization || mongoose.model("Organization", organizationSchema);

export default Organization;