import { useEffect, useState, useContext } from "react";
import { getUsers, approveUser, rejectUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext, checkAdmin } from "../context/AuthContext";

export default function UserManagementPage() {
  const { role, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // thêm state loading
  const usersPerPage = 30;
  const navigate = useNavigate();

  const isAdmin = checkAdmin(role);

  useEffect(() => {
    if (isAdmin) {
      setLoading(true);
      getUsers(token)
        .then(users => setUsers(users))
        .catch(() => setUsers([]))
        .finally(() => setLoading(false));
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
          Bạn không có quyền truy cập trang này!
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/homepage")}
        >
          Trở về 
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-3">Quản lý User</h2>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-secondary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
        <button className="btn btn-warning" onClick={() => navigate("/admin")}>
          Nâng quyền User
        </button>
      </div>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>User ID</th>
            <th>Tên người dùng</th>
            <th>Trạng thái</th>
            <th>Quyền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(u => (
            <tr key={u.username}>
              <td>{u.id}</td>
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
