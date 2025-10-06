import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import BackofficeDashboard from "../pages/backoffice/Dashboard";
import OperatorDashboard from "../pages/operator/Dashboard";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/backoffice" element={<BackofficeDashboard />} />
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
