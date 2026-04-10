// SubjectsPage.jsx
import { useEffect, useState, useContext } from "react";
import { getAllSubjects } from "../api/subjectService"; // service bạn đã viết
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import { deleteSubject } from "../api/subjectService"; 

export default function SubjectsPage() {
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = checkAdmin(role);

    useEffect(() => {
    const fetchSubjects = async () => {
      if (!isAdmin) {
        setLoading(false);
        return;
      }
      try {
        const subjects = await getAllSubjects(token); 
        setSubjects(subjects || []);
      } catch (err) {
        setAlert({ type: "danger", text: "Không thể tải danh sách môn học: " + err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, [isAdmin, token]);

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

  // Lọc môn học theo ID hoặc tên
  const filteredSubjects = subjects.filter(
    (s) =>
      s.id.toString().includes(searchTerm) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSubject = currentPage * pageSize;
  const indexOfFirstSubject = indexOfLastSubject - pageSize;
  const currentSubjects = filteredSubjects.slice(indexOfFirstSubject, indexOfLastSubject);
  const totalPages = Math.ceil(filteredSubjects.length / pageSize);

  return (
    <div className="container mt-3">
      <h2 className="mb-4 text-center">Danh sách môn học</h2>

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
          <input
            type="text"
            className="form-control"
            placeholder="Tìm theo ID hoặc tên môn..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Link to="/subjects/add" className="btn btn-success">
            <i className="bi bi-plus-circle"></i> Thêm
          </Link>
        </div>
      </div>

      {/* Bảng danh sách môn học */}
        <div className="table-responsive">
        <table className="table table-bordered table-striped mb-0">
            <thead className="table-dark">
            <tr>
                <th>Mã môn học</th>
                <th>Tên môn học</th>
                <th>Số tín chỉ</th>
                <th>Học kỳ</th>
                <th>Tỷ lệ điểm quá trình</th>
                <th>Tỷ lệ điểm thi</th>
                <th>Hành động</th> {/* thêm cột hành động */}
            </tr>
            </thead>
            <tbody>
            {currentSubjects.length > 0 ? (
                currentSubjects.map((s) => (
                <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.credits}</td>
                    <td>{s.semester}</td>
                    <td>{s.ratioProcess}</td>
                    <td>{s.ratioExam}</td>
                    <td className="text-center">
                      <Link 
                        to={`/subjects/edit/${s.id}`} 
                        className="btn btn-warning btn-sm me-2"
                      >
                        <i className="bi bi-pencil-square"></i> Sửa
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={async () => {
                          if (window.confirm(`Bạn có chắc muốn xóa môn ${s.name}?`)) {
                            try {
                              await deleteSubject(s.id, token);
                              setSubjects(subjects.filter((sub) => sub.id !== s.id));
                              setAlert({ type: "success", text: "Xóa môn học thành công" });
                            } catch (err) {
                              setAlert({ type: "danger", text: "Xóa môn học thất bại: " + err.message });
                            }
                          }
                        }}
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


      {/* Phân trang */}
      <div className="d-flex justify-content-center mt-3 align-items-center gap-2">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
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

        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
}
