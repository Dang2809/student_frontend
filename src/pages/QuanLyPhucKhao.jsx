import { useEffect, useState, useContext } from "react";
import { getAllPhucKhao, reviewPhucKhao } from "../api/phucKhao";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function QuanLyPhucKhao() {
  const { token, role } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [alert, setAlert] = useState(null);
  const isAdmin = checkAdmin(role);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllPhucKhao(token);
        setRequests(data || []);
      } catch (err) {
        setAlert({ type: "danger", text: "Lỗi tải danh sách phúc khảo" });
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleReview = async (id, status, phanHoi) => {
    if (!phanHoi || phanHoi.trim() === "") {
      setAlert({ type: "danger", text: "Vui lòng nhập phản hồi trước khi gửi" });
      return;
    }
    try {
      await reviewPhucKhao(id, status, phanHoi, token);
      setAlert({ type: "success", text: "Đã cập nhật trạng thái" });
      const data = await getAllPhucKhao(token);
      setRequests(data || []);
    } catch (err) {
      setAlert({ type: "danger", text: "Có lỗi khi cập nhật" });
    }
  };

   if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền truy cập trang này!
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="mb-3 text-center">Quản lý phúc khảo</h2>

      <div className="d-flex justify-content-start mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/homepage")} // điều hướng về trang chủ
        >
          Trở về trang chủ
        </button>
      </div>
      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {requests.length > 0 ? (
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead className="table-dark text-center">
            <tr>
              <th>Mã SV</th>
              <th>Tên SV</th>
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Điểm trước phúc khảo</th>
              <th>Lý do phúc khảo</th>
              <th>Phản hồi</th>
              <th>Trạng thái</th>
              <th>Thời gian gửi</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, idx) => (
              <tr key={r.id}>
                <td>{r.studentId}</td>
                <td>{r.studentName}</td>
                <td>{r.subjectId}</td>
                <td>{r.subjectName}</td>
                <td>{r.currentScore}</td>
                <td>{r.lyDo}</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập phản hồi..."
                    value={r.phanHoi || ""}
                    onChange={(e) => {
                      const newRequests = [...requests];
                      newRequests[idx].phanHoi = e.target.value;
                      setRequests(newRequests);
                    }}
                    //disabled={r.status !== "PENDING"}
                  />
                </td>
                <td className="text-center">{r.status}</td>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}</td>
                <td className="text-center">
                  {r.status === "PENDING" ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => handleReview(r.id, "APPROVED", r.phanHoi)}
                      >
                        Duyệt
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReview(r.id, "REJECTED", r.phanHoi)}
                      >
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info mt-3 text-center">
          Không có yêu cầu phúc khảo nào.
        </div>
      )}
    </div>
  );
}
