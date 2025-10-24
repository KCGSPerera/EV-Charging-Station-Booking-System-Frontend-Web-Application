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
  getOperatorReservationQrCode,
} from "../../api/stationOperatorReservations";

import { getChargerById } from "../../api/chargersApi";

import { FiCheckCircle } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";
import { MdQrCode2 } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoQrCodeOutline } from "react-icons/io5"; // For popup display
import { freeSlotsForReservation } from "../../api/stationOperatorReservations";



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
  const [qrPopup, setQrPopup] = useState({ visible: false, qrData: "" });
  // track reservations whose slots were freed in this session
  const [freedReservations, setFreedReservations] = useState(() => new Set());


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
  const handleApprove1 = async (id) => {
    try {
      await approveReservation(id);
      toast.success("✅ Reservation approved successfully!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to approve reservation.");
    }
  };

  // ---------------- APPROVE RESERVATION + GENERATE QR ----------------
const handleApprove2 = async (id) => {
  try {
    await approveReservation(id);
    const qrRes = await regenerateReservationQr(id); // ✅ Generate QR after approval
    toast.success("✅ Reservation approved and QR generated!");
    setQrPopup({ visible: true, qrData: qrRes.qrCode }); // show popup
    fetchBookings();
  } catch (err) {
    console.error(err);
    toast.error("❌ Failed to approve or generate QR.");
  }
};

// ---------------- APPROVE RESERVATION + GENERATE QR ----------------
const handleApprove = async (id) => {
  try {
    await approveReservation(id);

    // ✅ Generate QR after approval
    const res = await regenerateReservationQr(id);

    // Extract Base64 image string from the API response
    const qrImage = res.qr?.imageBase64
      ? `data:${res.qr.imageContentType};base64,${res.qr.imageBase64}`
      : null;

    if (qrImage) {
      setQrPopup({ visible: true, qrData: qrImage });
      toast.success("✅ Reservation approved and QR generated!");
    } else {
      toast.warning("⚠️ QR generated, but no image returned.");
    }

    fetchBookings();
  } catch (err) {
    console.error("❌ Approve + QR Error:", err);
    toast.error("❌ Failed to approve or generate QR.");
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

  // ---------------- VIEW QR CODE ----------------
const handleViewQr = async (id) => {
  try {
    // ✅ Call the operator endpoint to fetch QR
    const qrData = await getOperatorReservationQrCode(id);

    const qrImage = qrData?.imageBase64
      ? `data:${qrData.contentType || "image/png"};base64,${qrData.imageBase64}`
      : null;

    if (qrImage) {
      setQrPopup({ visible: true, qrData: qrImage });
    } else {
      toast.warning("⚠️ No QR image available for this reservation.");
    }
  } catch (err) {
    console.error("❌ View QR Error:", err);

    if (err?.response?.status === 403) {
      toast.error("🚫 You are not authorized to view this QR code.");
    } else {
      toast.error("❌ Failed to load reservation QR.");
    }
  }
};

// ---------------- FREE SLOTS FOR A CANCELLED RESERVATION ----------------
const handleFreeSlots1 = async (reservationId) => {
  try {
    await freeSlotsForReservation(reservationId);
    toast.success(" Slots were marked available.");
    fetchBookings(); // refresh bookings
  } catch (err) {
    console.error("❌ Free slots error:", err);
    toast.error(err?.response?.data || "❌ Failed to free slots.");
  }
};

const handleFreeSlots = async (reservationId) => {
  try {
    await freeSlotsForReservation(reservationId);
    toast.success("✅ Slots were marked available.");

    // mark this reservation as freed (create a new Set to trigger re-render)
    setFreedReservations(prev => {
      const next = new Set(prev);
      next.add(reservationId);
      return next;
    });

    fetchBookings();
  } catch (err) {
    console.error("❌ Free slots error:", err);
    toast.error(err?.response?.data || "❌ Failed to free slots.");
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

    {/* When Approved — show View QR, Regenerate, and Edit */}
    {b.status === "APPROVED" && (
      <>
        {/* ✅ View QR button */}
        {/* <button
          onClick={() => {
            const qrImage = b.qr?.imageBase64
              ? `data:${b.qr.imageContentType};base64,${b.qr.imageBase64}`
              : null;
            if (qrImage) {
              setQrPopup({ visible: true, qrData: qrImage });
            } else {
              toast.warning("⚠️ No QR image available for this reservation.");
            }
          }}
          className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700"
          title="View QR"
        >
          <IoQrCodeOutline className="text-xl" />
        </button> */}

        {/* ✅ View QR button */}
        {/*
<button
  onClick={() => {
    const qrImage = b.qr?.imageBase64
      ? `data:${b.qr.imageContentType || "image/png"};base64,${b.qr.imageBase64}`
      : null;

    if (qrImage) {
      setQrPopup({ visible: true, qrData: qrImage }); // ✅ open popup with image
    } else {
      toast.warning("⚠️ QR image not available for this reservation.");
    }
  }}
  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700"
  title="View QR"
>
  <IoQrCodeOutline className="text-xl" />
</button>
*/}

{/* View QR button (fetch via owners API) */}
<button
  onClick={() => handleViewQr(b.id)}
  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700"
  title="View QR"
>
  <IoQrCodeOutline className="text-xl" />
</button>

        {/* 🔄 Regenerate QR */}
        {/* <button
          onClick={() => handleRegenerateQr(b.id)}
          className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-700"
          title="Regenerate QR"
        >
          <MdQrCode2 className="text-xl" />
        </button> */}

        {/* ✏️ Edit reservation */}
        <button
          onClick={() => toast.info("🛠 Edit functionality coming soon!")}
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-200 text-gray-700"
          title="Edit reservation"
        >
          <MdEdit className="text-lg" />
        </button>
      </>
    )}

    {/* Fallback dash when neither action is applicable */}
    {!(b.status === "PENDING" || b.status === "APPROVED") && (
      <span className="text-gray-400">—</span>
    )}


    {/* When Cancelled — allow operator to free the booked slots */}
{/* {b.status === "CANCELLED" && (
  <button
    onClick={() => handleFreeSlots(b.id)}
    className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-sm"
    title="Free slots back to available"
  >
    Free Slots
  </button>
)} */}
{/* When Cancelled — allow operator to free the booked slots; show note after done */}
{b.status === "CANCELLED" && (
  freedReservations.has(b.id) ? (
    <span className="text-xs font-medium text-green-600" title="Slots already made available">
      Slots made available
    </span>
  ) : (
    <button
      onClick={() => handleFreeSlots(b.id)}
      className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-sm"
      title="Free slots back to available"
    >
      Free Slots
    </button>
  )
)}


  </div>
</td>


                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* QR Popup */}
{qrPopup.visible && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg text-center relative w-80">
      <h3 className="text-lg font-semibold mb-3 text-blue-700">Reservation QR Code</h3>
      <img
        src={qrPopup.qrData}
        alt="Reservation QR"
        className="mx-auto w-48 h-48 border border-gray-200 rounded"
      />
      <button
        onClick={() => setQrPopup({ visible: false, qrData: "" })}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
