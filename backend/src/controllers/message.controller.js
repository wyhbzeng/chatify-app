import Message from "../models/Message.js";
import User from "../models/User.js";
import minioClient from "../lib/minioClient.js";
import { ENV } from "../lib/env.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllcontacts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    if (!userToChatId) {
      return res.status(400).json({ error: "目标聊天用户ID不能为空" });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUserId:", error.message);
    res.status(500).json({ error: "获取聊天消息失败：" + error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const bucketName = ENV.MINIO_BUCKET_NAME || "chatify-profiles";

    let imageUrl;
    if (req.file) {
      const fileName = `${uuidv4()}${path.extname(req.file.originalname)}`;
      await minioClient.putObject(bucketName, fileName, req.file.buffer);
      imageUrl = `http://${ENV.MINIO_ENDPOINT || 'localhost'}:${ENV.MINIO_PORT || '9000'}/${bucketName}/${fileName}`;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    const savedMessage = await newMessage.save();

    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("senderId", "fullName profilePic _id")
      .populate("receiverId", "fullName profilePic _id")
      .lean();

    const formattedMessage = {
      ...populatedMessage,
      senderId: populatedMessage.senderId._id.toString(),
      receiverId: populatedMessage.receiverId._id.toString(),
      _id: populatedMessage._id.toString(),
    };

    // 全局广播，确保双方都能收到
    io.emit("newMessage", formattedMessage);
    console.log("📤 Message broadcasted to all users:", formattedMessage._id);

    res.status(201).json(formattedMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) => {
          return msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString();
        })
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");
    res.status(200).json(chatPartners);
  } catch (error) {
    console.log("Error in getChatPartners:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};