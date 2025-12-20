import { BASE_URL } from "@/config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
  if (socket) return socket;

  const token = await AsyncStorage.getItem("token");
  if (!token) return null;

  socket = io(BASE_URL, {
    transports: ["websocket"], // 🔥 REQUIRED for RN
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("✅ RN Socket connected:", socket?.id);
  });

  socket.on("connect_error", (err) => {
    console.log("❌ RN Socket error:", err.message);
  });

  socket.on("disconnect", () => {
    console.log("❌ RN Socket disconnected");
  });

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};   
