import { useState, useContext } from "react";
import { getStudentById, getStudentByName } from "../api/studentApi";
import { getPointsByStudent, deletePoint } from "../api/pointService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function PointPage() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [alert, setAlert] = useState(null);
  const [semesterFilter, setSemesterFilter] = useState("");

  const getErrorMessage = (err) =>
    err.response?.data?.message || err.message || "Có lỗi xảy ra";

  const fetchStudent = async (type) => {
    if (!searchValue) {
      setError("Vui lòng nhập thông tin!");
      return;
    }
    if (type === "id" && isNaN(searchValue)) {
      setError("ID phải là số. Vui lòng nhập lại!");
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);
    setPoints([]);

    try {
      const studentData =
        type === "id"
          ? await getStudentById(searchValue, token)
          : await getStudentByName(searchValue, token);

      setStudent(studentData);

      // gọi API lấy điểm (không lọc học kỳ lúc đầu)
      const pointsData = await getPointsByStudent(studentData.id, token);
      setPoints(pointsData || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSemesterChange = async (value) => {
    setSemesterFilter(value);
    if (student) {
      const pointsData = await getPointsByStudent(student.id, token, value);
      setPoints(pointsData || []);
    }
  };

  const handleDelete = async (pointId) => {
    if (!window.confirm("Bạn có chắc muốn xóa điểm này?")) return;
    try {
      await deletePoint(pointId, token);
      setPoints(points.filter((p) => p.id !== pointId));
      setAlert({ type: "success", text: "Xóa điểm thành công!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("vi-VN");

  if (!token) return <p className="text-center mt-5">Chưa đăng nhập</p>;

  return (
    <div className="container mt-3">
      <h2 className="mb-4 text-center">Quản lý điểm sinh viên</h2>

      <button className="btn btn-secondary mb-3" onClick={() => navigate("/homepage")}>
        Trở về trang chủ
      </button>

      {/* Search sinh viên */}
      <div className="card shadow p-3 mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Nhập ID hoặc tên sinh viên"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <div className="d-flex gap-2">
          <button className="btn btn-info btn-sm" onClick={() => fetchStudent("id")}>
            Tìm theo ID
          </button>
          <button className="btn btn-success btn-sm" onClick={() => fetchStudent("name")}>
            Tìm theo Tên
          </button>
        </div>
      </div>

      {loading && <p className="text-center">Đang tải...</p>}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {student && (
        <>
          {/* Thông tin sinh viên */}
          <div className="card shadow mt-3">
            <div className="card-body">
              <p><strong>ID:</strong> {student.id}</p>
              <p><strong>Họ tên:</strong> {student.fullName}</p>
              <p><strong>Giới tính:</strong> {student.gender}</p>
              <p><strong>Ngày sinh:</strong> {formatDate(student.dateOfBirth)}</p>
              <p><strong>Địa chỉ:</strong> {student.address}</p>

              <div className="mt-3">
                <Link to={`/points/add/${student.id}`} className="btn btn-primary">
                  <i className="bi bi-journal-plus"></i> Nhập điểm
                </Link>
              </div>
            </div>
          </div>

          {/* Select học kỳ riêng biệt */}
          <div className="card shadow p-3 mt-3">
            <label className="form-label">Chọn học kỳ để lọc điểm:</label>
            <select
              className="form-select"
              value={semesterFilter}
              onChange={(e) => handleSemesterChange(e.target.value)}
            >
              <option value="">-- Tất cả học kỳ --</option>
              {[...Array(8)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Học kỳ {i + 1}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {student && !error && points.length > 0 && (
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>Mã môn học</th>
              <th>Môn học</th>
              <th>Điểm quá trình</th>
              <th>Điểm thi</th>
              <th>Điểm tổng kết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.id}>
                <td>{p.subjectId}</td>
                <td>{p.subjectName}</td>
                <td>{p.processScore}</td>
                <td>{p.examScore}</td>
                <td>{p.finalScore}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => navigate(`/points/edit/${student.id}/${p.id}`)}
                  >
                    <i className="bi bi-pencil-square"></i> Sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(p.id)}
                  >
                    <i className="bi bi-trash"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {student && !error && points.length === 0 && (
        <div className="alert alert-warning mt-3">
          Sinh viên chưa có điểm.
        </div>
      )}
    </div>
  );
}
