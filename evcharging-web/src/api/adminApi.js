// src/api/adminApi.js
import axios from "axios";

const API_URL = "http://localhost:5062/api/Admins";

// ✅ Get all admins
export async function getAllAdmins() {
  const token = localStorage.getItem("token");
  const response = await axios.get(API_URL, {
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
  const response = await axios.put(`${API_URL}/${id}`, adminData, {
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
