/**
 * ============================================================
 * ✅ Charging.jsx — EV Charging System (2025)
 * ============================================================
 * PURPOSE:
 *   • Manage all charging points system-wide (admin only).
 *   • Search, create, view, delete, and update charger statuses.
 *   • Fetch all stations from /api/stations.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllStations,
} from "../../api/adminStationApi";
import {
  getChargersByStation,
  createCharger,
  getChargerById,
  updateCharger,
  updateChargerStatus,
  deleteCharger,
} from "../../api/chargersApi";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";

export default function Charging() {
  const [stations, setStations] = useState([]);
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
    // ---------------- STATUS MODAL ----------------
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedChargerId, setSelectedChargerId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [newCharger, setNewCharger] = useState({
    stationId: "",
    connectorType: "",
    powerKw: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

    // ---------------- DELETE CONFIRMATION MODAL ----------------
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

    // ---------------- VIEW CHARGER MODAL ----------------
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCharger, setSelectedCharger] = useState(null);

  // ---------------- EDIT CHARGER MODAL ----------------
const [showEditModal, setShowEditModal] = useState(false);
const [editCharger, setEditCharger] = useState({
  id: "",
  stationId: "",
  code: "",
  connectorType: "",
  powerKw: "",
  status: "",
});


  // ---------------- FETCH ALL STATIONS ----------------
  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await getAllStations("", 0, 100);
      if (!Array.isArray(data)) throw new Error("Invalid station data");
      setStations(data);

      // Get chargers for all stations combined
      let allChargers = [];
      for (const s of data) {
        try {
          const stationChargers = await getChargersByStation(s.id);
          allChargers = [...allChargers, ...stationChargers.map(c => ({ ...c, stationName: s.name, stationCode: s.code }))];
        } catch {
          // continue gracefully
        }
      }
      setChargers(allChargers);
      setFilteredChargers(allChargers);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to load stations or chargers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // ---------------- SEARCH CHARGERS ----------------
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredChargers(chargers);
      return;
    }

    const filtered = chargers.filter(
      (c) =>
        c.code?.toLowerCase().includes(value) ||
        c.connectorType?.toLowerCase().includes(value) ||
        c.stationName?.toLowerCase().includes(value)
    );
    setFilteredChargers(filtered);
  };

  // ---------------- CHANGE CHARGER STATUS ----------------
  const handleChangeStatus1 = async (chargerId, currentStatus) => {
    const nextStatus =
      currentStatus === "Available"
        ? "Busy"
        : currentStatus === "Busy"
        ? "Fault"
        : currentStatus === "Fault"
        ? "Offline"
        : "Available";

    try {
      await updateChargerStatus(chargerId, nextStatus);
      toast.info(`🔄 Charger status changed to ${nextStatus}`);
      fetchStations();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update charger status.");
    }
  };
    // ---------------- OPEN STATUS MODAL ----------------
  const handleChangeStatus = (chargerId, currentStatus) => {
    setSelectedChargerId(chargerId);
    setSelectedStatus(currentStatus);
    setShowStatusModal(true);
  };

  // ---------------- CONFIRM STATUS UPDATE ----------------
  const confirmStatusChange = async () => {
    if (!selectedChargerId || !selectedStatus) return;
    try {
      await updateChargerStatus(selectedChargerId, selectedStatus);
      toast.success(`✅ Status updated to ${selectedStatus}`);
      setShowStatusModal(false);
      fetchStations();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update charger status.");
    }
  };


  // ---------------- DELETE CHARGER ----------------
  const handleDelete1 = async (chargerId) => {
    if (!window.confirm("Are you sure you want to delete this charger?")) return;
    try {
      await deleteCharger(chargerId);
      toast.success("🗑 Charger deleted successfully!");
      fetchStations();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete charger.");
    }
  };

    // ---------------- OPEN DELETE MODAL ----------------
  const handleDelete = (chargerId) => {
    setDeleteTargetId(chargerId);
    setShowDeleteModal(true);
  };

  // ---------------- CONFIRM DELETE ----------------
  const confirmDelete = async () => {
    try {
      await deleteCharger(deleteTargetId);
      toast.success("🗑 Charger deleted successfully!");
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      fetchStations();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete charger.");
    }
  };


  // ---------------- CREATE CHARGER ----------------
  const handleAddCharger = async (e) => {
    e.preventDefault();
    if (!newCharger.stationId) {
      toast.error("Please select a station before creating a charger.");
      return;
    }
    try {
      await createCharger(newCharger.stationId, newCharger);
      toast.success("✅ Charger created successfully!");
      setNewCharger({ stationId: "", connectorType: "", powerKw: "" });
      setShowAddModal(false);
      fetchStations();
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to create charger.");
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

  // ---------------- OPEN EDIT MODAL ----------------
const handleEditCharger = (charger) => {
  setEditCharger({
    id: charger.id,
    stationId: charger.stationId,
    code: charger.code,
    connectorType: charger.connectorType,
    powerKw: charger.powerKw,
    status: charger.status,
  });
  setShowEditModal(true);
};

// ---------------- SAVE CHANGES ----------------
const handleUpdateCharger = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      code: editCharger.code,
      connectorType: editCharger.connectorType,
      powerKw: Number(editCharger.powerKw),
      status: editCharger.status,
    };
    await updateCharger(editCharger.id, payload);
    toast.success("✅ Charger updated successfully!");
    setShowEditModal(false);
    fetchStations();
  } catch (error) {
    console.error(error);
    toast.error("❌ Failed to update charger.");
  }
};



  // ---------------- RENDER ----------------
  return (
    <div className="p-6">

        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-semibold">Charging Points Management</h1>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <FaPlus /> Create Charger
                </button>
              </div>

      {/* <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Charging Points Management
      </h2> */}

      {/* SEARCH BAR */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by code, connector type, or station name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full border rounded p-2 pl-10"
          />
          <FaSearch className="absolute top-3 left-3 text-gray-500" />
        </div>
        {/* <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 rounded flex items-center gap-2"
        >
          ➕ Create Charger
        </button> */}
      </div>

      {/* CHARGERS TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {/* <h3 className="text-lg font-semibold text-blue-700 mb-3">
          All Charging Points
        </h3> */}
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border-b text-left">Station</th>
              <th className="p-3 border-b text-left">Code</th>
              <th className="p-3 border-b text-left">Connector Type</th>
              <th className="p-3 border-b text-left">Power (kW)</th>
              {/* <th className="p-3 border-b text-left">Status</th> */}
              <th className="p-3 border-b text-center">Change Status</th>
              <th className="p-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredChargers.length > 0 ? (
              filteredChargers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3">
                    {c.stationCode} : {c.stationName}
                  </td>
                  <td className="p-3">{c.code}</td>
                  <td className="p-3">{c.connectorType}</td>
                  <td className="p-3">{c.powerKw}</td>
                  {/* <td
                    className={`p-3 font-semibold ${
                      c.status === "Available"
                        ? "text-green-600"
                        : c.status === "Busy"
                        ? "text-blue-600"
                        : c.status === "Fault"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {c.status}
                  </td> */}
                  <td className="p-3 text-center">
  <button
    onClick={() => handleChangeStatus(c.id, c.status)}
    className={`text-white px-3 py-1 rounded w-28 transition-colors ${
      c.status === "available"
        ? "bg-green-600 hover:bg-green-700"
        : c.status === "busy"
        ? "bg-blue-600 hover:bg-blue-700"
        : c.status === "fault"
        ? "bg-yellow-500 hover:bg-yellow-600"
        : "bg-gray-600 hover:bg-gray-700"
    }`}
  >
    {c.status}
  </button>
</td>

                  {/* <td className="p-3 text-center">
                    <button
                      onClick={() => handleChangeStatus(c.id, c.status)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      {c.status}
                    </button>
                  </td> */}
                  <td className="p-3 text-center flex justify-center gap-3">
                    <FaEye
  onClick={() => handleViewCharger(c.id)}
  className="text-blue-600 cursor-pointer hover:text-blue-800"
  title="View"
/>

                    {/* <FaEdit
                      className="text-green-600 cursor-pointer hover:text-green-800"
                      title="Edit"
                    /> */}

                    <FaEdit
  onClick={() => handleEditCharger(c)}
  className="text-green-600 cursor-pointer hover:text-green-800"
  title="Edit"
/>

                    <FaTrash
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600 cursor-pointer hover:text-red-800"
                      title="Delete"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-4 italic"
                >
                  No charging points found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD CHARGER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Create New Charging Point
            </h3>

            <form onSubmit={handleAddCharger}>
              {/* Station Selector */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">
                  Select Station
                </label>
                <select
                  value={newCharger.stationId}
                  onChange={(e) =>
                    setNewCharger((prev) => ({
                      ...prev,
                      stationId: e.target.value,
                    }))
                  }
                  required
                  className="w-full border rounded p-2"
                >
                  <option value="">Select a station</option>
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} : {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Connector Type */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">
                  Connector Type
                </label>
                <input
                  type="text"
                  value={newCharger.connectorType}
                  onChange={(e) =>
                    setNewCharger((prev) => ({
                      ...prev,
                      connectorType: e.target.value,
                    }))
                  }
                  required
                  className="w-full border rounded p-2"
                  placeholder="e.g. CCS2"
                />
              </div>

              {/* Power */}
              <div className="mb-3">
                <label className="block text-gray-700 mb-1">Power (kW)</label>
                <input
                  type="number"
                  value={newCharger.powerKw}
                  onChange={(e) =>
                    setNewCharger((prev) => ({
                      ...prev,
                      powerKw: e.target.value,
                    }))
                  }
                  required
                  min="1"
                  className="w-full border rounded p-2"
                  placeholder="e.g. 50"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Fault">Fault</option>
              <option value="Offline">Offline</option>
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


      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-semibold text-red-600 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this charger?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* VIEW CHARGER MODAL */}
      {/* {showViewModal && selectedCharger && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              Charger Details
            </h3>

            <div className="space-y-2 text-gray-700">
              <p><strong>Code:</strong> {selectedCharger.code}</p>
              <p><strong>Connector Type:</strong> {selectedCharger.connectorType}</p>
              <p><strong>Power (kW):</strong> {selectedCharger.powerKw}</p>
              <p><strong>Status:</strong> {selectedCharger.status}</p>
              <p><strong>Station ID:</strong> {selectedCharger.stationId}</p>
              <p><strong>Created At:</strong> {new Date(selectedCharger.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(selectedCharger.updatedAt).toLocaleString()}</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}

      {showViewModal && selectedCharger && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative border border-gray-200">
      {/* Header */}
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

      {/* Charger Info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-800">
        <p className="font-semibold text-gray-600">Code:</p>
        <p>{selectedCharger.code}</p>

        <p className="font-semibold text-gray-600">Connector Type:</p>
        <p>{selectedCharger.connectorType}</p>

        <p className="font-semibold text-gray-600">Power (kW):</p>
        <p>{selectedCharger.powerKw}</p>

        <p className="font-semibold text-gray-600">Status:</p>
        <p
          className={`font-medium ${
            selectedCharger.status === "Available"
              ? "text-green-600"
              : selectedCharger.status === "Busy"
              ? "text-blue-600"
              : selectedCharger.status === "Fault"
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

      {/* Footer */}
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


{/* EDIT CHARGER MODAL */}
{showEditModal && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-blue-700 mb-4">
        ✏️ Edit Charger
      </h3>

      <form onSubmit={handleUpdateCharger} className="space-y-4">
        {/* Station ID */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Station ID
          </label>
          <input
            type="text"
            value={editCharger.stationId}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 text-gray-600"
          />
        </div>

        {/* Charger Code */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Code</label>
          <input
            type="text"
            value={editCharger.code}
            readOnly
            className="w-full border rounded p-2 bg-gray-100 text-gray-600"
          />
        </div>

        {/* Connector Type */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Connector Type
          </label>
          <input
            type="text"
            value={editCharger.connectorType}
            onChange={(e) =>
              setEditCharger((prev) => ({
                ...prev,
                connectorType: e.target.value,
              }))
            }
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Power (kW) */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Power (kW)
          </label>
          <input
            type="number"
            min="1"
            value={editCharger.powerKw}
            onChange={(e) =>
              setEditCharger((prev) => ({
                ...prev,
                powerKw: e.target.value,
              }))
            }
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">Status</label>
          <select
            value={editCharger.status}
            onChange={(e) =>
              setEditCharger((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
            className="w-full border rounded p-2"
          >
            <option value="Available">Available</option>
            <option value="Busy">Busy</option>
            <option value="Fault">Fault</option>
            <option value="Offline">Offline</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
)}


    </div>
  );
}
