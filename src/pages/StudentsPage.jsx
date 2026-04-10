import { useEffect, useState, useContext } from "react";
import { getAllStudents, deleteStudent } from "../api/studentApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function StudentsPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(30);

  const [searchTerm, setSearchTerm] = useState(""); // thêm state cho tìm kiếm

  const isAdmin = checkAdmin(role);

  useEffect(() => {
  const fetchStudents = async () => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    try {
      const studentsData = await getAllStudents(token);
      setStudents(Array.isArray(studentsData) ? studentsData : []);
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
          Bạn không có quyền truy cập trang này!
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  // Lọc sinh viên theo ID hoặc tên
  const filteredStudents = students.filter(
    (s) =>
      s.id.toString().includes(searchTerm) ||
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * pageSize;
  const indexOfFirstStudent = indexOfLastStudent - pageSize;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / pageSize);

  return (
    <div className="container mt-3">
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
        <div className="d-flex gap-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo ID hoặc tên..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset về trang đầu khi tìm kiếm
            }}
          />
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
              <th>Mã Sinh viên</th>
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
                    <Link to={`/students/edit/${s.id}`} className="btn btn-warning btn-sm me-2">
                      <i className="bi bi-pencil-square"></i> Sửa
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>
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

      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-3 align-items-center gap-2">
        <button className="btn btn-secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Trang trước
        </button>

        <input
          type="number"
          className="form-control"
          style={{ width: "80px" }}
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = Number(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
            }
          }}
        />

        <span>/ {totalPages}</span>
        <button className="btn btn-secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
          Trang sau
        </button>
      </div>
    </div>
  );
}
