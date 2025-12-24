import { CLOUDINARY_CLOUD_NAME } from "@/config/api";

export const uploadToCloudinary = async (file: any): Promise<string> => {
  const CLOUD_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    type: "image/jpeg",
    name: "upload.jpg",
  } as any);

  formData.append("upload_preset", "test_rn_upload_123");

  // 🔥 FIX: use CLOUD_API directly
  const res = await fetch(CLOUD_API, {
    method: "POST",
    body: formData,
  });

  const text = await res.text();
  console.log("CLOUDINARY RAW:", text);

  const data = JSON.parse(text);

  if (!res.ok) {
    throw new Error(data?.error?.message || "Upload failed");
  }

  return data.secure_url;
};
