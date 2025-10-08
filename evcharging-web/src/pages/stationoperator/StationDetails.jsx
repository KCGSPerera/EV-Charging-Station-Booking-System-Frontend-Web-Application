// export default function StationDetails() {
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">
//         Station Details
//       </h2>
//       <p className="text-gray-700">
//         This section will show the assigned station’s information and allow the operator to update slot availability or schedules.
//       </p>
//     </div>
//   );
// }

/**
 * ============================================================
 * ✅ StationDetails.jsx — EV Charging System (2025)
 * ============================================================
 * PURPOSE:
 *   • Fetch and display the operator’s assigned stations via:
 *        GET /api/stations/my-stations
 *   • Show station overview, charger summary, and allow updates.
 *   • Update via:
 *        PATCH /api/stations/{id}
 * ============================================================
 */

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  getMyStations,
  updateOperatorStation,
} from "../../api/operatorStationApi";

export default function StationDetails() {
  const { user } = useAuth(); // ✅ get user and token
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    address: "",
    type: "",
    status: "",
  });

  // ---------------- FETCH STATION DETAILS ----------------
  const fetchStation = async () => {
    try {
      setLoading(true);

      if (!user || !user.token) {
        toast.error("⚠️ Session expired. Please log in again.");
        return;
      }

      const data = await getMyStations(); // ✅ API call via operatorStationApi.js

      if (!Array.isArray(data) || data.length === 0) {
        toast.info("ℹ️ No stations assigned to your account.");
        setStation(null);
        return;
      }

      const stationData = data[0]; // Assume operator has one station
      setStation(stationData);
      setFormData({
        id: stationData.id,
        code: stationData.code,
        name: stationData.name,
        address: stationData.address,
        type: stationData.type,
        status: stationData.status,
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Unable to fetch station details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- HANDLE INPUT CHANGES ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------------- SAVE CHANGES ----------------
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await updateOperatorStation(formData.id, formData); // ✅ API call via helper
      toast.success("✅ Station details updated successfully!");
      fetchStation();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update station details.");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- UI RENDER ----------------
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Loading station details...</p>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>No station assigned to this operator.</p>
      </div>
    );
  }

  // Extract charger summary safely
  const summary = station.chargerSummary || {
    available: 0,
    busy: 0,
    fault: 0,
    offline: 0,
    total: 0,
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Station Details
      </h2>

      {/* -------- Station Overview -------- */}
      <div className="bg-white p-6 rounded shadow max-w-3xl mb-8">
        <form onSubmit={handleSave}>
          {/* Station Code */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Station Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Station Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Station Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          {/* Type */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Station Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            >
              <option value="">Select Type</option>
              <option value="AC">AC</option>
              <option value="DC">DC</option>
            </select>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Status
            </label>
            <input
              type="text"
              value={formData.status || "ACTIVE"}
              readOnly
              className="w-full border rounded p-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isSaving}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors ${
              isSaving ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* -------- Charger Summary -------- */}
      <div className="bg-gray-50 p-4 rounded shadow max-w-3xl mb-8">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Charger Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div className="bg-green-100 p-3 rounded shadow">
            <h4 className="text-green-700 font-bold">Available</h4>
            <p className="text-2xl font-semibold">{summary.available}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded shadow">
            <h4 className="text-blue-700 font-bold">Busy</h4>
            <p className="text-2xl font-semibold">{summary.busy}</p>
          </div>
          <div className="bg-yellow-100 p-3 rounded shadow">
            <h4 className="text-yellow-700 font-bold">Fault</h4>
            <p className="text-2xl font-semibold">{summary.fault}</p>
          </div>
          <div className="bg-gray-200 p-3 rounded shadow">
            <h4 className="text-gray-700 font-bold">Offline</h4>
            <p className="text-2xl font-semibold">{summary.offline}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded shadow">
            <h4 className="text-purple-700 font-bold">Total</h4>
            <p className="text-2xl font-semibold">{summary.total}</p>
          </div>
        </div>
      </div>

      {/* -------- Charger List -------- */}
      <div className="bg-white p-6 rounded shadow max-w-4xl">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Chargers
        </h3>
        {station.chargers && station.chargers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-700">
                  <th className="p-3 border-b">Code</th>
                  <th className="p-3 border-b">Connector Type</th>
                  <th className="p-3 border-b">Power (kW)</th>
                  <th className="p-3 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {station.chargers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 border-b">
                    <td className="p-3">{c.code}</td>
                    <td className="p-3">{c.connectorType}</td>
                    <td className="p-3">{c.powerKw}</td>
                    <td
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No chargers found.</p>
        )}
      </div>
    </div>
  );
}
