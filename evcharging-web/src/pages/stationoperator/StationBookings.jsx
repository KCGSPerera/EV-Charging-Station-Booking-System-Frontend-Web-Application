// /**
//  * ============================================================
//  * ✅ StationBookings.jsx — EV Charging System (2025)
//  * ============================================================
//  * PURPOSE:
//  *   • Display and manage reservations for logged-in station operator.
//  *   • Show all details including EV owner, vehicle, charger, time slots, and status.
//  *   • Allow approving reservations and regenerating QR codes.
//  *
//  * DEPENDENCIES:
//  *   - stationOperatorReservations.js (API)
//  *   - AuthContext for token & user
//  *   - react-toastify for user feedback
//  * ============================================================
//  */

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import {
//   getMyReservations,
//   approveReservation,
//   regenerateReservationQr,
// } from "../../api/stationOperatorReservations";

// export default function StationBookings() {
//   const { user } = useAuth(); // ✅ contains token and operator details
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("all"); // all | pending | approved | completed

//   // ---------------- FETCH BOOKINGS ----------------
//   const fetchBookings = async () => {
//     try {
//       setLoading(true);

//       if (!user || !user.token) {
//         toast.error("⚠️ Session expired. Please log in again.");
//         return;
//       }

//       const data = await getMyReservations();
//       setBookings(data);
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       toast.error("❌ Failed to load reservations.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBookings();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ---------------- APPROVE RESERVATION ----------------
//   const handleApprove = async (id) => {
//     try {
//       await approveReservation(id);
//       toast.success("✅ Reservation approved successfully!");
//       fetchBookings();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to approve reservation.");
//     }
//   };

//   // ---------------- REGENERATE QR CODE ----------------
//   const handleRegenerateQr = async (id) => {
//     try {
//       const res = await regenerateReservationQr(id);
//       toast.success("🔄 QR Code regenerated successfully!");
//       console.log("New QR Data:", res.qrCode);
//       fetchBookings();
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Failed to regenerate QR code.");
//     }
//   };

//   // ---------------- FILTER BOOKINGS ----------------
//   const filteredBookings =
//     filter === "all"
//       ? bookings
//       : bookings.filter(
//           (b) => b.status?.toLowerCase() === filter.toLowerCase()
//         );

//   // ---------------- RENDER ----------------
//   if (loading) {
//     return (
//       <div className="p-6 text-center text-gray-500 animate-pulse">
//         Loading reservations...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-green-700 mb-4">
//         Station Reservations
//       </h2>

//       {/* FILTER BAR */}
//       <div className="flex flex-wrap gap-2 mb-6">
//         {["all", "pending", "approved", "completed", "cancelled"].map(
//           (status) => (
//             <button
//               key={status}
//               onClick={() => setFilter(status)}
//               className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${
//                 filter === status
//                   ? "bg-green-600 text-white border-green-700"
//                   : "bg-gray-100 hover:bg-gray-200 text-gray-700"
//               }`}
//             >
//               {status.charAt(0).toUpperCase() + status.slice(1)}
//             </button>
//           )
//         )}
//       </div>

//       {/* BOOKINGS TABLE */}
//       {filteredBookings.length === 0 ? (
//         <p className="text-gray-500 text-center">No reservations found.</p>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg bg-white">
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-green-50">
//               <tr className="text-left text-green-700 font-semibold">
//                 <th className="p-3 border-b">Reservation ID</th>
//                 <th className="p-3 border-b">EV Owner NIC</th>
//                 <th className="p-3 border-b">Vehicle</th>
//                 <th className="p-3 border-b">Station</th>
//                 <th className="p-3 border-b">Charger</th>
//                 <th className="p-3 border-b">Connector</th>
//                 <th className="p-3 border-b">Start</th>
//                 <th className="p-3 border-b">End</th>
//                 <th className="p-3 border-b">Status</th>
//                 <th className="p-3 border-b text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredBookings.map((b) => (
//                 <tr key={b.id} className="hover:bg-gray-50 text-sm">
//                   <td className="p-3 border-b">{b.id}</td>
//                   <td className="p-3 border-b">{b.ownerNic}</td>
//                   <td className="p-3 border-b">
//                     {b.vehicle
//                       ? `${b.vehicle.make} ${b.vehicle.model} (${b.vehicle.plate})`
//                       : "—"}
//                   </td>
//                   <td className="p-3 border-b">{b.stationId}</td>
//                   <td className="p-3 border-b">{b.chargerId}</td>
//                   <td className="p-3 border-b">
//                     {b.vehicle?.connectorType || "—"}
//                   </td>
//                   <td className="p-3 border-b">
//                     {new Date(b.start).toLocaleString()}
//                   </td>
//                   <td className="p-3 border-b">
//                     {new Date(b.end).toLocaleString()}
//                   </td>
//                   <td
//                     className={`p-3 border-b font-semibold ${
//                       b.status === "Pending"
//                         ? "text-yellow-600"
//                         : b.status === "Approved"
//                         ? "text-green-600"
//                         : b.status === "Completed"
//                         ? "text-blue-600"
//                         : b.status === "Cancelled"
//                         ? "text-red-600"
//                         : "text-gray-600"
//                     }`}
//                   >
//                     {b.status}
//                   </td>

//                   {/* ACTION BUTTONS */}
//                   <td className="p-3 border-b text-center">
//                     {b.status === "Pending" ? (
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleApprove(b.id)}
//                           className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
//                         >
//                           Approve
//                         </button>
//                       </div>
//                     ) : b.status === "Approved" ? (
//                       <button
//                         onClick={() => handleRegenerateQr(b.id)}
//                         className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                       >
//                         Regenerate QR
//                       </button>
//                     ) : (
//                       <span className="text-gray-400">—</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


/**
 * ============================================================
 * ✅ StationBookings.jsx — EV Charging System (2025)
 * ============================================================
 * PURPOSE:
 *   • Display and manage reservations for the logged-in station operator.
 *   • Show reservation details (EV owner, vehicle, charger, slots, status).
 *   • Allow approving and regenerating QR codes.
 *
 * DEPENDENCIES:
 *   - stationOperatorReservations.js (API)
 *   - AuthContext for token & user
 *   - react-toastify for notifications
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getMyReservations,
  approveReservation,
  regenerateReservationQr,
} from "../../api/stationOperatorReservations";

import { getChargerById } from "../../api/chargersApi";

import { FiCheckCircle } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";
import { MdQrCode2 } from "react-icons/md";


// Toggle used to approve a reservation (clicking approves)
function ApproveToggle({ status, onApprove }) {
  const isApproved = status?.toLowerCase() === "approved";



  if (isApproved) {
    return (
      <span
        className="inline-flex items-center gap-1 text-green-600 font-semibold"
        title="Already approved"
      >
        <FiCheckCircle className="text-lg" />
        Approved
      </span>
    );
  }

  // Not approved yet -> show a toggle button that triggers approval
  return (
    <button
      onClick={onApprove}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 hover:bg-gray-400 transition"
      title="Approve reservation"
    >
      <span className="sr-only">Approve</span>
      <span className="inline-block h-5 w-5 transform rounded-full bg-white translate-x-1 transition" />
    </button>
  );
}

export default function StationBookings() {
  const { user } = useAuth(); // ✅ contains token & operator details
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | pending | approved | completed
const [chargerNames, setChargerNames] = useState({}); 

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async () => {
    try {
      setLoading(true);

      if (!user || !user.token) {
        toast.error("⚠️ Session expired. Please log in again.");
        return;
      }

      const data = await getMyReservations();
      setBookings(data);
      // ✅ Fetch charger names for each unique chargerId
// const uniqueChargerIds = [...new Set(data.map((b) => b.chargerId))];
const uniqueChargerIds = [...new Set(data.map((b) => b.chargerId).filter(Boolean))];


const chargerMap = {};
for (const id of uniqueChargerIds) {
  try {
    const charger = await getChargerById(id);
    chargerMap[id] = charger?.code || "Unknown Charger";
  } catch {
    chargerMap[id] = "Unknown Charger";
  }
}

setChargerNames(chargerMap);


    } catch (err) {
      console.error("❌ Fetch Error:", err);
      toast.error("❌ Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- APPROVE RESERVATION ----------------
  const handleApprove = async (id) => {
    try {
      await approveReservation(id);
      toast.success("✅ Reservation approved successfully!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to approve reservation.");
    }
  };

  // ---------------- REGENERATE QR CODE ----------------
  const handleRegenerateQr = async (id) => {
    try {
      const res = await regenerateReservationQr(id);
      toast.success("🔄 QR Code regenerated successfully!");
      console.log("New QR Data:", res.qrCode);
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to regenerate QR code.");
    }
  };

  // ---------------- FILTER BOOKINGS ----------------
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter(
          (b) => b.status?.toLowerCase() === filter.toLowerCase()
        );

  // ---------------- RENDER ----------------
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading reservations...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Station Reservations
      </h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "approved", "completed", "cancelled"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-all duration-200 ${
                filter === status
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          )
        )}
      </div>

      {/* BOOKINGS TABLE */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-500 text-center">No reservations found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-blue-50">
              <tr className="text-left text-blue-700 font-semibold">
                {/* <th className="p-3 border-b">Reservation ID</th> */}
                <th className="p-3 border-b">EV Owner NIC</th>
                <th className="p-3 border-b">Vehicle</th>
                {/* <th className="p-3 border-b">Station</th> */}
                <th className="p-3 border-b">Charger</th>
                <th className="p-3 border-b">Connector</th>
                <th className="p-3 border-b">Start</th>
                <th className="p-3 border-b">End</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 text-sm">
                  {/* <td className="p-3 border-b">{b.id}</td> */}
                  <td className="p-3 border-b">{b.ownerNic}</td>
                  <td className="p-3 border-b">
                    {b.vehicle
                      ? `${b.vehicle.make} ${b.vehicle.model} (${b.vehicle.plate})`
                      : "—"}
                  </td>
                  {/* <td className="p-3 border-b">{b.stationId}</td> */}
                  {/* <td className="p-3 border-b">{b.chargerId}</td> */}
                  {/* <td className="p-3 border-b">{chargerNames[b.code] || "Loading..."}</td> */}
                  {/* <td className="p-3 border-b">{chargerNames[b.chargerId] || "Loading..."}</td> */}

<td className="p-3 border-b">
  {b.chargerId ? (chargerNames[b.chargerId] ?? "Loading...") : "—"}
</td>

                  <td className="p-3 border-b">
                    {b.vehicle?.connectorType || "—"}
                  </td>
                  <td className="p-3 border-b">
                    {new Date(b.start).toLocaleString()}
                  </td>
                  <td className="p-3 border-b">
                    {new Date(b.end).toLocaleString()}
                  </td>
                  <td
                    className={`p-3 border-b font-semibold ${
                      b.status === "PENDING"
                        ? "text-yellow-600"
                        : b.status === "APPROVED"
                        ? "text-green-600"
                        : b.status === "COMPLETED"
                        ? "text-blue-600"
                        : b.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {b.status}
                  </td>

                  {/* ACTION BUTTONS */}
                  {/* <td className="p-3 border-b text-center">
                    {b.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleApprove(b.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Approve
                        </button>
                      </div>
                    ) : b.status === "approved" ? (
                      <button
                        onClick={() => handleRegenerateQr(b.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Regenerate QR
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td> */}

                  <td className="p-3 border-b">
  <div className="flex items-center justify-center gap-3">
    {/* Toggle to approve when Pending */}
    {b.status === "PENDING" && (
      <ApproveToggle status={b.status} onApprove={() => handleApprove(b.id)} />
    )}

    {/* Regenerate QR when Approved */}
    {b.status === "APPROVED" && (
      <button
        onClick={() => handleRegenerateQr(b.id)}
        className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700"
        title="Regenerate QR"
      >
        <MdQrCode2 className="text-xl" />
      </button>
    )}

    {/* Fallback dash when neither action is applicable */}
    {!(b.status === "PENDING" || b.status === "APPROVED") && (
      <span className="text-gray-400">—</span>
    )}
  </div>
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
