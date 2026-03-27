import React, { useState, useContext } from "react";
import { getStudentById, updateStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";

export default function EditStudentPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">Bạn không có quyền sửa sinh viên!</div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const fetchStudent = async () => {
    if (!id) return setAlert({ type: "danger", text: "Vui lòng nhập ID sinh viên!" });
    setLoading(true);
    setAlert(null);
    try {
      const res = await getStudentById(id, token);
      setStudent(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      setAlert({ type: "danger", text: "Không thể tải dữ liệu: " + msg });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (form, token) => updateStudent(id, form, token);

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Cập nhật thành công!" });
    setTimeout(() => {
    setAlert(null);
    navigate("/students"); // điều hướng về trang chủ
  }, 5000);
  };

  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể cập nhật: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sửa thông tin sinh viên</h2>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {/* Nhập ID để tải dữ liệu */}
      <div className="card shadow p-3 mb-3">
        <input
          className="form-control mb-2"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Nhập ID sinh viên"
        />
        <div className="d-flex justify-content-between">
          <button className="btn btn-info" onClick={fetchStudent}>
            Tải dữ liệu
          </button>
          <button className="btn btn-secondary" onClick={() => navigate("/students")}>
            Trở về danh sách sinh viên
          </button>
        </div>
      </div>

      {loading && <div className="text-center">Đang tải dữ liệu...</div>}

      {/* Form sửa thông tin dùng StudentForm */}
      {student && (
        <StudentForm
          initialData={student}
          submitLabel="Cập nhật"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}
    </div>
  );
}
