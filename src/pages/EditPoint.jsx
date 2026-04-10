// Import các hook và hàm cần thiết
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPointById, updatePoint } from "../api/pointService";
import { AuthContext, checkAdmin } from "../context/AuthContext";
import PointForm from "../components/PointForm";

export default function EditPointPage() {
  const { token, role } = useContext(AuthContext); // lấy token từ context
  const { id, pointId } = useParams();       // lấy id từ URL
  const navigate = useNavigate();            // điều hướng
  const isAdmin = checkAdmin(role);

  // Khai báo state
  const [point, setPoint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Lấy dữ liệu điểm khi load trang
  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const res = await getPointById(pointId, token);
        const pointData = res?.data || res; // fallback
        setPoint(pointData);
        console.log("FETCH POINT:", pointData);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
        setAlert({ type: "danger", text: "Không thể tải dữ liệu: " + msg });
      } finally {
        setLoading(false);
      }
    };
    fetchPoint();
  }, [pointId, token]);

  // Hàm submit cập nhật điểm
  const handleSubmit = async (payload) => {
    try {
      const res = await updatePoint(pointId, payload, token);
      const data = res?.data || res;
      console.log("UPDATE DATA:", data);
      return data; // trả về dữ liệu để PointForm xử lý
    } catch (err) {
      throw err;
    }
  };

  // Xử lý khi cập nhật thành công
  const handleSuccess = (point) => {
    console.log("Updated point:", point);
    if (!point) {
      setAlert({ type: "warning", text: "Cập nhật thành công nhưng không nhận được dữ liệu!" });
      return;
    }
    setAlert({ type: "success", text: `Cập nhật điểm thành công! Điểm tổng kết: ${point?.finalScore ?? "N/A"}` });
    setTimeout(() => {
      setAlert(null);
      navigate(`/points`);
    }, 5000);
  };

  // Xử lý khi cập nhật lỗi
  const handleError = (msg) => {
    setAlert({ type: "danger", text: "Không thể cập nhật: " + msg });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) return <p className="text-center">Đang tải dữ liệu...</p>;

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
      <h2 className="mb-4 text-center">Sửa điểm</h2>

      {alert && <div className={`alert alert-${alert.type} text-center`}>{alert.text}</div>}

      {point && (
        <PointForm
          initialData={point}
          studentId={id}
          submitLabel="Cập nhật điểm"
          onSubmit={handleSubmit}
          onSuccess={handleSuccess}
          onError={handleError}
        />
      )}

      <div className="text-center mt-3">
        <button className="btn btn-secondary" onClick={() => navigate(`/points`)}>
          Trở về
        </button>
      </div>
    </div>
  );
}
