import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },

  // 多组织支持
  organizationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: []
  }],
  currentOrgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    default: null
  },

  roleIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    default: []
  }]
}, {
  timestamps: true,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;