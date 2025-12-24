import type { Request, Response } from "express";
import { comparePassword, hashPassword } from "../../config/hashpassword.js";
import User from "../model/auth.model.js";
import createToken from "../Token/token.js";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
// Register Controller
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password , profilepic } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilepic
    });

    const token = createToken(user);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login Controller
export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProfile = async (req: AuthRequest, res: Response) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("REQ.BODY:", req.body);

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, password, profilepic } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    if (password && password.trim().length >= 6) {
      user.password = await hashPassword(password);
    }

    if (profilepic) user.profilepic = profilepic;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilepic: user.profilepic,
      },
    });
  } catch (error) {
    console.error("🔥 EDIT PROFILE CRASH:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getProfileDetails = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};