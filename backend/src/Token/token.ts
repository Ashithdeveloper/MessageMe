import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const createToken = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export default createToken;
