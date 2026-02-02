import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({ message: "Please fill all fields" });
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({ message: "Invalid email" });
        }

        // check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // 123456 => $dnjasdkasj_?dmsakmk
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            const savedUser = await newUser.save();
            const token = generateToken(savedUser._id,res);
            
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })

            // send welcome email
            try {
                await sendWelcomeEmail(savedUser.email, savedUser.fullName, ENV.CLIENT_URL);
            } catch (error) {
                console.log("Error sending welcome email:", error);
                return res.status(500).json({ message: "Failed to send welcome email" });
            }
        } else {
            return res.status(400).json({ message: "Invalid user data" });
        }

        

    } catch (error) {
        console.log("Error in signup controller:",error);
        res.status(500).json({message: "Internal server error"})
    }
}