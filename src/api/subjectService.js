import axios from "axios";

const API_URL = "http://localhost:8080/subjects";

// Lấy toàn bộ môn học
export const getAllSubjects = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

// Thêm môn học mới
export const createSubject = async (subject, token) => {
  const res = await axios.post(API_URL, subject, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
};

export const updateSubject = async (id, subject, token) => {
  const res = await axios.put(`${API_URL}/${id}`, subject, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getSubjectById = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Xóa môn học theo ID
export const deleteSubject = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // thường chỉ trả về status + message
};