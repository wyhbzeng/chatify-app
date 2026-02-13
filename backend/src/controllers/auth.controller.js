import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import minioClient from "../lib/minioClient.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email" });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const newUser = new User({
            fullName,   
            email,
            password: hashedPassword,
        });

        if(newUser){
            const savedUser = await newUser.save();
            // 生成真实 JWT Token
            const token = generateToken(savedUser._id, res);
            
            // 在响应体中明确返回 Token
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                token: token // 关键：直接返回 Token
            })

            try {
                // await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.log("Error sending welcome email:", error);
            }
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller:",error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password){
            return res.status(400).json({ message: "Please fill all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 生成真实 JWT Token
        const token = generateToken(user._id, res);

        // 在响应体中明确返回 Token
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
            token: token // 关键：直接返回 Token
        })

    } catch (error) {
        console.log("Error in login controller:",error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const logout = (_, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller:",error);
        res.status(500).json({message: "Internal server error"})
    }
}

export const updateProfile = async (req, res) => {
    const { fullName } = req.body;
    const profilePicFile = req.file;
  
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (fullName) {
        user.fullName = fullName;
      }
  
      if (profilePicFile) {
        const bucketName = ENV.MINIO_BUCKET_NAME || 'chatify-profiles';
        const fileExt = path.extname(profilePicFile.originalname);
        const fileName = `avatar-${user._id}-${uuidv4()}${fileExt}`;
        
        await minioClient.putObject(
          bucketName,
          fileName,
          profilePicFile.buffer,
          profilePicFile.size,
          { 'Content-Type': profilePicFile.mimetype }
        );
  
        const profilePicUrl = `http://${ENV.MINIO_ENDPOINT || 'localhost'}:${ENV.MINIO_PORT || '9000'}/${bucketName}/${fileName}`;
        user.profilePic = profilePicUrl;
      }
  
      await user.save();
  
      res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      });
    } catch (error) {
      console.log("Error in updateProfile controller:", error);
      res.status(500).json({ 
        message: "Failed to update profile",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };