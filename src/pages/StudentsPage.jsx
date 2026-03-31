import { useEffect, useState, useContext } from "react";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StudentsPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

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
        setAlert({ type: "danger", text: "Không thể tải danh sách sinh viên: " + err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [isAdmin, token]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sinh viên ID: ${id}?`);
    if (!confirmed) return;

    try {
      await deleteStudent(id, token);
      setAlert({ type: "success", text: `Xóa sinh viên ID: ${id} thành công!` });
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      setAlert({ type: "danger", text: "Không thể xóa sinh viên: " + err.message });
    } finally {
      setTimeout(() => setAlert(null), 5000);
    }
  };

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

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Danh sách sinh viên</h2>

      {alert && (
        <div className={`alert alert-${alert.type} text-center`}>
          {alert.text}
        </div>
      )}

      {/* Thanh công cụ trên cùng */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
        <div className="d-flex gap-2">
          <Link to="/students/add" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Thêm
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
              <th>Hành động</th>
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
                  <td>
                    <Link
                      to={`/students/edit/${s.id}`}
                      className="btn btn-warning btn-sm me-2"
                    >
                      <i className="bi bi-pencil-square"></i> Sửa
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(s.id)}
                    >
                      <i className="bi bi-trash"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang kiểu Bootstrap, nằm chính giữa */}
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trang trước
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Trang sau
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
