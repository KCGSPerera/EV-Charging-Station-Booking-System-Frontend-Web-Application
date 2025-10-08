// export default function StationBookings() {
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">
//         Station Bookings
//       </h2>
//       <p className="text-gray-700">This page will show all bookings for your assigned station.</p>
//     </div>
//   );
// }


/**
 * ============================================================
 * ✅ StationBookings.jsx — EV Charging System (2025)
 * ============================================================
 * PURPOSE:
 *   • Display all bookings for the logged-in station operator.
 *   • Allow approving/rejecting pending bookings.
 *   • Show status, date/time, EV owner, and slot details.
 *
 * ENDPOINTS (Backend):
 *   GET  /api/bookings/station/{stationId}
 *   PUT  /api/bookings/{id}/approve
 *   PUT  /api/bookings/{id}/reject
 *
 * DEPENDENCIES:
 *   - AuthContext (for user + token)
 *   - react-toastify (for success/error feedback)
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function StationBookings() {
  const { user } = useAuth(); // ✅ contains decoded NIC + token
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "pending" | "approved" | "completed"

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async () => {
    try {
      setLoading(true);

      if (!user || !user.token || !user.nic) {
        toast.error("⚠️ Session expired. Please log in again.");
        return;
      }

      // First get the station ID assigned to this operator
      const stationRes = await fetch(`/api/stations/operator/${user.nic}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!stationRes.ok) throw new Error("Failed to load station info");
      const stationData = await stationRes.json();
      const stationId = stationData.id;

      // Then fetch bookings for that station
      const res = await fetch(`/api/bookings/station/${stationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data = await res.json();

      setBookings(data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- APPROVE BOOKING ----------------
  const handleApprove = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/approve`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Approval failed");
      toast.success("✅ Booking approved successfully!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to approve booking.");
    }
  };

  // ---------------- REJECT BOOKING ----------------
  const handleReject = async (bookingId) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/reject`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Rejection failed");
      toast.info("🚫 Booking rejected.");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to reject booking.");
    }
  };

  // ---------------- FILTER BOOKINGS ----------------
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(
          (b) => b.status.toLowerCase() === filter.toLowerCase()
        );

  // ---------------- RENDER ----------------
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading bookings...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Station Bookings
      </h2>

      {/* FILTER BAR */}
      <div className="flex gap-3 mb-6">
        {["all", "pending", "approved", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded font-semibold border ${
              filter === status
                ? "bg-blue-600 text-white border-blue-700"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* BOOKINGS TABLE */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-50 text-blue-700 text-left">
                <th className="p-3 border-b">Booking ID</th>
                <th className="p-3 border-b">EV Owner</th>
                <th className="p-3 border-b">Date</th>
                <th className="p-3 border-b">Time</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.ownerNic || "—"}</td>
                  <td className="p-3">{b.date}</td>
                  <td className="p-3">{b.time}</td>
                  <td
                    className={`p-3 font-semibold ${
                      b.status === "Pending"
                        ? "text-yellow-600"
                        : b.status === "Approved"
                        ? "text-green-600"
                        : b.status === "Completed"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    {b.status}
                  </td>
                  <td className="p-3 text-center">
                    {b.status === "Pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(b.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
