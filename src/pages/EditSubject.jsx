import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubjectById, updateSubject } from "../api/subjectService";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import SubjectForm from "../components/SubjectForm";

export default function EditSubject() {
  const { token, role } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const subjectData = await getSubjectById(id, token);
        setSubject(subjectData);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
        setAlert({ type: "danger", text: "Không thể tải dữ liệu: " + msg });
      } finally {
        setLoading(false);
      }
    };
    fetchSubject();
  }, [id, token]);

  const handleSubmit = (form) => updateSubject(id, form, token);

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Cập nhật thành công!" });
    setTimeout(() => {
      setAlert(null);
      navigate("/subjects");
    }, 3000);
  };

  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể cập nhật: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

  if (!isAdmin) {
    return (
      <div className="container mt-3 text-center">
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
      <h2 className="mb-4 text-center">Sửa thông tin môn học</h2>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {subject && (
        <SubjectForm
          initialData={subject}
          submitLabel="Cập nhật"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

    </div>
  );
}
