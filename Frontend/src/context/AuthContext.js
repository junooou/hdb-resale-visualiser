import { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fetch user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    }
  }, []);

  // Fetch User's profile
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("account/user-profile/");
      setUsername(res.data.username);
      localStorage.setItem("username", res.data.username);
      setIsLoggedIn(true);
    } catch {
      setIsLoggedIn(false);
    }
  };

  // Handle User Login (and Stores Tokens)
  const handleLogin = async (username, password) => {
    try {
      const res = await axiosInstance.post("account/login/", { username, password });
      localStorage.setItem("access_token", res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      fetchUser();
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  // Handle User Logout (and Clear All Tokens)
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setUsername("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, isLoginOpen, setIsLoginOpen, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};