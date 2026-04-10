import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

import UserManagementPage from "./pages/UserManagementPage.jsx";
import AdminPage from "./pages/AdminPage";

import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage.jsx";
import EditStudentPage from "./pages/EditStudentPage";
import StudentInfoPage from "./pages/StudentInfoPage.jsx";

import SubjectsPage from "./pages/SubjectsPage.jsx";
import AddSubject from "./pages/AddSubject.jsx";
import EditSubject from "./pages/EditSubject.jsx";

import PointPage from "./pages/PointPage.jsx";
import AddPoint from "./pages/AddPoint";
import EditPoint from "./pages/EditPoint.jsx";
import StudentInfoPoint from "./pages/StudentInfoPoint.jsx";
import LichSuPhucKhaoSinhVien from "./pages/LichSuPhucKhaoSinhVien.jsx";
import QuanLyPhucKhao from "./pages/QuanLyPhucKhao.jsx";

function MainLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "60px", zIndex: 1000 }}>
        <Navbar />
      </div>
      <div style={{ display: "flex", flex: 1, marginTop: "60px" }}>
        <div style={{ position: "fixed", top: "60px", left: 0, width: "260px", height: "calc(100vh - 60px)" }}>
          <Sidebar />
        </div>
        <div style={{ flex: 1, marginLeft: "260px", padding: "20px", height: "calc(100vh - 60px)", overflowY: "auto", backgroundColor: "#f5f6fa" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function NavbarOnlyLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ position: "fixed", top: 0, width: "100%", height: "60px", zIndex: 1000 }}>
        <Navbar />
      </div>
      <div style={{ flex: 1, marginTop: "60px", padding: "20px", overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<NavbarOnlyLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/homepage" element={<HomePage />} />

          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/students/info/:id" element={<StudentInfoPage />} />
          <Route path="/students/edit/:id" element={<EditStudentPage />} />

          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/add" element={<AddSubject />} />
          <Route path="/subjects/edit/:id" element={<EditSubject />} />

          <Route path="/points/add/:id" element={<AddPoint />} />
          <Route path="/points/student/:id" element={<StudentInfoPoint />} />
          <Route path="/points/edit/:id/:pointId" element={<EditPoint />} />
          <Route path="/points" element={<PointPage />} />
          <Route path="/phuckhao" element={<QuanLyPhucKhao />} />
          <Route path="/phuckhao/:id" element={<LichSuPhucKhaoSinhVien />} />
        </Route>
      </Routes>
    </Router>
  );
}
