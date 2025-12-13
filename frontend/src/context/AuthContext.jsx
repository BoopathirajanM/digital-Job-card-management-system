// frontend/src/context/AuthContext.jsx
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// Helper function to get initial user from token
function getInitialUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Invalid token, clearing...", error);
    localStorage.removeItem("token");
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  // Initialize user state from token (no useEffect needed)
  const [user, setUser] = useState(() => getInitialUser());

  // Login function → save token + decode
  function login(token) {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
    navigate("/dashboard");
  }

  // Logout function → clear token + redirect
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth anywhere
export function useAuth() {
  return useContext(AuthContext);
}