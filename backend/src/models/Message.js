import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: { type: String, default: "" },
  image: { type: String, default: "" },
  // 👇 多组织隔离：每条消息属于当前组织
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;