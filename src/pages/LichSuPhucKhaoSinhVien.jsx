import { useEffect, useState, useContext } from "react";
import { getStudentPhucKhao } from "../api/phucKhao";
import { AuthContext } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";

export default function LichSuPhucKhaoSinhVien() {
  const { token, userId} = useContext(AuthContext);
  const { id } = useParams();
  const [requests, setRequests] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudentPhucKhao(id, token);
        setRequests(data || []);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Lỗi tải danh sách phúc khảo";
        setAlert({ type: "danger", text: msg });
      }
    };
    if (id && token) {
      fetchData();
    }
  }, [id, token]);

  return (
    <div>
      {/* Tiêu đề chính giữa */}
      <h2 className="text-center">Lịch sử phúc khảo</h2>

      {/* Nút quay về trang quản lý điểm */}
      <div className="mt-3">
        <Link to={`/points/student/${userId}`} className="btn btn-secondary">
          Trở về
        </Link>
      </div>

      {/* Thông báo lỗi */}
      {alert && (
        <div className={`alert alert-${alert.type} mt-3`}>{alert.text}</div>
      )}

      {/* Bảng thông tin */}
      {requests.length > 0 ? (
        <table className="table table-bordered table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>Mã môn</th>
              <th>Tên môn</th>
              <th>Điểm trước phúc khảo</th>
              <th>Lý do phúc khảo</th>
              <th>Phản hồi</th>
              <th>Trạng thái</th>
              <th>Thời gian gửi</th>
              <th>Thời gian cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td>{r.subjectId}</td>
                <td>{r.subjectName}</td>
                <td>{r.currentScore}</td>
                <td>{r.lyDo}</td>
                <td>{r.phanHoi || "-"}</td>
                <td>{r.status}</td>
                <td>
                  {r.createdAt ? new Date(r.createdAt).toLocaleString() : "-"}
                </td>
                <td>
                  {r.updatedAt && r.updatedAt !== r.createdAt
                    ? new Date(r.updatedAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info mt-3">
          Bạn chưa có yêu cầu phúc khảo nào.
        </div>
      )}
    </div>
  );
}
