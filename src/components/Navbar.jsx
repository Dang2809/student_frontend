import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { token, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (confirmLogout) {
      logout();
      navigate("/login");
    }
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <h1 className="navbar-brand">Quản lý sinh viên</h1>
      <div className="ms-auto d-flex gap-4">

        {token ? (
          <>
            <span className="text-white d-flex align-items-center gap-2">
              <i className="bi bi-person-circle"></i> {/* icon người dùng */}
              {username || "Người dùng"}
            </span>
            <button onClick={handleLogout} className="btn btn-danger">
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link text-white">Đăng nhập</Link>
            <Link to="/register" className="nav-link text-white">Đăng ký</Link>
          </>
        )}
      </div>
    </nav>
  );
}
