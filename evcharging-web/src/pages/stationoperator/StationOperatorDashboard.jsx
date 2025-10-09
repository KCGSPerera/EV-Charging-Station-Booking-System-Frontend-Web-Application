import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaChargingStation,
  FaClipboardList,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaBolt
} from "react-icons/fa";

import StationDetails from "./StationDetails";
import StationBookings from "./StationBookings";
import StationOwners from "./StationOwners";
import StationProfile from "./StationProfile";
import StationCharging from "./StationCharging"; 
import TimeSlots from "./TimeSlots";

export default function StationOperatorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "station":
        return <StationDetails />;
      case "bookings":
        return <StationBookings />;
      case "owners":
        return <StationOwners />;
      case "profile":
        return <StationProfile />;
      case "charging":
        return <StationCharging />;
      case "timeslots":
        return <TimeSlots />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
              Station Operator Dashboard
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Pending Bookings</h3>
                <p className="text-3xl font-bold text-blue-600">—</p>
              </div>

              <div className="bg-green-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Approved Today</h3>
                <p className="text-3xl font-bold text-green-600">—</p>
              </div>

              <div className="bg-yellow-100 p-4 rounded shadow text-center">
                <h3 className="text-xl font-semibold">Completed</h3>
                <p className="text-3xl font-bold text-yellow-600">—</p>
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
          ⚡ Station Operator
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-3">
            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "overview" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <FaHome /> Overview
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "station" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("station")}
            >
              <FaChargingStation /> Station
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
              <FaBolt /> Charging
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
                activeTab === "timeslots" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("timeslots")}
            >
              <FaUsers /> Time Slots
            </li>

            <li
              className={`cursor-pointer flex items-center gap-2 p-2 rounded hover:bg-blue-800 ${
                activeTab === "profile" && "bg-blue-800"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser /> Profile
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
