import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentById, updateStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import StudentForm from "../components/StudentForm";

export default function EditStudentPage() {
  const { token, role } = useContext(AuthContext);
  const { id } = useParams(); // lấy student_id từ URL
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await getStudentById(id, token); // đã là object sinh viên
        setStudent(studentData);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
        setAlert({ type: "danger", text: "Không thể tải dữ liệu: " + msg });
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id, token]);

  const handleSubmit = async (form) => {
    try {
      await updateStudent(id, form, token);
      handleSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      handleError(msg);
    }
  };

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
    <div className="container mt-3">
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
          Trở về
        </button>
      </div>
    </div>
  );
}
