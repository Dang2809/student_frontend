import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function PointForm({
  initialData,
  studentId,
  submitLabel = "Lưu",
  onSubmit,
  onSuccess = () => {},
  onError = (msg) => alert(msg),
}) {
  const { token } = useContext(AuthContext);

  // Form state
  const [form, setForm] = useState(
    initialData || {
      subjectId: "",
      processScore: "",
      examScore: "",
    }
  );

  const [subjectName, setSubjectName] = useState("");
  const [errors, setErrors] = useState({});

  // Khi initialData thay đổi (edit) => cập nhật form
  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  // Lấy tên môn học khi subjectId thay đổi
  useEffect(() => {
    if (form.subjectId) {
      axios
        .get(`http://localhost:8080/subjects/${form.subjectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setSubjectName(res.data.data.name))
        .catch(() => setSubjectName(""));
    }
  }, [form.subjectId, token]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!form.subjectId) newErrors.subjectId = "Mã môn học bắt buộc";
    if (form.processScore === "" || form.processScore < 0 || form.processScore > 10)
      newErrors.processScore = "Điểm quá trình phải từ 0 đến 10";
    if (form.examScore === "" || form.examScore < 0 || form.examScore > 10)
      newErrors.examScore = "Điểm thi phải từ 0 đến 10";
    return newErrors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const payload = {
        studentId: studentId || initialData?.studentId, // ưu tiên props, fallback initialData
        subjectId: form.subjectId,
        processScore: parseFloat(form.processScore),
        examScore: parseFloat(form.examScore),
      };

      const result = await onSubmit(payload, token); // result là point từ API
      onSuccess(result);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      onError(msg);
    }
  };

  // Hiển thị studentId: từ props hoặc initialData (edit)
  const displayedStudentId = studentId || initialData?.studentId;

  return (
    <form onSubmit={handleSubmit} className="card shadow p-3">

      {/* Student ID */}
      {displayedStudentId !== undefined && displayedStudentId !== null && (
        <div className="mb-2">
          <label className="form-label">ID Sinh viên</label>
          <input
            type="text"
            className="form-control"
            value={displayedStudentId}
            disabled
          />
        </div>
      )}


      {/* Mã môn học */}
      <div className="mb-2">
        <label className="form-label">Mã môn học</label>
        <input
          className="form-control"
          value={form.subjectId}
          onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
          placeholder="Mã môn học"
          disabled={!!initialData} // nếu edit thì disable
        />
        {errors.subjectId && <small className="text-danger">{errors.subjectId}</small>}
      </div>

      {/* Tên môn học */}
      {subjectName && (
        <div className="mb-2">
          <label className="form-label">Tên môn học</label>
          <input className="form-control" value={subjectName} disabled />
        </div>
      )}

      {/* Điểm quá trình */}
      <div className="mb-2">
        <label className="form-label">Điểm quá trình</label>
        <input
          type="number"
          className="form-control"
          value={form.processScore}
          onChange={(e) => setForm({ ...form, processScore: e.target.value })}
          min="0"
          max="10"
          step="0.1"
        />
        {errors.processScore && <small className="text-danger">{errors.processScore}</small>}
      </div>

      {/* Điểm thi */}
      <div className="mb-2">
        <label className="form-label">Điểm thi</label>
        <input
          type="number"
          className="form-control"
          value={form.examScore}
          onChange={(e) => setForm({ ...form, examScore: e.target.value })}
          min="0"
          max="10"
          step="0.1"
        />
        {errors.examScore && <small className="text-danger">{errors.examScore}</small>}
      </div>

      {/* Submit button */}
      <div className="text-center mt-3">
        <button type="submit" className="btn btn-primary btn-sm px-4 py-2">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}