import bcrypt from "bcryptjs";
import User from "../models/UserSignupSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//signup route
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, mobile } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash Password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create New User 
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            mobile
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully!", userId: newUser._id });
    } catch (error) {
        console.log("Signup error", error);
        res.status(500).json({ message: "Server error" });
    }
};

// login route
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;

        // check if user exist 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        // verify password 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid email or password" })
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || "mysecretkey",
            { expiresIn: "1h" }
        );
        // res.status(200).json({ message: "Login successful", token, user });

        // 4. Send success response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
            token,
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- Get user profile by ID ---
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password"); // exclude password
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// --- Update user profile ---
export const updateUser = async (req, res) => {
    try {
        const { fullName, email, mobile } = req.body;

        if (!fullName || !email || !mobile) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists for another user
        const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
        if (emailExists) {
            return res.status(400).json({ error: "Email is already in use by another account" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { fullName, email, mobile },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ error: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// --- Change Password ---
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // 1️⃣ Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

        // 2️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3️⃣ Update user password
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};