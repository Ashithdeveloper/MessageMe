import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { JwtPayload } from "jsonwebtoken";

/* ==============================
   Extend Express Request
================================ */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/* ==============================
   JWT Verify Middleware
================================ */
const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(req.headers.authorization);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET not configured" });
  }

  try {
    const decoded = jwt.verify(token as string , process.env.JWT_SECRET) as JwtPayload;

    req.user = { id: decoded.id };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyToken;
