import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; // bắt buộc

export default function HomePage() {
  const { token, username } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [topAddresses, setTopAddresses] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:8080/students/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setStats(res.data.data))
      .catch(err => console.error(err));

      axios.get("http://localhost:8080/students/top-addresses", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        console.log("Top addresses:", res.data.data); // kiểm tra dữ liệu
        setTopAddresses(res.data.data);
      })
      .catch(err => console.error(err));
    }
  }, [token]);

  if (!token) {
    return <h2 className="text-center mt-5">Vui lòng đăng nhập để sử dụng chức năng</h2>;
  }

  const chartData = {
    labels: topAddresses.map(item => item.address),
    datasets: [
      {
        label: "Số lượng sinh viên",
        data: topAddresses.map(item => item.count),
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }
    ]
  };

  return (
    <div className="container mt-5 text-center">
      <h5 className="mb-3">Xin chào, {username || "Người dùng"}</h5>

      {/* Thống kê */}
      {stats && (
        <div className="row mt-4 justify-content-center">
          <div className="col-md-3">
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

      {/* Biểu đồ cột */}
      {topAddresses.length > 0 && (
        <div className="mt-5" style={{ width: "600px", margin: "0 auto" }}>
          <h6>5 địa phương có nhiều sinh viên nhất</h6>
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      )}
    </div>
  );
}
