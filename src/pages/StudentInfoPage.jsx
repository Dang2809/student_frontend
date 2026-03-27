import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getStudentById, getStudentByName } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";

export default function StudentInfoPage() {
  const { id: routeId } = useParams();
  const { token, role } = useContext(AuthContext);

  const [id, setId] = useState(routeId || "");
  const [name, setName] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getErrorMessage = (err) =>
    err.response?.data?.message || err.message || "Có lỗi xảy ra";

  const fetchStudent = async (targetId) => {
    if (!targetId) {
      setStudent(null);
      return setError("Vui lòng nhập ID sinh viên!");
    }
    setLoading(true);
    setError("");
    setStudent(null);
    try {
      const res = await getStudentById(targetId, token);
      setStudent(res.data.student || res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentByName = async (targetName) => {
    if (!targetName) {
      setStudent(null);
      return setError("Vui lòng nhập tên sinh viên!");
    }
    setLoading(true);
    setError("");
    setStudent(null);
    try {
      const res = await getStudentByName(targetName, token);
      setStudent(res.data.student || res.data);
    } catch (err) {
      setError(getErrorMessage(err));
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
      <h2 className="mb-4 text-center">Tra cứu thông tin sinh viên</h2>

      {/* Nút trở về trang chủ ngay dưới tiêu đề, bên trái */}
      <div className="mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => (window.location.href = "/homepage")}
        >
          Trở về trang chủ
        </button>
      </div>

      {/* Hai form chia đôi cùng hàng */}
      <div className="row">
        <div className="col-md-6">
          <div className="card shadow p-3 mb-3">
            <h5 className="mb-3">Tra cứu theo ID</h5>
            <input
              className="form-control mb-2"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Nhập ID sinh viên"
            />
            <button className="btn btn-info w-100" onClick={() => fetchStudent(id)}>
              Tìm theo ID
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow p-3 mb-3">
            <h5 className="mb-3">Tra cứu theo Tên</h5>
            <input
              className="form-control mb-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên sinh viên"
            />
            <button className="btn btn-success w-100" onClick={() => fetchStudentByName(name)}>
              Tìm theo Tên
            </button>
          </div>
        </div>
      </div>

      {/* Trạng thái tải */}
      {loading && <p className="text-center mt-3">Đang tải...</p>}

      {/* Hiển thị lỗi */}
      {error && (
        <div className="alert alert-danger text-center mt-3">
          {error}
        </div>
      )}

      {/* Hiển thị thông tin sinh viên */}
      {student && (
        <div className="card shadow mt-3">
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
