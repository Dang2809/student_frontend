import { useEffect, useState, useContext } from "react";
import { getMyStudentInfo } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";

export default function StudentInfoPage() {
  const { token } = useContext(AuthContext);

  const [student, setStudent] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await getMyStudentInfo(token);
        setStudent(res.data.data);
        setAlert(null);
      } catch (err) {
        setStudent(null);

        let message = "Lỗi tải dữ liệu";

        if (err.response?.data) {
          message =
            err.response.data.message ||
            err.response.data.error ||
            message;
        } else if (err.message) {
          message = err.message;
        }

        setAlert({
          type: "danger",
          text: message,
        });
      } finally {
        setLoading(false);
      }
    };


    fetchStudent();
  }, [token]);

  // ===== UI STATE =====
  if (!token) return <p>Chưa đăng nhập</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h2>Thông tin cá nhân</h2>

      {/* Alert */}
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.text}
        </div>
      )}

      {student && (
        <div className="card mt-3">
          <div className="card-body">
            <p><strong>Mã sinh viên:</strong> {student.id}</p>
            <p><strong>Họ và tên:</strong> {student.fullName}</p>
            <p><strong>Giới tính:</strong> {student.gender}</p>
            <p><strong>Ngày sinh:</strong> {student.dateOfBirth}</p>
            <p><strong>Địa chỉ:</strong> {student.address}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!student && !alert && <p>Không có dữ liệu</p>}
    </div>
  );
}