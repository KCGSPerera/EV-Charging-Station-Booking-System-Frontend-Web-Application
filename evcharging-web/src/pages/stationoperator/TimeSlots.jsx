// /**
//  * ============================================================
//  * ✅ TimeSlots.jsx — EV Charging System (Operator View)
//  * ============================================================
//  * PURPOSE:
//  *   • Display and manage available time slots for assigned stations.
//  *   • Filter by date, start/end time.
//  *   • Create new time slots via popup.
//  * ============================================================
//  */

// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   createTimeSlots,
//   getAllTimeSlots,
//   cancelTimeSlot,
// } from "../../api/stationOperatorTimeSlotsApi";
// import { getMyStations } from "../../api/stationOperatorApi";
// import { getChargersByStation } from "../../api/chargersApi";
// import { FaPlus, FaTimes } from "react-icons/fa";

// export default function TimeSlots() {
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [filteredSlots, setFilteredSlots] = useState([]);
//   const [filters, setFilters] = useState({ date: "", start: "", end: "" });
//   const [stations, setStations] = useState([]);
//   const [chargers, setChargers] = useState([]);
//   const [selectedStation, setSelectedStation] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [newSlot, setNewSlot] = useState({
//     stationId: "",
//     chargerId: "",
//     date: "",
//     startTime: "",
//     endTime: "",
//     isForWeek: false,
//   });
//   const [loading, setLoading] = useState(true);

//   // ---------------- FETCH ALL DATA ----------------
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [stationData, slotData] = await Promise.all([
//         getMyStations(),
//         getAllTimeSlots(),
//       ]);
//       setStations(stationData || []);
//       setTimeSlots(slotData || []);
//       setFilteredSlots(slotData || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Failed to load time slots.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // ---------------- FILTER SLOTS ----------------
//   const handleFilter = () => {
//     let filtered = [...timeSlots];
//     if (filters.date)
//       filtered = filtered.filter((s) => s.date.startsWith(filters.date));
//     if (filters.start)
//       filtered = filtered.filter((s) =>
//         s.start.toLowerCase().includes(filters.start.toLowerCase())
//       );
//     if (filters.end)
//       filtered = filtered.filter((s) =>
//         s.end.toLowerCase().includes(filters.end.toLowerCase())
//       );
//     setFilteredSlots(filtered);
//   };

//   // ---------------- FETCH CHARGERS WHEN STATION CHANGES ----------------
//   const handleStationSelect = async (stationId) => {
//     setSelectedStation(stationId);
//     setNewSlot((prev) => ({ ...prev, stationId }));
//     try {
//       const data = await getChargersByStation(stationId);
//       setChargers(data || []);
//     } catch {
//       setChargers([]);
//     }
//   };

//   // ---------------- CREATE NEW SLOT ----------------
//   const handleAddSlot = async (e) => {
//     e.preventDefault();
//     try {
//       await createTimeSlots(newSlot);
//       toast.success("✅ Time slot created successfully!");
//       setShowAddModal(false);
//       setNewSlot({
//         stationId: "",
//         chargerId: "",
//         date: "",
//         startTime: "",
//         endTime: "",
//         isForWeek: false,
//       });
//       fetchData();
//     } catch (error) {
//       console.error(error);
//       toast.error("❌ Failed to create time slot.");
//     }
//   };

//   // ---------------- CANCEL SLOT ----------------
//   const handleCancel = async (id) => {
//     const reason = prompt("Enter cancellation reason:");
//     if (!reason) return;
//     try {
//       await cancelTimeSlot(id, reason );
//       toast.info("⚠️ Slot cancelled.");
//       fetchData();
//     } catch (error) {
//       toast.error("❌ Failed to cancel slot.");
//     }
//   };

//   // ---------------- RENDER ----------------
//   if (loading) {
//     return <div className="p-6 text-center">Loading time slots...</div>;
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
//         <h2 className="text-2xl font-bold text-blue-700">
//           Operator Time Slots
//         </h2>
//         <button
//           onClick={() => setShowAddModal(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
//         >
//           <FaPlus /> Create Time Slot
//         </button>
//       </div>

//       {/* FILTERS */}
//       <div className="flex flex-wrap gap-3 mb-4">
//         <input
//           type="date"
//           value={filters.date}
//           onChange={(e) => setFilters({ ...filters, date: e.target.value })}
//           className="border rounded p-2"
//         />
//         <input
//           type="time"
//           value={filters.start}
//           onChange={(e) => setFilters({ ...filters, start: e.target.value })}
//           className="border rounded p-2"
//         />
//         <input
//           type="time"
//           value={filters.end}
//           onChange={(e) => setFilters({ ...filters, end: e.target.value })}
//           className="border rounded p-2"
//         />
//         <button
//           onClick={handleFilter}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Apply Filters
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded shadow overflow-x-auto">
//         <table className="min-w-full border-collapse">
//           <thead className="bg-blue-50 text-blue-700">
//             <tr>
//               <th className="p-3 border-b text-left">Date</th>
//               <th className="p-3 border-b text-left">Start Time</th>
//               <th className="p-3 border-b text-left">End Time</th>
//               <th className="p-3 border-b text-left">Status</th>
//               <th className="p-3 border-b text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSlots.length > 0 ? (
//               filteredSlots.map((slot) => (
//                 <tr key={slot.id} className="border-b hover:bg-gray-50">
//                   <td className="p-3">{slot.date}</td>
//                   <td className="p-3">
//                     {new Date(slot.start).toLocaleTimeString()}
//                   </td>
//                   <td className="p-3">
//                     {new Date(slot.end).toLocaleTimeString()}
//                   </td>
//                   <td className="p-3">{slot.status}</td>
//                   <td className="p-3 text-center">
//                     {slot.status !== "Cancelled" && (
//                       <button
//                         onClick={() => handleCancel(slot.id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan="5"
//                   className="text-center text-gray-500 py-4 italic"
//                 >
//                   No time slots found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ADD MODAL */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
//             <h3 className="text-xl font-semibold text-blue-700 mb-4">
//               Create New Time Slot
//             </h3>
//             <form onSubmit={handleAddSlot}>
//               <div className="mb-3">
//                 <label className="block mb-1 text-gray-700">Station</label>
//                 <select
//                   value={newSlot.stationId}
//                   onChange={(e) => handleStationSelect(e.target.value)}
//                   className="w-full border rounded p-2"
//                   required
//                 >
//                   <option value="">Select Station</option>
//                   {stations.map((s) => (
//                     <option key={s.id} value={s.id}>
//                       {s.code} : {s.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="mb-3">
//                 <label className="block mb-1 text-gray-700">Charger</label>
//                 <select
//                   value={newSlot.chargerId}
//                   onChange={(e) =>
//                     setNewSlot({ ...newSlot, chargerId: e.target.value })
//                   }
//                   className="w-full border rounded p-2"
//                   required
//                 >
//                   <option value="">Select Charger</option>
//                   {chargers.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.code} ({c.connectorType})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <label className="block mb-1 text-gray-700">Date</label>
//                   <input
//                     type="date"
//                     value={newSlot.date}
//                     onChange={(e) =>
//                       setNewSlot({ ...newSlot, date: e.target.value })
//                     }
//                     className="w-full border rounded p-2"
//                     required
//                   />
//                 </div>
//                 <div className="flex items-center gap-2 mt-6">
//                   <input
//                     type="checkbox"
//                     checked={newSlot.isForWeek}
//                     onChange={(e) =>
//                       setNewSlot({ ...newSlot, isForWeek: e.target.checked })
//                     }
//                   />
//                   <span>Create for entire week</span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-3">
//                 <div>
//                   <label className="block mb-1 text-gray-700">Start</label>
//                   <input
//                     type="time"
//                     value={newSlot.startTime}
//                     onChange={(e) =>
//                       setNewSlot({ ...newSlot, startTime: e.target.value })
//                     }
//                     className="w-full border rounded p-2"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block mb-1 text-gray-700">End</label>
//                   <input
//                     type="time"
//                     value={newSlot.endTime}
//                     onChange={(e) =>
//                       setNewSlot({ ...newSlot, endTime: e.target.value })
//                     }
//                     className="w-full border rounded p-2"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={() => setShowAddModal(false)}
//                   className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//                 >
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



/**
 * ============================================================
 * ✅ TimeSlots.jsx — Card-Based Operator View
 * ============================================================
 * PURPOSE:
 *   • Group slots by date and show them as cards.
 *   • Provide easy access to view, cancel, and manage availability.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTimeSlots,
  getAllTimeSlots,
  cancelTimeSlot,
} from "../../api/stationOperatorTimeSlotsApi";
import { FaCalendarAlt, FaClock, FaTimes, FaInfoCircle } from "react-icons/fa";

export default function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getAllTimeSlots();
      const grouped = data.reduce((acc, slot) => {
        const date = slot.date.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
      }, {});
      setGroupedSlots(grouped);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch time slots.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (slotId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;
    try {
      await cancelTimeSlot(slotId, reason );
      toast.info("⚠️ Slot cancelled successfully.");
      fetchSlots();
    } catch {
      toast.error("❌ Failed to cancel slot.");
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading slots...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Scheduled Time Slots
      </h2>

      {Object.keys(groupedSlots).length === 0 ? (
        <p className="text-center text-gray-500">No time slots available.</p>
      ) : (
        Object.entries(groupedSlots).map(([date, slots]) => (
          <div key={date} className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarAlt className="text-blue-600" />
              <h3 className="text-xl font-semibold text-blue-700">
                {new Date(date).toDateString()}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 rounded-lg shadow border ${
                    slot.status === "Available"
                      ? "border-green-400 bg-green-50"
                      : slot.status === "Busy"
                      ? "border-blue-400 bg-blue-50"
                      : slot.status === "Cancelled"
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-700 flex items-center gap-1">
                      <FaClock />{" "}
                      {`${new Date(slot.start).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} - ${new Date(slot.end).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}`}
                    </h4>
                    <span
                      className={`text-sm font-semibold px-2 py-1 rounded ${
                        slot.status === "Available"
                          ? "bg-green-200 text-green-800"
                          : slot.status === "Busy"
                          ? "bg-blue-200 text-blue-800"
                          : slot.status === "Cancelled"
                          ? "bg-red-200 text-red-800"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {slot.status}
                    </span>
                  </div>

                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() =>
                        alert(`Details:\n\nStart: ${slot.start}\nEnd: ${slot.end}`)
                      }
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                      <FaInfoCircle /> View
                    </button>

                    {slot.status !== "Cancelled" && (
                      <button
                        onClick={() => handleCancel(slot.id)}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
                      >
                        <FaTimes /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
