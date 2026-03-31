import { useEffect, useState, useContext } from "react";
import { getUsers, approveUser, rejectUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext, checkAdmin } from "../context/AuthContext";

export default function UserManagementPage() {
  const { role, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;
  const navigate = useNavigate();

  const isAdmin = checkAdmin(role);

  useEffect(() => {
    if (isAdmin) {
      getUsers(token).then(res => setUsers(res.data));
    }
  }, [token, isAdmin]);

  const handleApprove = async (username) => {
    await approveUser(username, token);
    setUsers(users.map(u =>
      u.username === username ? { ...u, status: "ACTIVE" } : u
    ));
  };

  const handleReject = async (username) => {
    await rejectUser(username, token);
    setUsers(users.map(u =>
      u.username === username ? { ...u, status: "REJECTED" } : u
    ));
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền truy cập chức năng này!
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/homepage")}
        >
          Trở về trang chủ
        </button>
      </div>
    );
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container mt-4">
      {/* Tiêu đề */}
      <h2 className="text-center mb-3">Quản lý User</h2>

      {/* Hàng chứa 2 nút: Trở về và Nâng quyền */}
      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/admin")}>
          Nâng quyền User
        </button>
      </div>

      {/* Bảng user */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Tên người dùng</th>
            <th>Trạng thái</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(u => (
            <tr key={u.username}>
              <td>{u.username}</td>
              <td>{u.status}</td>
              <td>{u.roles.map(r => r.name).join(", ")}</td>
              <td>
                {u.status === "PENDING" ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApprove(u.username)}
                    >
                      Chấp nhận
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReject(u.username)}
                    >
                      Từ chối
                    </button>
                  </>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <nav>
        <ul className="pagination justify-content-center">
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
  );
}
