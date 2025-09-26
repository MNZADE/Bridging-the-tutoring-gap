import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ==================== CREATE ADMIN ====================
// This will run once when the server starts
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      const adminUser = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        standard: "N/A",
        stream: "N/A",
      });

      await adminUser.save();
      console.log("✅ Admin user created:", adminUser.email);
    } else {
      console.log("ℹ️ Admin user already exists:", existingAdmin.email);
    }
  } catch (err) {
    console.error("❌ Error creating admin user:", err.message);
  }
};

// Call the function once when server starts
createAdminUser();

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, standard, stream, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Name, Email, and Password are required" });
    }

    const userRole = role || "student";

    if (userRole === "student") {
      if (!standard) return res.status(400).json({ msg: "Standard is required for students" });
      if ((standard === "11" || standard === "12") && !stream) {
        return res.status(400).json({ msg: "Stream is required for classes 11 and 12" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      standard: userRole === "student" ? standard : "N/A",
      stream: userRole === "student" ? (stream || "N/A") : "N/A",
      role: userRole,
    });

    await user.save();

    console.log("✅ User registered:", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      msg: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        standard: user.standard,
        stream: user.stream,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not set in environment variables" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      standard: user.standard,
      stream: user.stream,
      role: user.role,
    };

    console.log("✅ User logged in:", userData);

    res.status(200).json({
      msg: "Login successful",
      token,
      user: userData,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
});

export default router;
