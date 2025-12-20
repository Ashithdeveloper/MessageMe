import axios from "axios";
import { BASE_URL } from "@/config/api";

interface AuthResponse {
  token: string;
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/api/auth/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  name: string,
  profilepic?: string
): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${BASE_URL}/api/auth/register`, {
    email,
    password,
    name,
    profilepic,
  });
  return response.data;
};
