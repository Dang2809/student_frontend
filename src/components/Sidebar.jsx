// Sidebar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext, checkAdmin } from "../context/AuthContext";

export default function Sidebar() {
  const { role, token, userId } = useContext(AuthContext);
  const isAdmin = checkAdmin(role);

  return (
    <div
      className="bg-dark text-white vh-100 p-3"
      style={{ width: "260px", position: "fixed" }}
    >
      <ul className="nav flex-column">
        {isAdmin ? (
          <>
            <li className="nav-item mb-2">
              <Link to="/homepage" className="nav-link text-white">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/students" className="nav-link text-white">
                Danh sách sinh viên
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/users" className="nav-link text-white">
                Quản lý User
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/subjects" className="nav-link text-white">
                Danh sách môn học
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/points" className="nav-link text-white">
                Quản lý điểm sinh viên
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/phuckhao" className="nav-link text-white">
                Quản lý phúc khảo
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item mb-2">
              <Link to="/homepage" className="nav-link text-white">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to={`/students/info/${userId}`} className="nav-link text-white">
                Thông tin cá nhân
              </Link>
            </li>
            <li className="nav-item mb-2">
              <Link to={`/points/student/${userId}`} className="nav-link text-white">
                Bảng điểm sinh viên
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
