// ============================================================
// ✅ chargersApi.js — Charger Management API (2025)
// ============================================================
// PURPOSE:
//   • Handles CRUD operations for chargers under a station.
//   • Integrates with backend endpoints:
//       POST   /api/stations/{stationId}/chargers
//       GET    /api/stations/{stationId}/chargers
//       GET    /api/chargers/{id}
//       PATCH  /api/chargers/{id}
//       DELETE /api/chargers/{id}
//       PATCH  /api/chargers/{id}/status
// ============================================================

import axios from "axios";

// ✅ Backend base URL
const API_URL = "http://localhost:5062/api";

// ✅ Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// ============================================================
// 🔹 CREATE CHARGER — POST /api/stations/{stationId}/chargers
// ============================================================
export async function createCharger(stationId, chargerData) {
  try {
    const payload = {
      connectorType: chargerData.connectorType,
      powerKw: chargerData.powerKw,
    };
    const response = await axios.post(
      `${API_URL}/stations/${stationId}/chargers`,
      payload,
      authHeader()
    );
    return response.data; // Newly created charger object
  } catch (error) {
    console.error("❌ Error creating charger:", error);
    throw error;
  }
}

// ============================================================
// 🔹 GET ALL CHARGERS FOR A STATION — GET /api/stations/{stationId}/chargers
// ============================================================
export async function getChargersByStation(stationId) {
  try {
    const response = await axios.get(
      `${API_URL}/stations/${stationId}/chargers`,
      authHeader()
    );
    return response.data; // Array of chargers
  } catch (error) {
    console.error("❌ Error fetching chargers for station:", error);
    throw error;
  }
}

// ============================================================
// 🔹 GET SINGLE CHARGER BY ID — GET /api/chargers/{id}
// ============================================================
export async function getChargerById(chargerId) {
  try {
    const response = await axios.get(
      `${API_URL}/chargers/${chargerId}`,
      authHeader()
    );
    return response.data; // Single charger object
  } catch (error) {
    console.error("❌ Error fetching charger by ID:", error);
    throw error;
  }
}

// ============================================================
// 🔹 UPDATE CHARGER — PATCH /api/chargers/{id}
// ============================================================
export async function updateCharger(chargerId, chargerData) {
  try {
    const payload = {
      code: chargerData.code,
      connectorType: chargerData.connectorType,
      powerKw: chargerData.powerKw,
      status: chargerData.status,
    };
    const response = await axios.patch(
      `${API_URL}/chargers/${chargerId}`,
      payload,
      authHeader()
    );
    return response.data; // Updated charger object
  } catch (error) {
    console.error("❌ Error updating charger:", error);
    throw error;
  }
}

// ============================================================
// 🔹 DELETE CHARGER — DELETE /api/chargers/{id}
// ============================================================
export async function deleteCharger(chargerId) {
  try {
    const response = await axios.delete(
      `${API_URL}/chargers/${chargerId}`,
      authHeader()
    );
    return response.status === 204
      ? { message: "Charger deleted successfully" }
      : response.data;
  } catch (error) {
    console.error("❌ Error deleting charger:", error);
    throw error;
  }
}

// ============================================================
// 🔹 UPDATE CHARGER STATUS — PATCH /api/chargers/{id}/status
// ============================================================
export async function updateChargerStatus(chargerId, newStatus) {
  try {
    const payload = { status: newStatus };
    const response = await axios.patch(
      `${API_URL}/chargers/${chargerId}/status`,
      payload,
      authHeader()
    );
    return response.data; // Updated charger with new status
  } catch (error) {
    console.error("❌ Error updating charger status:", error);
    throw error;
  }
}
