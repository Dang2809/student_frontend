import { useState } from "react";
import { register } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ Username và Password!");
    return;
  }

  try {
    await register(username, password);
    alert("Đăng ký thành công!");
    navigate("/login");
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    alert("Người dùng đã tồn tại!");
  }
};

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
