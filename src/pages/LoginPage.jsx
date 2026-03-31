import { useState, useContext } from "react";
import { login as loginApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password) {
    alert("Vui lòng nhập đầy đủ Username và Password!");
    return;
  }

  try {
    const token = await loginApi(username, password);
    login(token);
    alert("Đăng nhập thành công!");
    navigate("/homepage");
  } catch (err) {
    console.error("Đăng nhập thất bại:", err);

    // Nếu backend trả về message
    const errorMessage = err.response?.data?.message || "Đăng nhập thất bại!";
    alert(errorMessage);
  }
};


  return (
    <div className="container mt-5">
      <div className="col-md-6 mx-auto">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="text-center mb-4">Đăng nhập</h2>
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
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}
