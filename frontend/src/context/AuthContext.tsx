import React, { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../assets/assets";
import api from "../configs/api";
import toast from "react-hot-toast";

interface AuthContextProps {
  isLoggedIn: boolean;
  user: IUser | null;
  login: (user: { email: string; password: string }) => Promise<void>;
  signUp: (user: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ---------------- SIGN UP ---------------- */
  const signUp = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      const { data } = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }

      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
  };

  /* ---------------- VERIFY USER ---------------- */
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/api/auth/verify");

      if (data.user) {
        setUser(data.user);
        setIsLoggedIn(true);
      }
    } catch {
      logout();
    }
  };

  /* ---------------- ON APP LOAD ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        signUp,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
