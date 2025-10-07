// ============================================================
// ✅ Bookings.jsx — Back Office Booking Viewer
// ============================================================

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaEye } from "react-icons/fa";
import {
  getBookingsByStation,
  getPendingBookingsByStation,
  getPendingBookingsToday,
  getPendingBookingsTodayByStation,
} from "../../api/adminBookingApi";
import { getAllStations } from "../../api/adminStationApi";

export default function Bookings() {
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [bookings, setBookings] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ------------------------------
  // 🔹 Load stations
  // ------------------------------
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getAllStations();
        setStations(data);
      } catch {
        toast.error("Failed to load stations");
      }
    };
    fetchStations();
  }, []);

  // ------------------------------
  // 🔹 Load bookings based on filters
  // ------------------------------
  const loadBookings = async () => {
    if (!filterType) return;
    try {
      setLoading(true);
      let data = [];

      switch (filterType) {
        case "all":
          if (!selectedStation) {
            toast.info("Select a station to view all bookings");
            return;
          }
          data = await getBookingsByStation(selectedStation);
          break;
        case "pending":
          if (!selectedStation) {
            toast.info("Select a station to view pending bookings");
            return;
          }
          data = await getPendingBookingsByStation(selectedStation);
          break;
        case "pendingToday":
          data = await getPendingBookingsToday();
          break;
        case "pendingTodayStation":
          if (!selectedStation) {
            toast.info("Select a station first");
            return;
          }
          data = await getPendingBookingsTodayByStation(selectedStation);
          break;
        default:
          break;
      }

      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterType) loadBookings();
    // eslint-disable-next-line
  }, [filterType, selectedStation]);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-semibold">Booking Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <select
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-64"
          >
            <option value="">-- Select Station --</option>
            {stations.map((st) => (
              <option key={st.id} value={st.id}>
                {st.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-64"
          >
            <option value="all">All Bookings (by Station)</option>
            <option value="pending">Pending Bookings (by Station)</option>
            <option value="pendingToday">Today's Pending Bookings (All Stations)</option>
            <option value="pendingTodayStation">
              Today's Pending Bookings (by Station)
            </option>
          </select>

          <button
            onClick={loadBookings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaSearch /> Load
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto shadow rounded-lg bg-white">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Booking ID</th>
              <th className="p-3 text-left">Station</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.stationName || "—"}</td>
                  <td className="p-3">{b.ownerName || b.ownerNic || "—"}</td>
                  <td className="p-3">{b.date || b.bookingDate || "—"}</td>
                  <td className="p-3">{b.time || b.slotTime || "—"}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        b.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : b.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Booking Modal */}
      {selectedBooking && (
        <ViewBookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// ✅ ViewBookingModal (Responsive Read-only)
// ============================================================
function ViewBookingModal({ booking, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl mx-3 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 text-center sm:text-left">
          Booking Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4 text-gray-800 mb-4 text-sm sm:text-base">
          <p><strong>ID:</strong> {booking.id}</p>
          <p><strong>Station:</strong> {booking.stationName || "—"}</p>
          <p><strong>EV Owner:</strong> {booking.ownerName || booking.ownerNic || "—"}</p>
          <p><strong>Date:</strong> {booking.date || booking.bookingDate || "—"}</p>
          <p><strong>Time:</strong> {booking.time || booking.slotTime || "—"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>

        <div className="flex justify-center sm:justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
