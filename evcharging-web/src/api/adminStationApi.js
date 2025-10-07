// ====================================================
// ✅ adminStationApi.js — Back Office Station Management API
// ====================================================

import axios from "axios";

// ✅ Base URL (matches Swagger + backend route)
const API_URL = "http://localhost:5062/api/admin/stations";

// ✅ Auth header helper
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
  const response = await axios.post(API_URL, stationData, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Get All Stations (with optional search + pagination)
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
// 🔹 Update Station Details
// -----------------------------
export async function updateStation(id, updatedData) {
  const response = await axios.patch(`${API_URL}/${id}`, updatedData, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Update Station Status (activate/deactivate)
// -----------------------------
export async function updateStationStatus(id, status) {
  await axios.patch(`${API_URL}/${id}/status`, { status }, authHeader());
}

// -----------------------------
// 🔹 Delete Station
// -----------------------------
export async function deleteStation(id) {
  await axios.delete(`${API_URL}/${id}`, authHeader());
}
