import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import minioClient from "../lib/minioClient.js"; // 导入MinIO客户端
import { ENV } from "../lib/env.js"; // 导入环境变量
import { v4 as uuidv4 } from "uuid";
import path from "path";
// 新增：导入断开Socket连接的方法
import { disconnectUserAllSockets } from "../lib/socket.js";

// 生成JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// 注册
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // 生成Token
    const token = generateToken(newUser._id);

    // 返回用户信息（不含密码）+ Token
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 登录
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查用户是否存在
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 验证密码
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 关键修改：登录时先断开该用户的所有旧连接
    disconnectUserAllSockets(user._id.toString());

    // 生成Token
    const token = generateToken(user._id);

    // 返回用户信息（不含密码）+ Token
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 登出（增强版：断开Socket连接）
export const logout = async (req, res) => {
  try {
    // 如果有用户信息，断开其所有Socket连接
    if (req.user && req.user._id) {
      disconnectUserAllSockets(req.user._id.toString());
    }
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 核心修复：更新资料（支持头像上传到MinIO）
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body; // 支持同时更新用户名
    const userId = req.user._id;
    const bucketName = ENV.MINIO_BUCKET_NAME || "chatify-profiles";

    // 准备更新数据
    const updateData = {};
    if (fullName) updateData.fullName = fullName;

    // 处理头像上传
    if (req.file) {
      try {
        // 1. 检查Bucket是否存在，不存在则创建
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
          await minioClient.makeBucket(bucketName);
        }

        // 2. 生成唯一文件名
        const fileName = `avatar-${userId}-${uuidv4()}${path.extname(req.file.originalname)}`;
        
        // 3. 上传到MinIO
        await minioClient.putObject(bucketName, fileName, req.file.buffer);
        
        // 4. 生成可访问的URL
        const profilePicUrl = `http://${ENV.MINIO_ENDPOINT || 'localhost'}:${ENV.MINIO_PORT || '9000'}/${bucketName}/${fileName}`;
        
        // 5. 添加到更新数据
        updateData.profilePic = profilePicUrl;
      } catch (imgError) {
        console.error("MinIO上传失败:", imgError);
        return res.status(400).json({ message: "头像上传失败：" + imgError.message });
      }
    }

    // 更新用户信息
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true } // 返回更新后的文档
    ).select("-password"); // 排除密码字段

    if (!updatedUser) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 返回更新后的用户信息
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error);
    res.status(500).json({ message: "更新资料失败：" + error.message });
  }
};