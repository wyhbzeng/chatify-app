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

// 同一组织内：角色编码唯一
roleSchema.index({ organizationId: 1, roleCode: 1 }, { unique: true });
// 同一组织内：角色名称唯一
roleSchema.index({ organizationId: 1, roleName: 1 }, { unique: true });

const Role = mongoose.models.Role || mongoose.model("Role", roleSchema);

export default Role;