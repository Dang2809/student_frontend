import axios from "axios";

const API_URL = "http://localhost:8080/students"; 
// chỉnh lại URL cho đúng backend của bạn

// Lấy toàn bộ danh sách sinh viên
export const getAllStudents = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data; // lấy đúng mảng data
};

// Lấy thông tin sinh viên theo id
export const getStudentById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Tìm sinh viên theo tên
export const getStudentByName = async (name, token) => {
  const res = await axios.get(`${API_URL}/search?name=${encodeURIComponent(name)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Thêm sinh viên mới
export const createStudent = async (student, userId, token) => {
  const res = await axios.post(`${API_URL}?userId=${userId}`, student, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Cập nhật sinh viên
export const updateStudent = async (id, student, token) => {
  const res = await axios.put(`${API_URL}/${id}`, student, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Xóa sinh viên
export const deleteStudent = async (id, token) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


// Lấy thông tin sinh viên của chính user đang đăng nhập
export const getMyStudentInfo = async (token) => {
  return await axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};