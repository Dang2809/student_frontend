// HomePage.jsx
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function HomePage() {
  const { token, username } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:8080/students/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
    }
  }, [token]);

  if (!token) {
    return (
      <h2 className="text-center mt-5">
        Vui lòng đăng nhập để sử dụng chức năng
      </h2>
    );
  }

  return (
    <div className="container mt-5 text-center">
      <h5 className="mb-3">Xin chào, {username || "Người dùng"}</h5>

      {/* Thống kê từ backend */}
      {stats && (
        <div className="row mt-4 justify-content-center">
          <div className="col-md-3 ">
            <div className="card bg-light text-center text-white">
              <div className="card-body bg-info">
                <h6>Tổng số sinh viên</h6>
                <p className="fs-4 fw-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-light text-center text-white">
              <div className="card-body bg-success">
                <h6>Sinh viên Nam</h6>
                <p className="fs-4 fw-bold">{stats.male}</p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-light text-center text-white">
              <div className="card-body bg-warning">
                <h6>Sinh viên Nữ</h6>
                <p className="fs-4 fw-bold">{stats.female}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
