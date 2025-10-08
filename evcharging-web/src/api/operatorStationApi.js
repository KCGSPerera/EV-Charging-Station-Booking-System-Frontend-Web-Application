// ============================================================
// ✅ operatorStationApi.js — Station Operator API (2025)
// ============================================================
// PURPOSE:
//   • Handle Station Operator–specific endpoints.
//   • Fetch station details, charger list & summary assigned to
//     the currently logged-in operator.
//   • Backend endpoints used:
//       GET  /api/stations/my-stations
// ============================================================

import axios from "axios";

// Backend base URL (update when deployed)
const API_URL = "http://localhost:5062/api/stations";

// Common header for authorized requests
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// -----------------------------
// 🔹 Get Stations Assigned to Operator
// -----------------------------
export async function getMyStations() {
  try {
    const response = await axios.get(`${API_URL}/my-stations`, authHeader());
    return response.data; // Expected array of OperatorStationDto objects
  } catch (error) {
    console.error("❌ Error fetching operator stations:", error);
    throw error;
  }
}

// -----------------------------
// 🔹 (Optional) Get One Station by ID from Operator’s Assigned List
// -----------------------------
export async function getOperatorStationById(stationId) {
  try {
    const response = await axios.get(`${API_URL}/${stationId}`, authHeader());
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching operator station by ID:", error);
    throw error;
  }
}

// -----------------------------
// 🔹 (Optional) Update Station Details (for operator use)
// -----------------------------
export async function updateOperatorStation(stationId, updateData) {
  try {
    const payload = {
      name: updateData.name,
      address: updateData.address,
      type: updateData.type,
    };
    const response = await axios.patch(
      `${API_URL}/${stationId}`,
      payload,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error updating operator station:", error);
    throw error;
  }
}
