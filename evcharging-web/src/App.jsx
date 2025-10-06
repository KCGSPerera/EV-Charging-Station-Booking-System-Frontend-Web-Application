import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import BackofficeDashboard from "./pages/backoffice/Dashboard";
import OperatorDashboard from "./pages/operator/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/backoffice" element={<BackofficeDashboard />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="*" element={<Login />} />
        </Routes>

        {/* ✅ Global Toast container */}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
