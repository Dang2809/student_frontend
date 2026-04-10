import axios from "axios";

const API_URL = "http://localhost:8080/api/phuckhao";

// Sinh viên gửi yêu cầu phúc khảo
export const submitPhucKhao = async (data, token) => {
  const payload = {
    studentId: data.studentId,
    subjectId: data.subjectId,
    semester: data.semester,     // học kỳ
    currentScore: data.currentScore, // điểm hiện tại (examScore hoặc finalScore)
    lyDo: data.lyDo,             // lý do phúc khảo
  };

  const res = await axios.post(API_URL, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Admin lấy danh sách yêu cầu pending
export const getPendingPhucKhao = async (token) => {
  const res = await axios.get(`${API_URL}/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

export const getAllPhucKhao = async (token) => {
  const res = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};

// Admin duyệt yêu cầu phúc khảo (có phản hồi)
export const reviewPhucKhao = async (id, status, phanHoi, token) => {
  const res = await axios.post(
    `${API_URL}/review`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { id, status, phanHoi },
    }
  );
  return res.data.data;
};

// Sinh viên xem danh sách phúc khảo của mình
export const getStudentPhucKhao = async (studentId, token) => {
  const res = await axios.get(`${API_URL}/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
};
