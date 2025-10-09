/**
 * ============================================================
 * ✅ TimeSlots.jsx — Card-Based Operator View (Enhanced)
 * ============================================================
 * PURPOSE:
 *   • Group slots by date and show them as cards.
 *   • Provide easy access to view, cancel, and manage availability.
 *   • NEW: Added filter bar for date, start time, end time, charger details, and status.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  createTimeSlots,
  getAllTimeSlots,
  cancelTimeSlot,
} from "../../api/stationOperatorTimeSlotsApi";
import { getMyStations } from "../../api/stationOperatorApi";
import { getChargersByStation, getChargerById } from "../../api/chargersApi";
import { FaCalendarAlt, FaClock, FaTimes, FaInfoCircle, FaSearch } from "react-icons/fa";

export default function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [groupedSlots, setGroupedSlots] = useState({});
  const [loading, setLoading] = useState(true);

  // --- NEW STATE: Filters ---
  const [filters, setFilters] = useState({
    date: "",
    startHour: "",
    startMinute: "",
    endHour: "",
    endMinute: "",
    chargerId: "",
    status: "",
  });

  const [stations, setStations] = useState([]);
  const [chargers, setChargers] = useState([]);

  // ---------------- Options ----------------
  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  // ---------------- NEW: Create Time Slot Modal ----------------
const [showCreateModal, setShowCreateModal] = useState(false);
const [newSlot, setNewSlot] = useState({
  stationId: "",
  chargerId: "",
  date: "",
  startTime: "",
  endTime: "",
  isForWeek: false,
});


  // ---------------- FETCH ALL SLOTS ----------------
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
      setTimeSlots(data);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch time slots.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FETCH STATIONS + CHARGERS ----------------
  const fetchChargers = async () => {
    try {
      const stationData = await getMyStations();
      setStations(stationData || []);
      if (stationData && stationData.length > 0) {
        const firstStation = stationData[0];
        const chargerData = await getChargersByStation(firstStation.id);
        setChargers(chargerData || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ---------------- FILTER HANDLER ----------------
  const handleFilter = async () => {
    try {
      let filtered = [...timeSlots];

      // Date filter
      if (filters.date)
        filtered = filtered.filter((slot) => slot.date.startsWith(filters.date));

      // Convert start/end time to minutes since midnight
      const startTotalMins =
        filters.startHour && filters.startMinute
          ? parseInt(filters.startHour) * 60 + parseInt(filters.startMinute)
          : null;
      const endTotalMins =
        filters.endHour && filters.endMinute
          ? parseInt(filters.endHour) * 60 + parseInt(filters.endMinute)
          : null;

      // Filter by time range
      if (startTotalMins !== null)
        filtered = filtered.filter((slot) => {
          const slotStart = new Date(slot.start);
          const slotMins =
            slotStart.getHours() * 60 + slotStart.getMinutes();
          return slotMins >= startTotalMins;
        });

      if (endTotalMins !== null)
        filtered = filtered.filter((slot) => {
          const slotEnd = new Date(slot.end);
          const slotMins = slotEnd.getHours() * 60 + slotEnd.getMinutes();
          return slotMins <= endTotalMins;
        });

      // Charger filter
      if (filters.chargerId)
        filtered = filtered.filter((slot) => slot.chargerId === filters.chargerId);

      // Status filter
      if (filters.status)
        filtered = filtered.filter(
          (slot) =>
            slot.status.toLowerCase() === filters.status.toLowerCase()
        );

      // Regroup filtered data
      const grouped = filtered.reduce((acc, slot) => {
        const date = slot.date.split("T")[0];
        if (!acc[date]) acc[date] = [];
        acc[date].push(slot);
        return acc;
      }, {});
      setGroupedSlots(grouped);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to filter slots.");
    }
  };

  // ---------------- CANCEL HANDLER ----------------
  const handleCancel = async (slotId) => {
    const reason = prompt("Enter cancellation reason:");
    if (!reason) return;
    try {
      await cancelTimeSlot(slotId, reason);
      toast.info("⚠️ Slot cancelled successfully.");
      fetchSlots();
    } catch {
      toast.error("❌ Failed to cancel slot.");
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchChargers();
  }, []);

  // ---------------- RENDER ----------------
  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading slots...</div>;

  return (
    <div className="p-6">
      {/* <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Scheduled Time Slots
      </h2> */}

      {/* Header Row with Create Button */}
<div className="flex justify-between items-center mb-4">
  <h2 className="text-2xl font-bold text-blue-700">Scheduled Time Slots</h2>
  <button
    onClick={() => setShowCreateModal(true)}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    ➕ Create Time Slot
  </button>
</div>


      {/* ---------------- FILTER SECTION ---------------- */}
      <div className="bg-white p-4 rounded shadow mb-6 flex flex-wrap gap-4 items-end">
        {/* Date */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Date</label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => {
              setFilters({ ...filters, date: e.target.value });
              handleFilter();
            }}
            className="border rounded p-2 w-48"
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Start Time
          </label>
          <div className="flex gap-2">
            <select
              value={filters.startHour}
              onChange={(e) => {
                setFilters({ ...filters, startHour: e.target.value });
                handleFilter();
              }}
              className="border rounded p-2 w-20"
            >
              <option value="">HH</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              value={filters.startMinute}
              onChange={(e) => {
                setFilters({ ...filters, startMinute: e.target.value });
                handleFilter();
              }}
              className="border rounded p-2 w-20"
            >
              <option value="">MM</option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* End Time */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">End Time</label>
          <div className="flex gap-2">
            <select
              value={filters.endHour}
              onChange={(e) => {
                setFilters({ ...filters, endHour: e.target.value });
                handleFilter();
              }}
              className="border rounded p-2 w-20"
            >
              <option value="">HH</option>
              {hours.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <select
              value={filters.endMinute}
              onChange={(e) => {
                setFilters({ ...filters, endMinute: e.target.value });
                handleFilter();
              }}
              className="border rounded p-2 w-20"
            >
              <option value="">MM</option>
              {minutes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Charger Dropdown */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">
            Charger Details
          </label>
          <select
            value={filters.chargerId}
            onChange={(e) => {
              setFilters({ ...filters, chargerId: e.target.value });
              handleFilter();
            }}
            className="border rounded p-2 w-56"
          >
            <option value="">All Chargers</option>
            {chargers.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.connectorType} - ${c.powerKw}kW`}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              handleFilter();
            }}
            className="border rounded p-2 w-40"
          >
            <option value="">All</option>
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Search Button */}
        {/* <div>
          <button
            onClick={handleFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
          >
            <FaSearch /> Search
          </button>
        </div> */}
        {/* Search & Reset Buttons */}
<div className="flex gap-2">
  <button
    onClick={handleFilter}
    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
  >
    <FaSearch /> Search
  </button>

  <button
    onClick={() => {
      setFilters({
        date: "",
        startHour: "",
        startMinute: "",
        endHour: "",
        endMinute: "",
        chargerId: "",
        status: "",
      });
      fetchSlots(); // 🔄 reload all slots
    }}
    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
  >
    Reset
  </button>
</div>

      </div>

      {/* ---------------- TIME SLOT DISPLAY ---------------- */}
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
                        alert(
                          `Details:\n\nStart: ${slot.start}\nEnd: ${slot.end}\nStatus: ${slot.status}`
                        )
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

      {/* CREATE TIME SLOT MODAL */}
{showCreateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
      <h3 className="text-xl font-semibold text-blue-700 mb-4">
        Create New Time Slot
      </h3>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            if (
              !newSlot.stationId ||
              !newSlot.chargerId ||
              !newSlot.date ||
              !newSlot.startTime ||
              !newSlot.endTime
            ) {
              toast.error("⚠️ Please fill all required fields.");
              return;
            }

            await createTimeSlots(newSlot);
            toast.success("✅ Time slot(s) created successfully!");
            setShowCreateModal(false);
            setNewSlot({
              stationId: "",
              chargerId: "",
              date: "",
              startTime: "",
              endTime: "",
              isForWeek: false,
            });
            fetchSlots();
          } catch (error) {
            console.error(error);
            toast.error("❌ Failed to create time slot.");
          }
        }}
      >
        {/* Station Selector */}
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Select Station</label>
          <select
            value={newSlot.stationId}
            onChange={(e) =>
              setNewSlot({ ...newSlot, stationId: e.target.value })
            }
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Station</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} : {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Charger Selector */}
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Select Charger</label>
          <select
            value={newSlot.chargerId}
            onChange={(e) =>
              setNewSlot({ ...newSlot, chargerId: e.target.value })
            }
            className="w-full border rounded p-2"
            required
          >
            <option value="">Select Charger</option>
            {chargers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.connectorType} ({c.powerKw}kW)
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Date</label>
          <input
            type="date"
            value={newSlot.date}
            onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>

        {/* Start & End Time */}
        <div className="flex gap-4 mb-3">
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) =>
                setNewSlot({ ...newSlot, startTime: e.target.value })
              }
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) =>
                setNewSlot({ ...newSlot, endTime: e.target.value })
              }
              className="w-full border rounded p-2"
              required
            />
          </div>
        </div>

        {/* Is For Week Checkbox */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={newSlot.isForWeek}
            onChange={(e) =>
              setNewSlot({ ...newSlot, isForWeek: e.target.checked })
            }
          />
          <label className="text-gray-700">Apply for the whole week</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowCreateModal(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}
