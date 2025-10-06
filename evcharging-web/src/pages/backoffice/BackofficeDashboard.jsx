import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import {
  FaUsers,
  FaChargingStation,
  FaUserCog,
  FaClipboardList,
  FaSignOutAlt,
  FaUserShield
} from "react-icons/fa";
import Admins from "./Admins";
import Operators from "./Operators";


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
        return (
          <div className="p-6">
            🧍‍♂️ <b>EV Owner Management</b> — View, Add, Edit, and Deactivate EV
            Owners
          </div>
        );
      case "stations":
        return (
          <div className="p-6">
            ⚡ <b>Station Management</b> — Manage station details and
            availability
          </div>
        );
      case "operators":
        return <Operators />;
      case "bookings":
        return (
          <div className="p-6">
            📋 <b>Booking Management</b> — Monitor and manage reservations
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Admin Dashboard Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Total Stations</h3>
                <p className="text-3xl font-bold text-blue-600">12</p>
              </div>
              <div className="bg-green-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">EV Owners</h3>
                <p className="text-3xl font-bold text-green-600">54</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Bookings</h3>
                <p className="text-3xl font-bold text-yellow-600">28</p>
              </div>
              <div className="bg-purple-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Operators</h3>
                <p className="text-3xl font-bold text-purple-600">6</p>
              </div>
            </div>
          </div>
        );
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
