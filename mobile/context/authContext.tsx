import { login, register } from "@/services/authService";
import { AuthContextProps, DecodedTokenProps, UserProps } from "@/types";
import { useRouter } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { connectSocket, disconnectSocket } from "@/socket/socket";

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  updateToken: async () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const router = useRouter();

  // 🔥 load token ONCE
  useEffect(() => {
    loadToken();
  }, []);

  const loadToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");

      // ✅ NO TOKEN → go welcome
      if (!storedToken) {
        router.replace("/(auth)/welcome");
        return;
      }

      const decoded = jwtDecode<DecodedTokenProps>(storedToken);

      // ✅ TOKEN EXPIRED
      if (decoded.exp * 1000 < Date.now()) {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/welcome");
        return;
      }

      // ✅ TOKEN VALID
      setToken(storedToken);
      setUser(decoded.user);

      // ⛔ DO NOT await socket here
      connectSocket();

      router.replace("/(main)/home");
    } catch (error) {
      console.error("Error decoding token:", error);
      await AsyncStorage.removeItem("token");
      router.replace("/(auth)/welcome");
    }
  };

  const updateToken = async (token: string) => {
    await AsyncStorage.setItem("token", token);
    const decoded = jwtDecode<DecodedTokenProps>(token);
    setToken(token);
    setUser(decoded.user);
  };

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    await updateToken(response.token);
    connectSocket(); // ⛔ no await
    router.replace("/(main)/home");
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    profilepic?: string
  ) => {
    const response = await register(email, password, name, profilepic);
    await updateToken(response.token);
    connectSocket(); // ⛔ no await
    router.replace("/(main)/home");
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
    disconnectSocket();
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, signIn, signUp, signOut, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
