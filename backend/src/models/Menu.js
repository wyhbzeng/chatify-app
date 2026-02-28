import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
  menuName: { type: String, required: true },
  path: { type: String },
  component: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, default: null },
  menuType: { type: String, default: "M" },
  icon: { type: String },
  sort: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
}, { timestamps: true });

const Menu = mongoose.models.Menu || mongoose.model("Menu", menuSchema);

export default Menu;