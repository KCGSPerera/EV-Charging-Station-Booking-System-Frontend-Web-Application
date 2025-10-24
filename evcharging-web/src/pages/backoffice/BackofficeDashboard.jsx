import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  FaUsers,
  FaChargingStation,
  FaUserCog,
  FaClipboardList,
  FaSignOutAlt,
  FaUserShield,
} from "react-icons/fa";
import Admins from "./Admins";
import Operators from "./Operators";
import Owners from "./Owners";
import Stations from "./Stations";
import Bookings from "./Bookings";
import Charging from "./Charging";
import AdminDashboardOverview from "./AdminDashboardOverview";

export default function BackofficeDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Components for subpages (lazy placeholder for now)
  const renderContent = () => {
    switch (activeTab) {
      case "admins":
        return <Admins />;
      case "owners":
        return <Owners />;
      case "stations":
        return <Stations />;
      case "operators":
        return <Operators />;
      case "bookings":
        return <Bookings />;
      case "charging":
        return <Charging />;
      default:
        // Replaced static overview with dynamic AdminDashboardOverview
        return <AdminDashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="text-center font-bold text-xl py-4 border-b border-blue-700">
          ⚙️ Backoffice Admin
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "overview" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <FaClipboardList /> Overview
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "admins" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("admins")}
            >
              <FaUserShield /> Backoffice Admins
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "owners" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("owners")}
            >
              <FaUsers /> EV Owners
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "stations" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("stations")}
            >
              <FaChargingStation /> Stations
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "operators" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("operators")}
            >
              <FaUserCog /> Operators
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "bookings" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("bookings")}
            >
              <FaClipboardList /> Bookings
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "charging" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("charging")}
            >
              <FaClipboardList /> Charging
            </li>
          </ul>
        </nav>

        <div
          className="p-4 border-t border-blue-800 flex items-center gap-2 cursor-pointer hover:bg-blue-800"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>
    </div>
  );
}
