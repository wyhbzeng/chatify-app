import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  roleCode: { type: String, required: true },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  menuIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Menu" }],
  status: { type: Boolean, default: true },
  remark: { type: String, default: "" },
}, { timestamps: true });

// 确保同一组织下，角色名和编码唯一
roleSchema.index({ roleName: 1, organizationId: 1 }, { unique: true });
roleSchema.index({ roleCode: 1, organizationId: 1 }, { unique: true });

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;