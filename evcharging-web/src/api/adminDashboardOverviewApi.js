import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

// Base API URL (common for all admin endpoints)
const API_URL =  BASE_URL;

// Helper to attach Authorization header
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// -----------------------------
// 🔹 Get All Operators (with search + pagination)
// -----------------------------
export async function getAllOperators(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/admin/station-operators`, {
    ...authHeader(),
    params,
  });
  return response.data;
}

// -----------------------------
// 🔹 Get All EV Owners (Admin)
// -----------------------------
export async function getAllEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/admin/owners/all`, {
    ...authHeader(),
    params,
  });
  return response.data;
}

// -----------------------------
// 🔹 Get Pending EV Owners
// -----------------------------
export async function getPendingEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/admin/owners/pending`, {
    ...authHeader(),
    params,
  });
  return response.data;
}

// -----------------------------
// 🔹 Get All Stations
// -----------------------------
export async function getAllStations(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/stations`, {
    ...authHeader(),
    params,
  });
  return response.data;
}
