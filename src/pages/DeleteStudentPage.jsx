import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentById, deleteStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";

export default function DeleteStudentPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  // State quản lý ID nhập, dữ liệu sinh viên, trạng thái tải và thông báo
  const [id, setId] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); 
  // alert = { type: "success" | "danger", text: "..." }

  // Kiểm tra quyền admin
  const isAdmin = checkAdmin(role);

  // Nếu không phải admin thì chặn ngay từ đầu
  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền xóa sinh viên!
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  // Hàm lấy message lỗi từ backend
  const getErrorMessage = (err) =>
    err.response?.data?.message || err.message || "Có lỗi xảy ra";

  // Tải dữ liệu sinh viên theo ID
  const fetchStudent = async () => {
    if (!id) return setAlert({ type: "danger", text: "Vui lòng nhập ID sinh viên!" });
    setLoading(true);
    setAlert(null);
    try {
      const res = await getStudentById(id, token);
      setStudent(res.data);
    } catch (err) {
      setAlert({ type: "danger", text: "Không thể tải dữ liệu: " + getErrorMessage(err) });
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async () => {
  if (!id) {
    return setAlert({ type: "danger", text: "Vui lòng nhập ID sinh viên cần xóa!" });
  }

  // Hộp thoại xác nhận trước khi xóa
  const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ID: ${id}?`);
  if (!confirmed) return; // nếu bấm Cancel thì dừng

  try {
    await deleteStudent(id, token);
    setAlert({ type: "success", text: `Xóa sinh viên ID: ${id} thành công!` });
    navigate("/students");
    setStudent(null);
  } catch (err) {
    setAlert({ type: "danger", text: "Không thể xóa sinh viên: " + getErrorMessage(err) });
  } finally {
    // Tự động ẩn alert sau 5 giây
    setTimeout(() => setAlert(null), 5000);
  }
};

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Xóa sinh viên</h2>

      {/* Hiển thị thông báo */}
      {alert && (
        <div className={`alert alert-${alert.type} text-center`}>
          {alert.text}
        </div>
      )}

      {/* Nhập ID để tìm sinh viên */}
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
          {/* Nút xác nhận xóa */}
          <button className="btn btn-danger" onClick={handleDelete}>
          Xác nhận xóa
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/students")}
          >
            Trở về danh sách sinh viên
          </button>
        </div>
      </div>

      {loading && <div>Đang tải dữ liệu...</div>}

      {/* Hiển thị thông tin sinh viên */}
      {student && (
        <div className="card shadow p-3 mb-3 text-start">
          <p><strong>Họ tên:</strong> {student.fullName}</p>
          <p><strong>Giới tính:</strong> {student.gender}</p>
          <p><strong>Ngày sinh:</strong> {student.dateOfBirth}</p>
          <p><strong>Địa chỉ:</strong> {student.address}</p>
        </div>
      )}
    </div>
  );
}
