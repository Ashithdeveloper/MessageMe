import { Platform } from "react-native";


export const BASE_URL =
  Platform.OS === "android" && !__DEV__
    ? "https://your-production-url.com"
    : Platform.OS === "android"
      ? "http://192.168.18.26:3000"
      : "http://localhost:3000";

export const CLOUDINARY_CLOUD_NAME = "de3svehop";
export const CLOUDINARY_API_KEY="541545114691256"
export const CLOUDINARY_API_SECRET="3ZL8G6Fxsx7VKrt_pNpR_CC8DKs"
