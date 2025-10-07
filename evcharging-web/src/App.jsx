import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/Login";
import BackofficeDashboard from "./pages/backoffice/BackofficeDashboard";
import StationOperatorDashboard from "./pages/stationoperator/StationOperatorDashboard";

// ✅ Import Global Google Maps Provider
import { GoogleMapsProvider } from "./components/GoogleMapsProvider";

export default function App() {
  return (
    <AuthProvider>
      <GoogleMapsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/backoffice" element={<BackofficeDashboard />} />
            <Route path="/operator" element={<StationOperatorDashboard />} />
            <Route path="*" element={<Login />} />
          </Routes>

          {/* ✅ Global Toast Notifications */}
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
      </GoogleMapsProvider>
    </AuthProvider>
  );
}
