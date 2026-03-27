import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getStudentById } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";

export default function StudentInfoPage() {
  const { id: routeId } = useParams(); // lấy id từ URL
  const { token, role } = useContext(AuthContext);

  const [id, setId] = useState(routeId || "");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStudent = async (targetId) => {
    if (!targetId) {
      return setError("Vui lòng nhập ID sinh viên!");
    }
    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const res = await getStudentById(targetId, token);
      setStudent(res.data);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (routeId) fetchStudent(routeId);
  }, [routeId]);

  if (!role) return <p className="text-center mt-5">Đang xác thực...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tra cứu thông tin sinh viên</h2>

      {/* Form nhập ID và nút tải dữ liệu */}
      <div className="card shadow p-3 mb-3">
        <input
          className="form-control mb-2"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Nhập ID sinh viên"
        />
        <div className="d-flex justify-content-between">
          <button className="btn btn-info" onClick={() => fetchStudent(id)}>
            Tải dữ liệu
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/homepage")}
          >
            Trở về trang chủ
          </button>
        </div>
      </div>

      {/* Trạng thái tải */}
      {loading && <p className="text-center mt-3">Đang tải...</p>}

      {/* Hiển thị lỗi */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Hiển thị thông tin sinh viên */}
      {student && (
        <div className="card shadow">
          <div className="card-body">
            <p><strong>Họ tên:</strong> {student.fullName}</p>
            <p><strong>Giới tính:</strong> {student.gender}</p>
            <p><strong>Ngày sinh:</strong> {student.dateOfBirth}</p>
            <p><strong>Địa chỉ:</strong> {student.address}</p>
          </div>
        </div>
      )}
    </div>
  );
}
