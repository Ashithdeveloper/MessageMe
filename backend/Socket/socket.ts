import dotenv from "dotenv";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { registerUserEvents } from "./userEvens.js";

dotenv.config();

export function initalizeSocket(server: any): SocketServer {
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  //  auth middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    jwt.verify( 
      token,
      process.env.JWT_SECRET as string,

      (err: any, decoded: any) => {
        if (err) {
          return next(new Error("Authentication error"));
        }
        console.log("JWT payload:", decoded);

        const user = decoded.user ?? decoded;

        // 🔥 FIX: support MongoDB + normal JWT
        const userId = user.id || user._id;

        if (!userId) {
          console.error("❌ Invalid JWT payload:", decoded);
          return next(new Error("Invalid token payload"));
        }

        socket.data.user = user;
        socket.data.userId = userId;

        
        next();
      }
    );
  });

  io.on("connection", (socket: Socket) => {
    const { userId, user } = socket.data;

    console.log(`User ${userId} username : ${user?.name} is connected`);

    registerUserEvents(io, socket);

    socket.on("disconnect", () => {
      console.log(`User ${userId} username : ${user?.name} is disconnected`);
    });
  });

  return io;
}
