// Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-dark text-white vh-100 p-3" style={{ width: "260px", position: "fixed" }}>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/homepage" className="nav-link text-white">Trang chủ</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/students/info/1" className="nav-link text-white">Tra cứu thông tin sinh viên</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/students" className="nav-link text-white">Danh sách sinh viên</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/users" className="nav-link text-white">Quản lý User</Link>
        </li>
      </ul>
    </div>
  );
}
