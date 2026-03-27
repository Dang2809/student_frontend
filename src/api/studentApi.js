import axios from "axios";

const API_URL = "http://localhost:8080/students"; 
// chỉnh lại URL cho đúng backend của bạn

// Lấy toàn bộ danh sách sinh viên
export const getAllStudents = async (token) => {
  return axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Lấy thông tin sinh viên theo id
export const getStudentById = async (id, token) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Thêm sinh viên mới
export const createStudent = async (student, userId, token) => {
  return axios.post(`${API_URL}?userId=${userId}`, student, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Cập nhật sinh viên
export const updateStudent = async (id, student, token) => {
  return axios.put(`${API_URL}/${id}`, student, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Xóa sinh viên
export const deleteStudent = async (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
