import axios from "axios";

const API_URL = "http://localhost:8080/points";

// Nhập điểm mới
export const createPoint = async (point, token) => {
  const res = await axios.post(
    `${API_URL}?subjectId=${point.subjectId}`,
    {
      studentId: point.studentId,
      processScore: point.processScore,
      examScore: point.examScore,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};

// Cập nhật điểm
export const updatePoint = async (pointId, point, token) => {
  const res = await axios.put(
    `${API_URL}/${pointId}`,
    {
      processScore: point.processScore,
      examScore: point.examScore,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data.data;
};

// Lấy điểm theo ID
export const getPointById = async (pointId, token) => {
  const res = await axios.get(`${API_URL}/${pointId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Lấy bảng điểm theo sinh viên (có thể lọc theo học kỳ)
export const getPointsByStudent = async (studentId, token, semester) => {
  const url = semester
    ? `${API_URL}/student/${studentId}?semester=${semester}`
    : `${API_URL}/student/${studentId}`;

  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Xóa điểm
export const deletePoint = async (pointId, token) => {
  const res = await axios.delete(`${API_URL}/${pointId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
