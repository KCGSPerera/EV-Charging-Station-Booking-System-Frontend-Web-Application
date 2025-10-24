// ====================================================
// ✅ adminOperatorApi.js — Back Office Operator API
// ====================================================

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL; 

// ✅ Base URL (match with your Swagger setup)
const API_URL = `${BASE_URL}/admin/station-operators`;

// ✅ Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// -----------------------------
// 🔹 Create Operator
// -----------------------------
export async function createOperator(operatorData) {
  const response = await axios.post(API_URL, operatorData, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Get All Operators (with search + pagination)
// -----------------------------
export async function getAllOperators(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(API_URL, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get Operator by NIC
// -----------------------------
export async function getOperatorByNic(nic) {
  const response = await axios.get(`${API_URL}/${nic}`, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Search Operator by NIC
// -----------------------------
export async function searchOperatorByNic(nic) {
  const response = await axios.get(`${API_URL}/search`, {
    ...authHeader(),
    params: { nic },
  });
  return response.data;
}

// -----------------------------
// 🔹 Update Operator Status (active/inactive)
// -----------------------------
export async function updateOperatorStatus(nic, status) {
  await axios.patch(`${API_URL}/${nic}/status`, { status }, authHeader());
}

// -----------------------------
// 🔹 Update Operator Password (admin-only)
// -----------------------------
export async function updateOperatorPassword(nic, newPassword) {
  await axios.patch(`${API_URL}/${nic}/password`, { newPassword }, authHeader());
}

// -----------------------------
// 🔹 Delete Operator
// -----------------------------
export async function deleteOperator(nic) {
  await axios.delete(`${API_URL}/${nic}`, authHeader());
}
