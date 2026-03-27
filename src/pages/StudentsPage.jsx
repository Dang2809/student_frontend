import { useEffect, useState, useContext } from "react";
import { getAllStudents } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StudentsPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  const isAdmin = role?.toString().toUpperCase().includes("ADMIN");

  useEffect(() => {
    const fetchStudents = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      try {
        const res = await getAllStudents(token);
        setStudents(res.data?.data || []);
      } catch (err) {
        alert("Không thể tải danh sách sinh viên: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isAdmin, token]);

  if (loading) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền xem danh sách sinh viên!
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const indexOfLastStudent = currentPage * pageSize;
  const indexOfFirstStudent = indexOfLastStudent - pageSize;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const totalPages = Math.ceil(students.length / pageSize);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mt-5">
      {/* Tiêu đề trên cùng bên trái */}
      <h2 className="mb-4">Xem danh sách sinh viên</h2>

      {/* Thanh công cụ phía trên bảng */}
      <div className="d-flex justify-content-between mb-3">
        {/* Bên trái: nút trở về */}
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/homepage")}
          >
            Trở về trang chủ
          </button>
        </div>

        {/* Bên phải: nút CRUD */}
        <div className="d-flex gap-2">
          <Link to="/students/add" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Thêm
          </Link>
          <Link to="/students/edit/1" className="btn btn-warning">
            <i className="bi bi-pencil-square"></i> Sửa
          </Link>
          <Link to="/students/delete/1" className="btn btn-danger">
            <i className="bi bi-trash"></i> Xóa
          </Link>
        </div>

      </div>

      {/* Bảng danh sách sinh viên */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID Sinh viên</th>
              <th>Họ tên</th>
              <th>Giới tính</th>
              <th>Ngày sinh</th>
              <th>Địa chỉ</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.fullName}</td>
                  <td>{s.gender}</td>
                  <td>{s.dateOfBirth}</td>
                  <td>{s.address}</td>
                  <td>{s.userId}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >Trang sau
        </button>
      </div>
    </div>
  );
}
