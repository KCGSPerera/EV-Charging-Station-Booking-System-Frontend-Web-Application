// ============================================================
// ✅ adminStationApi.js — Station Management API (Updated)
// ============================================================

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const API_URL = `${BASE_URL}/stations`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// -----------------------------
// 🔹 Create Station
// -----------------------------
export async function createStation(stationData) {
  // ✅ Build correct payload
  const payload = {
    name: stationData.name,
    operatorNic: stationData.operatorNic,
    type: stationData.type,
    google: {
      placeId: stationData.google?.placeId || "",
      lat: stationData.google?.lat || stationData.location?.latitude || 0,
      lng: stationData.google?.lng || stationData.location?.longitude || 0,
      address: stationData.google?.address || "Manual selection",
    },
  };

  const response = await axios.post(API_URL, payload, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Get All Stations
// -----------------------------
export async function getAllStations(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(API_URL, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get Station by ID
// -----------------------------
export async function getStationById(id) {
  const response = await axios.get(`${API_URL}/${id}`, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Update Station
// -----------------------------
export async function updateStation(id, stationData) {
  const payload = {
    name: stationData.name,
    operatorNic: stationData.operatorNic,
    type: stationData.type,
    google: {
      placeId: stationData.google?.placeId || "",
      lat: stationData.google?.lat || stationData.location?.latitude || 0,
      lng: stationData.google?.lng || stationData.location?.longitude || 0,
      address: stationData.google?.address || "Manual update",
    },
  };
  const response = await axios.patch(`${API_URL}/${id}`, payload, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Activate / Deactivate
// -----------------------------
export async function activateStation(id) {
  await axios.post(`${API_URL}/${id}/activate`, {}, authHeader());
}
export async function deactivateStation(id) {
  await axios.post(`${API_URL}/${id}/deactivate`, {}, authHeader());
}

// -----------------------------
// 🔹 Delete Station
// -----------------------------
export async function deleteStation(id) {
  await axios.delete(`${API_URL}/${id}`, authHeader());
}
