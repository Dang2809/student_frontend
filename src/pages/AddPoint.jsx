import React, { useContext, useState } from "react";
import { createPoint } from "../api/pointService";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import PointForm from "../components/PointForm";

export default function AddPointPage() {
  const { token, role } = useContext(AuthContext); // lấy token để gọi API
  const navigate = useNavigate();            // điều hướng
  const { id } = useParams();                // lấy id sinh viên từ URL
  const [alert, setAlert] = useState(null);  // thông báo
  const [point, setPoint] = useState(null);  // dữ liệu điểm vừa thêm
  const isAdmin = checkAdmin(role);

  // Chuẩn hóa dữ liệu trả về từ API
  const handleSubmit = async (payload) => {
    const res = await createPoint(payload, token);
    console.log("CREATE RESPONSE:", res);
    const data = res?.data || res; // fallback
    return data;
  };

  // Xử lý khi thêm thành công
  const handleSuccess = (point) => {
    console.log("Created point:", point);
    if (!point) {
      setAlert({ type: "warning", text: "Thêm thành công nhưng không nhận được dữ liệu!" });
      return;
    }

    // Lấy finalScore từ mọi kiểu response
    const finalScore = point?.finalScore ?? point?.data?.finalScore;

    setPoint(point); // lưu lại dữ liệu
    setAlert({ type: "success", text: `Thêm điểm thành công! Điểm tổng kết: ${finalScore ?? "N/A"}` });

    setTimeout(() => {
      setAlert(null);
      navigate(`/points`);
    }, 5000);
  };

  // Xử lý khi thêm thất bại
  const handleError = (msg) => {
    setAlert({ type: "danger", text: msg });
    setTimeout(() => setAlert(null), 5000);
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5 text-center">
        <div className="alert alert-danger mb-3">
          Bạn không có quyền truy cập trang này!
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/homepage")}>
          Trở về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Thêm điểm cho sinh viên</h2>

      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      <PointForm
        initialData={null}
        studentId={id}
        submitLabel="Thêm điểm"
        onSubmit={handleSubmit}
        onSuccess={handleSuccess}
        onError={handleError}
      />

      <div className="text-center mt-3">
        <button className="btn btn-secondary" onClick={() => navigate(`/points`)}>
          Trở về
        </button>
      </div>
    </div>
  );
}
