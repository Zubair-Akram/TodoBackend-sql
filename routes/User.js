import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js"; // Import User model

const router = express.Router();

// Register User Route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Enter a valid email address"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
    body("username").notEmpty().withMessage("Username is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }

      // Hash password before saving to DB
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

// Login User Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id }, "123456789", {
      expiresIn: "1h",
    });

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
