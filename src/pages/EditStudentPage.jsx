import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";

export default function EditStudentPage() {
  const { token } = useContext(AuthContext);
  const { id } = useParams(); // lấy student_id từ URL
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
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
    fetchStudent();
  }, [id, token]);

  const handleSubmit = (form) => updateStudent(id, form, token);

  const handleSuccess = () => {
    setAlert({ type: "success", text: "Cập nhật thành công!" });
    setTimeout(() => {
      setAlert(null);
      navigate("/students");
    }, 3000);
  };

  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể cập nhật: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Sửa thông tin sinh viên</h2>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {student && (
        <StudentForm
          initialData={student}
          submitLabel="Cập nhật"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

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
