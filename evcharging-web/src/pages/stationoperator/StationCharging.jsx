/**
 * ============================================================
 * ✅ StationCharging.jsx — EV Charging System (2025)
 * ============================================================
 * PURPOSE:
 *   • Allows Station Operators to view and manage their chargers.
 *   • Displays summary of charger statuses.
 *   • Fetch chargers from assigned stations.
 *   • View charger details and update their status.
 *   • No edit or delete permissions.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyStations } from "../../api/stationOperatorApi";
import {
  getChargersByStation,
  updateChargerStatus,
  getChargerById,
} from "../../api/chargersApi";
import { FaEye } from "react-icons/fa";

export default function StationCharging() {
  const [chargers, setChargers] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState("");
  const [loading, setLoading] = useState(true);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedChargerId, setSelectedChargerId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  // ---------------- FETCH OPERATOR’S STATIONS + CHARGERS ----------------
  const fetchStationsAndChargers = async () => {
    try {
      setLoading(true);
      const stationData = await getMyStations();

      if (!stationData || stationData.length === 0) {
        toast.info("No stations assigned to your account.");
        setStations([]);
        setChargers([]);
        setLoading(false);
        return;
      }

      setStations(stationData);
      const firstStationId = stationData[0].id;
      setSelectedStationId(firstStationId);

      const data = await getChargersByStation(firstStationId);
      setChargers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("❌ Unable to fetch stations or chargers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationsAndChargers();
  }, []);

  // ---------------- FETCH CHARGERS WHEN STATION CHANGES ----------------
  const handleStationChange = async (e) => {
    const stationId = e.target.value;
    setSelectedStationId(stationId);

    if (!stationId) {
      setChargers([]);
      return;
    }

    try {
      const data = await getChargersByStation(stationId);
      setChargers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("❌ Unable to fetch chargers for selected station.");
    }
  };

  // ---------------- CHANGE CHARGER STATUS ----------------
  const handleChangeStatus = (chargerId, currentStatus) => {
    setSelectedChargerId(chargerId);
    setSelectedStatus(currentStatus);
    setShowStatusModal(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedChargerId || !selectedStatus) return;
    try {
      await updateChargerStatus(selectedChargerId, selectedStatus);
      toast.success(`✅ Status updated to ${selectedStatus}`);
      setShowStatusModal(false);
      handleStationChange({ target: { value: selectedStationId } });
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update charger status.");
    }
  };

  // ---------------- VIEW CHARGER DETAILS ----------------
  const handleViewCharger = async (chargerId) => {
    try {
      const data = await getChargerById(chargerId);
      setSelectedCharger(data);
      setShowViewModal(true);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to fetch charger details.");
    }
  };

  // ---------------- STATUS SUMMARY CALCULATION ----------------
  const summary = {
    available: chargers.filter((c) => c.status?.toLowerCase() === "available").length,
    busy: chargers.filter((c) => c.status?.toLowerCase() === "busy").length,
    fault: chargers.filter((c) => c.status?.toLowerCase() === "fault").length,
    offline: chargers.filter((c) => c.status?.toLowerCase() === "offline").length,
  };
  const total =
    summary.available + summary.busy + summary.fault + summary.offline;

  // ---------------- RENDER ----------------
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Loading stations and chargers...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Charging Operations
      </h2>

      {/* STATION DROPDOWN */}
      <div className="mb-6 max-w-md">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Station
        </label>
        <select
          value={selectedStationId}
          onChange={handleStationChange}
          className="w-full border rounded p-2"
        >
          <option value="">Select a station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.code} : {station.name}
            </option>
          ))}
        </select>
      </div>

      {/* MAIN GRID: TABLE LEFT + SUMMARY RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — TABLE */}
        <div className="lg:col-span-2 bg-white p-6 rounded shadow overflow-x-auto">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            Existing Charging Points
          </h3>

          {chargers.length === 0 ? (
            <p className="text-gray-500 text-center">
              No charging points found.
            </p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="p-3 border-b text-left">Code</th>
                  <th className="p-3 border-b text-left">Connector Type</th>
                  <th className="p-3 border-b text-left">Power (kW)</th>
                  <th className="p-3 border-b text-center">Change Status</th>
                  <th className="p-3 border-b text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {chargers.map((charger) => (
                  <tr
                    key={charger.id}
                    className="hover:bg-gray-50 border-b text-sm"
                  >
                    <td className="p-3">{charger.code}</td>
                    <td className="p-3">{charger.connectorType}</td>
                    <td className="p-3">{charger.powerKw}</td>

                    {/* Status Button */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          handleChangeStatus(charger.id, charger.status)
                        }
                        className={`text-white px-3 py-1 rounded w-24 transition-colors capitalize ${
                          charger.status?.toLowerCase() === "available"
                            ? "bg-green-600 hover:bg-green-700"
                            : charger.status?.toLowerCase() === "busy"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : charger.status?.toLowerCase() === "fault"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-gray-600 hover:bg-gray-700"
                        }`}
                      >
                        {charger.status}
                      </button>
                    </td>

                    {/* View Button */}
                    <td className="p-3 text-center">
                      <FaEye
                        onClick={() => handleViewCharger(charger.id)}
                        className="text-blue-600 cursor-pointer hover:text-blue-800"
                        title="View Charger"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT COLUMN — SUMMARY CARDS */}
        {/* <div className="flex flex-col gap-4">
            <p className="text-4xl font-semibold text-center">Chargers Summary</p>
          <div className="bg-green-100 text-green-700 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Available</h4>
            <p className="text-3xl font-bold">{summary.available}</p>
          </div>
          <div className="bg-blue-100 text-blue-700 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Busy</h4>
            <p className="text-3xl font-bold">{summary.busy}</p>
          </div>
          <div className="bg-yellow-100 text-yellow-700 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Fault</h4>
            <p className="text-3xl font-bold">{summary.fault}</p>
          </div>
          <div className="bg-gray-100 text-gray-700 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Offline</h4>
            <p className="text-3xl font-bold">{summary.offline}</p>
          </div>
          <div className="bg-purple-100 text-purple-700 p-4 rounded shadow text-center">
            <h4 className="text-lg font-semibold">Total</h4>
            <p className="text-3xl font-bold">{total}</p>
          </div>
        </div> */}
        <div className="flex flex-col gap-4">
  <p className="text-3xl font-semibold text-center mb-2 ">Chargers Summary</p>

  <div className="bg-green-100 text-green-700 p-4 rounded shadow flex justify-between items-center">
    <h4 className="text-lg font-semibold ">Available</h4>
    <p className="text-3xl font-bold">{summary.available}</p>
  </div>

  <div className="bg-blue-100 text-blue-700 p-4 rounded shadow flex justify-between items-center">
    <h4 className="text-lg font-semibold">Busy</h4>
    <p className="text-3xl font-bold">{summary.busy}</p>
  </div>

  <div className="bg-yellow-100 text-yellow-700 p-4 rounded shadow flex justify-between items-center">
    <h4 className="text-lg font-semibold">Fault</h4>
    <p className="text-3xl font-bold">{summary.fault}</p>
  </div>

  <div className="bg-gray-100 text-gray-700 p-4 rounded shadow flex justify-between items-center">
    <h4 className="text-lg font-semibold">Offline</h4>
    <p className="text-3xl font-bold">{summary.offline}</p>
  </div>

  <div className="bg-purple-100 text-purple-700 p-4 rounded shadow flex justify-between items-center">
    <h4 className="text-lg font-semibold">Total</h4>
    <p className="text-3xl font-bold">{total}</p>
  </div>
</div>

      </div>

      {/* STATUS CHANGE MODAL */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Change Charger Status
            </h3>
            <p className="text-gray-700 mb-3">
              Select a new status for this charger:
            </p>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="fault">Fault</option>
              <option value="offline">Offline</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowStatusModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusChange}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW CHARGER MODAL */}
      {showViewModal && selectedCharger && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-200">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-2xl font-semibold text-blue-700">
                ⚡ Charger Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-800">
              <p className="font-semibold text-gray-600">Code:</p>
              <p>{selectedCharger.code}</p>

              <p className="font-semibold text-gray-600">Connector Type:</p>
              <p>{selectedCharger.connectorType}</p>

              <p className="font-semibold text-gray-600">Power (kW):</p>
              <p>{selectedCharger.powerKw}</p>

              <p className="font-semibold text-gray-600">Status:</p>
              <p
                className={`font-medium capitalize ${
                  selectedCharger.status === "available"
                    ? "text-green-600"
                    : selectedCharger.status === "busy"
                    ? "text-blue-600"
                    : selectedCharger.status === "fault"
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {selectedCharger.status}
              </p>

              <p className="font-semibold text-gray-600">Station ID:</p>
              <p className="truncate">{selectedCharger.stationId}</p>

              <p className="font-semibold text-gray-600">Created At:</p>
              <p>{new Date(selectedCharger.createdAt).toLocaleString()}</p>

              <p className="font-semibold text-gray-600">Updated At:</p>
              <p>{new Date(selectedCharger.updatedAt).toLocaleString()}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
