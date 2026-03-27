// Gọi API liên quan đến đăng nhập, đăng ký, nâng quyền
import axios from "axios";

const API_URL = "http://localhost:8080/auth";

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password });
  return res.data; // trả về token JWT
};

export const register = async (username, password) => {
  const res = await axios.post(`${API_URL}/register`, { username, password });
  return res.data;
};

export const promoteToAdmin = async (username, token) => {
  const res = await axios.post(
    `${API_URL}/promote/${username}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
