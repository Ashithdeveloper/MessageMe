import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config();

interface TokenPayload {
  id: string;
  name: string;
  email?: string;
}

type UserForToken = {
  _id: Types.ObjectId;   // ✅ correct Mongoose type
  name: string;
  email?: string;
};

const createToken = (user: UserForToken): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const payload: TokenPayload = {
    id: user._id.toString(),   // 🔥 FIX HERE
    name: user.name,
    ...(user.email ? { email: user.email } : {}),
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default createToken;
