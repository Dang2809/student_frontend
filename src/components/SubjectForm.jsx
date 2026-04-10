import React, { useState, useEffect } from "react";

export default function SubjectForm({ 
  initialData, 
  submitLabel, 
  onSubmit, 
  onSuccess, 
  onError 
}) {
  const [form, setForm] = useState(initialData || {
    name: "",
    credits: "",
    semester: "",
    ratioProcess: "",
    ratioExam: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Tên môn học không được để trống";
    if (!form.credits) newErrors.credits = "Số tín chỉ bắt buộc";
    if (!form.semester) newErrors.semester = "Học kỳ bắt buộc";
    if (!form.ratioProcess) newErrors.ratioProcess = "Tỷ lệ quá trình bắt buộc";
    if (!form.ratioExam) newErrors.ratioExam = "Tỷ lệ thi bắt buộc";

    const process = parseFloat(form.ratioProcess);
    const exam = parseFloat(form.ratioExam);

    // kiểm tra tổng tỷ lệ = 1
    if (!isNaN(process) && !isNaN(exam) && parseFloat((process + exam).toFixed(1)) !== 1) {
      newErrors.ratioTotal = "Tổng tỷ lệ quá trình + tỷ lệ thi phải bằng 1";
    }

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
      await onSubmit(form);
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Có lỗi xảy ra";
      onError(msg);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // làm tròn 1 chữ số thập phân cho tỷ lệ
    if (name === "ratioProcess" || name === "ratioExam") {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        newValue = parseFloat(parsed.toFixed(1));
      }
    }

    setForm({ ...form, [name]: newValue });
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow p-3">
      {form.id && (
        <div className="mb-2 d-flex align-items-center">
          <label className="form-label me-2 mb-0">Mã môn học:</label>
          <span className="fw-bold">{form.id}</span>
        </div>
      )}

      <input
        className="form-control mb-2"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Tên môn học"
      />
      {errors.name && <small className="text-danger">{errors.name}</small>}

      <input
        type="number"
        className="form-control mb-2"
        name="credits"
        value={form.credits}
        onChange={handleChange}
        placeholder="Số tín chỉ"
      />
      {errors.credits && <small className="text-danger">{errors.credits}</small>}

      <input
        type="number"
        className="form-control mb-2"
        name="semester"
        value={form.semester}
        onChange={handleChange}
        placeholder="Học kỳ"
      />
      {errors.semester && <small className="text-danger">{errors.semester}</small>}

      <input
        type="number"
        step="0.1"
        min="0"
        max="1"
        className="form-control mb-2"
        name="ratioProcess"
        value={form.ratioProcess}
        onChange={handleChange}
        placeholder="Tỷ lệ điểm quá trình"
      />
      {errors.ratioProcess && <small className="text-danger">{errors.ratioProcess}</small>}

      <input
        type="number"
        step="0.1"
        min="0"
        max="1"
        className="form-control mb-2"
        name="ratioExam"
        value={form.ratioExam}
        onChange={handleChange}
        placeholder="Tỷ lệ điểm thi"
      />
      {errors.ratioExam && <small className="text-danger">{errors.ratioExam}</small>}

      {errors.ratioTotal && <small className="text-danger">{errors.ratioTotal}</small>}

      <div className="d-flex justify-content-between mt-3">
        <button type="submit" className="btn btn-primary btn-sm px-4 py-2">
          {submitLabel}
        </button>
        <button type="button" className="btn btn-secondary btn-sm px-4 py-2" onClick={() => window.history.back()}>
          Hủy
        </button>
      </div>
    </form>
  );
}
