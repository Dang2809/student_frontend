import { useState, useContext } from "react";
import { promoteToAdmin } from "../api/authApi";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();

  // Kiểm tra quyền admin
  const isAdmin = checkAdmin(role);

    // Nếu chưa đăng nhập
    if (!token) {
    return <h2 className="text-center mt-5">Vui lòng đăng nhập tài khoản Admin để sử dụng chức năng này</h2>;
  }

  // Nếu đã đăng nhập nhưng không phải admin
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

  // Hàm nâng quyền
  const handlePromote = async () => {
    try {
      const res = await promoteToAdmin(username, token);
      alert(res);
    } catch (err) {
      alert("Không thể nâng quyền: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Nâng quyền User</h2>
          {/* Input nhập username */}
          <input
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập username cần nâng quyền"
          />
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button className="btn btn-warning btn-sm" onClick={handlePromote}>
              Nâng quyền lên Admin
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => navigate("/homepage")}>
              Trở về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
