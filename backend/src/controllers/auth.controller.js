import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import minioClient from "../lib/minioClient.js";
import { ENV } from "../lib/env.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
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

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = generateToken(newUser._id);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      organizationIds: newUser.organizationIds,
      currentOrgId: newUser.currentOrgId,
      token,
    });
  } catch (error) {
    console.log("Error in signup:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 登录
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    disconnectUserAllSockets(user._id.toString());

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      organizationIds: user.organizationIds,
      currentOrgId: user.currentOrgId,
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 登出
export const logout = async (req, res) => {
  try {
    if (req.user && req.user._id) {
      disconnectUserAllSockets(req.user._id.toString());
    }
    
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 更新资料
export const updateProfile = async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user._id;
    const bucketName = ENV.MINIO_BUCKET_NAME || "chatify-profiles";

    const updateData = {};
    if (fullName) updateData.fullName = fullName;

    if (req.file) {
      try {
        const bucketExists = await minioClient.bucketExists(bucketName);
        if (!bucketExists) {
          await minioClient.makeBucket(bucketName);
        }

        const fileName = `avatar-${userId}-${uuidv4()}${path.extname(req.file.originalname)}`;
        await minioClient.putObject(bucketName, fileName, req.file.buffer);
        const profilePicUrl = `http://${ENV.MINIO_ENDPOINT || 'localhost'}:${ENV.MINIO_PORT || '9000'}/${bucketName}/${fileName}`;
        updateData.profilePic = profilePicUrl;
      } catch (imgError) {
        console.error("MinIO上传失败:", imgError);
        return res.status(400).json({ message: "头像上传失败：" + imgError.message });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "用户不存在" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updateProfile controller", error);
    res.status(500).json({ message: "更新资料失败：" + error.message });
  }
};

// 切换当前组织（你已经写好了，我帮你保留）
export const switchCurrentOrg = async (req, res) => {
  try {
    const { orgId } = req.body;
    const userId = req.user._id;

    if (!orgId) {
      return res.status(400).json({ message: "orgId 不能为空" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 校验是否在该组织内
    const isInOrg = user.organizationIds.some(id => id.toString() === orgId);
    if (!isInOrg) {
      return res.status(403).json({ message: "无权限切换到该组织" });
    }

    user.currentOrgId = orgId;
    await user.save();

    res.status(200).json({
      message: "切换组织成功",
      currentOrgId: user.currentOrgId
    });
  } catch (error) {
    console.error("switchCurrentOrg error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};

// 绑定用户到组织
export const bindOrg = async (req, res) => {
  try {
    const { orgId } = req.body;
    const userId = req.user._id;

    if (!orgId) {
      return res.status(400).json({ message: "orgId 不能为空" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "用户不存在" });
    }

    // 防止重复添加
    const isAlreadyIn = user.organizationIds.some(id => id.toString() === orgId);
    if (!isAlreadyIn) {
      user.organizationIds.push(orgId);
      // 如果是第一个组织，默认设为当前组织
      if (!user.currentOrgId) {
        user.currentOrgId = orgId;
      }
      await user.save();
    }

    res.status(200).json({
      message: "用户绑定组织成功",
      data: { userId, orgId }
    });
  } catch (error) {
    console.error("bindOrg error:", error);
    res.status(500).json({ message: "服务器错误" });
  }
};