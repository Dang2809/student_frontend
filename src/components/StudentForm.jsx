import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function StudentForm({ 
  initialData, 
  submitLabel, 
  onSubmit, 
  onSuccess, 
  onError 
}) {
  const [form, setForm] = useState(initialData || {
    fullName: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    userId: "" // chỉ dùng khi thêm
  });
  const [errors, setErrors] = useState({});
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    if (!form.fullName.trim()) newErrors.fullName = "Họ tên không được để trống";
    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh bắt buộc";
    } else if (new Date(form.dateOfBirth) > today) {
      newErrors.dateOfBirth = "Ngày sinh không được là ngày trong tương lai";
    }
    if (!form.address.trim()) newErrors.address = "Địa chỉ không được để trống";
    if (!initialData && !form.userId.trim()) newErrors.userId = "User ID bắt buộc";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await onSubmit(form, token);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      onError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow p-3">
      <input
        className="form-control mb-2"
        value={form.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        placeholder="Họ tên"
      />
      {errors.fullName && <small className="text-danger">{errors.fullName}</small>}

      <select
        className="form-control mb-2"
        value={form.gender}
        onChange={(e) => setForm({ ...form, gender: e.target.value })}
      >
        <option value="MALE">Nam</option>
        <option value="FEMALE">Nữ</option>
        <option value="OTHER">Khác</option>
      </select>

      <input
        type="date"
        className="form-control mb-2"
        value={form.dateOfBirth}
        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
      />
      {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}

      <input
        className="form-control mb-2"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        placeholder="Địa chỉ"
      />
      {errors.address && <small className="text-danger">{errors.address}</small>}

      {!initialData && (
        <>
          <input
            className="form-control mb-2"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            placeholder="User ID"
          />
          {errors.userId && <small className="text-danger">{errors.userId}</small>}
        </>
      )}

      <div className="text-center mt-3">
        <button type="submit" className="btn btn-primary btn-sm  px-4 py-2">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
