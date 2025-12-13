// frontend/src/hooks/useAuth.js
import jwtDecode from "jwt-decode";

export function useAuth() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode(token);  // { id, email, role, name }
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}