import { useEffect, useState, useContext } from "react";
import { getMyStudentInfo } from "../api/studentApi";
import { getPointsByStudent } from "../api/pointService";
import { submitPhucKhao, getStudentPhucKhao } from "../api/phucKhao";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function StudentInfoPoint() {
  const { token } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [points, setPoints] = useState([]);
  const [phucKhaoList, setPhucKhaoList] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [semesterFilter, setSemesterFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [lyDo, setLyDo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      if (!token || ignore) return;
      try {
        const studentData = (await getMyStudentInfo(token)).data.data;
        setStudent(studentData);
        if (studentData?.id) {
          setPoints(await getPointsByStudent(studentData.id, token, semesterFilter) || []);
          setPhucKhaoList(await getStudentPhucKhao(studentData.id, token) || []);
        }
        setAlert(null);
      } catch (err) {
        const msg = err.response?.data?.message || err.response?.data?.error || err.message || "Lỗi tải dữ liệu";
        setAlert({ type: "danger", text: msg });
      } finally {
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [token, semesterFilter]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handlePhucKhao = (point) => {
    setSelectedPoint(point);
    setLyDo("");
    setSubmitted(false);
    setShowModal(true);
  };

  const submitPhucKhaoForm = async () => {
    setSubmitted(true);
    if (!lyDo.trim()) return;

    try {
      await submitPhucKhao(
        { studentId: student.id, subjectId: selectedPoint.subjectId, semester: selectedPoint.semester, currentScore: selectedPoint.examScore, lyDo },
        token
      );
      setAlert({ type: "success", text: "Đã gửi yêu cầu phúc khảo" });
      setShowModal(false);
      setLyDo("");
      setSubmitted(false);
      setPoints(await getPointsByStudent(student.id, token, semesterFilter) || []);
      setPhucKhaoList(await getStudentPhucKhao(student.id, token) || []);
    } catch {
      setAlert({ type: "danger", text: "Có lỗi khi gửi phúc khảo" });
    }
  };

  if (!token) return <p>Chưa đăng nhập</p>;
  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div>
      <h2>Bảng điểm sinh viên</h2>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

      {student && (
        <>
          <div className="card mt-3">
            <div className="card-body">
              <p><strong>Mã sinh viên:</strong> {student.id}</p>
              <p><strong>Họ và tên:</strong> {student.fullName}</p>
              <p><strong>Giới tính:</strong> {student.gender}</p>
              <p><strong>Ngày sinh:</strong> {student.dateOfBirth}</p>
              <p><strong>Địa chỉ:</strong> {student.address}</p>
            </div>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={() => navigate("/homepage")}>Trở về trang chủ</button>
            <button className="btn btn-info" onClick={() => navigate(`/phuckhao/${student.id}`)}>
              Xem lịch sử phúc khảo
            </button>
          </div>
          <div className="card shadow p-3 mt-3">
            <label className="form-label">Chọn học kỳ để lọc điểm:</label>
            <select className="form-select" value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
              <option value="">-- Tất cả học kỳ --</option>
              {[...Array(8)].map((_, i) => <option key={i+1} value={i+1}>Học kỳ {i+1}</option>)}
            </select>
          </div>
        </>
      )}

      {points.length ? (
        <table className="table table-striped table-bordered mt-4">
          <thead>
            <tr>
              <th>Mã môn học</th>
              <th>Môn học</th>
              <th>Điểm quá trình</th>
              <th>Điểm thi</th>
              <th>Điểm tổng kết</th>
              <th>Phúc khảo</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => {
              const alreadyRequested = phucKhaoList.some(pk => pk.subjectId === p.subjectId && pk.semester === p.semester);
              return (
                <tr key={p.id}>
                  <td>{p.subjectId}</td>
                  <td>{p.subjectName}</td>
                  <td>{p.processScore}</td>
                  <td>{p.examScore}</td>
                  <td>{p.finalScore}</td>
                  <td>{alreadyRequested ? <span className="text-muted">Đã gửi</span> : <button className="btn btn-warning btn-sm" onClick={() => handlePhucKhao(p)}>Phúc khảo</button>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : <div className="alert alert-danger mt-3">Sinh viên này chưa có bảng điểm.</div>}

      {showModal && selectedPoint && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog" style={{ marginTop: "60px" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yêu cầu phúc khảo</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Mã sinh viên:</strong> {student.id}</p>
                <p><strong>Họ tên:</strong> {student.fullName}</p>
                <p><strong>Mã môn học:</strong> {selectedPoint.subjectId}</p>
                <p><strong>Môn học:</strong> {selectedPoint.subjectName}</p>
                <p><strong>Điểm thi:</strong> {selectedPoint.examScore}</p>
                <div className="mb-3">
                  <label className="form-label">Lý do phúc khảo</label>
                  <textarea
                    className="form-control"
                    value={lyDo}
                    onChange={(e) => setLyDo(e.target.value)}
                    placeholder="Nhập lý do phúc khảo"
                  ></textarea>
                  {submitted && !lyDo.trim() && (
                    <small className="text-danger">Bạn phải nhập lý do phúc khảo</small>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
                <button className="btn btn-primary" onClick={submitPhucKhaoForm}>Gửi yêu cầu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
