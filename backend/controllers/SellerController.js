import bcrypt from "bcryptjs";
import Seller from "../models/SellerSignupSchema.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// signup route
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, mobile } = req.body;

        //check if  seller exists
        const existingSeller = await Seller.findOne({ email });

        if (existingSeller) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new seller
        const newSeller = new Seller({
            fullName,
            email,
            password: hashedPassword,
            mobile
        });

        await newSeller.save();

        res.status(201).json({ message: "Seller registered successfully!", sellerId: newSeller._id })
    } catch (error) {
        console.error("signup error", error);
        res.status(500).json({ message: "Server error" });
    }
};

// login route
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if seller exist
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(500).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { sellerId: seller._id, email: seller.email },
            process.env.JWT_SECRET || "mysecretkey",
            { expiresIn: "1h" }
        );
        res.status(200).json({ message: "Login successful", token, seller });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- Get seller profile by ID ---
export const getSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id).select("-password"); // exclude password
        if (!seller) return res.status(404).json({ error: "Seller not found" });
        res.json(seller);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// --- Update seller profile ---
export const updateSeller = async (req, res) => {
    try {
        const { fullName, email, mobile } = req.body;

        if (!fullName || !email || !mobile) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists for another seller
        const emailExists = await Seller.findOne({ email, _id: { $ne: req.params.id } });
        if (emailExists) {
            return res.status(400).json({ error: "Email is already in use by another account" });
        }

        const updatedSeller = await Seller.findByIdAndUpdate(
            req.params.id,
            { fullName, email, mobile },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedSeller) return res.status(404).json({ error: "Seller not found" });

        res.json(updatedSeller);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

// --- Change Password ---
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const seller = await Seller.findById(req.params.id);

        if (!seller || !seller.password) {
            return res.status(400).json({ error: "Seller not found or password missing" });
        }

        if (!currentPassword) {
            return res.status(400).json({ error: "Current password is required" });
        }

        const isMatch = await bcrypt.compare(currentPassword, seller.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect" });
        }

        // 2️⃣ Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // 3️⃣ Update seller password
        seller.password = hashedPassword;
        await seller.save();

        res.json({ message: "Password changed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};