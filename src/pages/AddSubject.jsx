import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createSubject } from "../api/subjectService";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import SubjectForm from "../components/SubjectForm";

export default function AddSubject() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);

  const handleSubmit = (form) => createSubject(form, token);
  const isAdmin = checkAdmin(role);

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Thêm môn học thành công!" });
    setTimeout(() => {
      setAlert(null);
      navigate("/subjects");
    }, 3000);
  };


  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể thêm môn học: " + msg });
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
      <h2 className="mb-4 text-center">Thêm môn học</h2>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      <SubjectForm
        submitLabel="Thêm mới"
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      />

    </div>
  );
}
