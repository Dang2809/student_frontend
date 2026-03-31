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

export const getUsers = async (token) => {
  return axios.get(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const approveUser = async (username, token) => {
  const res = await axios.post(`${API_URL}/approve/${username}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const rejectUser = async (username, token) => {
  const res = await axios.post(`${API_URL}/reject/${username}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
