import React, { useContext, useState } from "react";
import { createStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";

export default function AddStudentPage() {
  const { role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">Bạn không có quyền thêm sinh viên!</div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const handleSubmit = (form, token) =>
    createStudent(
      { fullName: form.fullName, gender: form.gender, dateOfBirth: form.dateOfBirth, address: form.address },
      form.userId,
      token
    );

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Thêm sinh viên thành công!" });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể thêm sinh viên: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Thêm sinh viên mới</h2>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}
      <StudentForm 
        initialData={null} 
        submitLabel="Thêm sinh viên" 
        onSubmit={handleSubmit} 
        onSuccess={handleSuccess} 
        onError={handleError} 
      />
      <div className="text-center mt-3">
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate("/students")}
      >
        Trở về danh sách sinh viên
      </button>
    </div>
    </div>
  );
}
