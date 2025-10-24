// src/api/adminApi.js
import axios from "axios";

const API_URL = "http://localhost:5062/api/Admins";

// ✅ Get all admins
// export async function getAllAdmins() {
//   const token = localStorage.getItem("token");
//   const response = await axios.get(API_URL, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return response.data;
// }

export async function getAllAdmins(skip = 0, take = 50) {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:5062/api/admin/users", {
    params: { skip, take },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}


// ✅ Get a single admin by ID
export async function getAdminById(id) {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// ✅ Create a new admin
export async function createAdmin(adminData) {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// ✅ Update admin
export async function updateAdmin(id, adminData) {
  const token = localStorage.getItem("token");
  const response = await axios.patch(`${API_URL}/${id}`, adminData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
}

// ✅ Delete admin
export async function deleteAdmin(id) {
  const token = localStorage.getItem("token");
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// ✅ Disable an admin
export async function disableAdmin(id) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:5062/api/admin/users/${id}/disable`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

// ✅ Enable an admin
export async function enableAdmin(id) {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    `http://localhost:5062/api/admin/users/${id}/enable`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}
