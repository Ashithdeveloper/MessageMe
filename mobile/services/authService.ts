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
export const getDetails = async () => {
  try {
    const response = await axios.get<AuthResponse>(
      `${BASE_URL}/api/auth/profile`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (
  name: string,
  email: string,
  password?: string,
  profilepic?: string
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/api/auth/profile/edit`, 
      {
        name,
        email,
        password,
        profilepic,
      }
    );

    return response.data;
  } catch (error) {
    console.log("updateProfile error:", error);
    throw error; // IMPORTANT
  }
};