import { BrowserRouter as Router, Routes, Route , Outlet} from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import StudentsPage from "./pages/StudentsPage";
import AddStudentPage from "./pages/AddStudentPage";
import StudentInfoPage from "./pages/StudentInfoPage";
import EditStudentPage from "./pages/EditStudentPage";
import DeleteStudentPage from "./pages/DeleteStudentPage";
import AdminPage from "./pages/AdminPage";

// Layout có Navbar trên cùng và Sidebar bên trái
function MainLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Navbar trên cùng */}
      <Navbar />

      {/* Phần dưới chia làm Sidebar bên trái + nội dung bên phải */}
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" ,  marginLeft: "260px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
function NavbarOnlyLayout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Navbar />
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang có Navbar nhưng không có Sidebar */}
        <Route element={<NavbarOnlyLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

        {/* Các trang có Navbar + Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/students/add" element={<AddStudentPage />} />
          <Route path="/students/info/:id" element={<StudentInfoPage />} />
          <Route path="/students/edit/:id" element={<EditStudentPage />} />
          <Route path="/students/delete/:id" element={<DeleteStudentPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </Router>
  );
}