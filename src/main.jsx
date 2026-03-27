// main.jsx: entry point của React, mount App vào DOM
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";   //khớp với file App.jsx
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AuthProvider bọc toàn bộ app để chia sẻ token JWT */}
    <AuthProvider>
      <App />   {/*dùng đúng biến App đã import */}
    </AuthProvider>
  </React.StrictMode>
);
