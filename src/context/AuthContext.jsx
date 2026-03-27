import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null); // thêm username

  const extractData = (jwt) => {
    try {
      const decoded = jwtDecode(jwt);

      return {
        role: decoded.roles || decoded.authorities || decoded.role || null,
        userId: decoded.userId || decoded.id || null,
        username: decoded.sub || decoded.username || null, // lấy tên user
      };
    } catch (err) {
      console.log("Lỗi decode token:", err);
      return { role: null, userId: null, username: null };
    }
  };

  const login = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);

    const data = extractData(jwt);
    setRole(data.role);
    setUserId(data.userId);
    setUsername(data.username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    setUsername(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const data = extractData(savedToken);
      setRole(data.role);
      setUserId(data.userId);
      setUsername(data.username);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// kiểm tra admin
export const checkAdmin = (role) => {
  if (!role) return false;
  const roles = Array.isArray(role) ? role : [role];
  return roles.some((r) => r?.toString().toUpperCase().includes("ADMIN"));
};
