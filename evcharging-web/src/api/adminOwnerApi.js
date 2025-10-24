// ====================================================
// ✅ adminOwnerApi.js — Back Office EV Owner Management API
// ====================================================

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL; 

// ✅ Base URL (as per backend controller)
const API_URL = `${BASE_URL}/admin/owners`;

// ✅ Auth header helper
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// -----------------------------
// 🔹 Get Pending EV Owners
// -----------------------------
export async function getPendingEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/pending`, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get Deactivated EV Owners
// -----------------------------
export async function getDeactivatedEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/deactivated`, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get EV Owner by NIC
// -----------------------------
export async function getEvOwnerByNic(nic) {
  const response = await axios.get(`${API_URL}/${nic}`, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Search EV Owner by NIC
// -----------------------------
export async function searchEvOwnerByNic(nic) {
  const response = await axios.get(`${API_URL}/search`, {
    ...authHeader(),
    params: { nic },
  });
  return response.data;
}

// -----------------------------
// 🔹 Activate EV Owner
// -----------------------------
export async function activateEvOwner(nic) {
  await axios.post(`${API_URL}/${nic}/activate`, {}, authHeader());
}

// -----------------------------
// 🔹 Deactivate EV Owner
// -----------------------------
export async function deactivateEvOwner(nic) {
  await axios.post(`${API_URL}/${nic}/deactivate`, {}, authHeader());
}

// -----------------------------
// 🔹 Reset EV Owner Password (admin only)
// -----------------------------
export async function resetEvOwnerPassword(nic, newPassword) {
  await axios.patch(`${API_URL}/${nic}/password`, { newPassword }, authHeader());
}

// -----------------------------
// 🔹 Get All EV Owners (Admin)
// -----------------------------
export async function getAllEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(`${API_URL}/all`, {
    ...authHeader(),
    params,
  });
  return response.data;
}


// -----------------------------
// 🔹 Create New EV Owner (Admin)
// -----------------------------
export async function createEvOwner(ownerData) {
  const response = await axios.post(
    `${BASE_URL}/owners/signup`,
    ownerData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
