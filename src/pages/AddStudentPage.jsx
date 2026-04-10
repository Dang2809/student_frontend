import React, { useContext, useState } from "react";
import { createStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm";

export default function AddStudentPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);

  const handleSubmit = async (form) => {
    try {
      await createStudent(
        {
          fullName: form.fullName,
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          address: form.address,
        },
        form.userId,
        token
      );
      handleSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      handleError(msg);
    }
  };

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Thêm sinh viên thành công!" });
    setTimeout(() => {
      setAlert(null);
      navigate("/students");
    }, 3000);
  };

  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể thêm sinh viên: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền truy cập trang này!
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Thêm sinh viên mới</h2>
      {alert && (
        <div className={`alert alert-${alert.type} text-center`}>
          {alert.text}
        </div>
      )}
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
          Trở về
        </button>
      </div>
    </div>
  );
}
