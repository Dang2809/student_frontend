import React from "react";
// Hiển thị danh sách sinh viên
export default function StudentList({ students, onDelete }) {
  return (
    <ul>
      {students.map(st => (
        <li key={st.id}>
          {st.fullName} - {st.gender} - {st.dateOfBirth} - {st.address}
          <button onClick={() => onDelete(st.id)}>Xóa</button>
        </li>
      ))}
    </ul>
  );
}
