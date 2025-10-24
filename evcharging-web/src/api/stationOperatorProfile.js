/**
 * ============================================================
 * ✅ stationOperatorProfile.js — Station Operator Profile API (2025)
 * ============================================================
 * PURPOSE:
 *   • Manage profile details of the currently logged-in Station Operator.
 *   • Integrate with backend endpoints for:
 *       GET   /api/station-operators/me
 *       PATCH /api/station-operators/me/password
 *       PATCH /api/station-operators/{nic}/password
 *
 * DEPENDENCIES:
 *   - axios
 *   - Local Storage (token)
 * ============================================================
 */

import axios from "axios";

// Base API URL (update when deployed)
// const API_URL = "http://localhost:5062/api/station-operators";
const BASE_URL = import.meta.env.VITE_BASE_API_URL;
const API_URL = `${BASE_URL}/station-operators`;

// Common header for authenticated requests
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// ============================================================
// 🔹 Get Logged-in Station Operator Profile
// Endpoint: GET /api/station-operators/me
// ============================================================
export async function getMyOperatorProfile() {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      ...authHeader(),
      responseType: "text", // because backend returns "text/plain"
    });

    // If backend sends text/plain JSON string → parse it
    const data =
      typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

    return data;
  } catch (error) {
    console.error("❌ Error fetching operator profile:", error);
    throw error;
  }
}

// ============================================================
// 🔹 Update Own Password
// Endpoint: PATCH /api/station-operators/me/password
// ============================================================
export async function updateMyPassword(newPassword) {
  try {
    const payload = { newPassword };
    const response = await axios.patch(
      `${API_URL}/me/password`,
      payload,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error updating password:", error);
    throw error;
  }
}

// ============================================================
// 🔹 Admin: Reset Password by NIC
// Endpoint: PATCH /api/station-operators/{nic}/password
// ============================================================
export async function resetPasswordByNic(nic, newPassword) {
  try {
    const payload = { newPassword };
    const response = await axios.patch(
      `${API_URL}/${nic}/password`,
      payload,
      authHeader()
    );
    return response.data;
  } catch (error) {
    console.error(`❌ Error resetting password for NIC ${nic}:`, error);
    throw error;
  }
}
