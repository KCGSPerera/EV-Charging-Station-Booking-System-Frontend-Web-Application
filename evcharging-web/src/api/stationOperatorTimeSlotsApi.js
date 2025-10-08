// ============================================================
// ✅ stationOperatorTimeSlotsApi.js — Operator Time Slot APIs
// ============================================================
//
// PURPOSE:
//   • Manage station operator time slots (create, view, cancel)
//   • Endpoints:
//       POST   /api/operators/time-slots
//       GET    /api/operators/time-slots
//       PATCH  /api/operators/time-slots/{id}/cancel
// ============================================================

import axios from "axios";

const API_BASE_URL = "http://localhost:5062/api/operators/time-slots";

// -----------------------------
// 🔹 Helper: Auth header
// -----------------------------
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// -----------------------------
// 🔹 Create Time Slots
// -----------------------------
// Request body:
// {
//   "stationId": "string",
//   "chargerId": "string",
//   "date": "string",
//   "startTime": "string",
//   "endTime": "string",
//   "isForWeek": true
// }
export async function createTimeSlots(timeSlotData) {
  const response = await axios.post(API_BASE_URL, timeSlotData, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Get All Time Slots
// -----------------------------
// Response: Array of time slot objects
export async function getAllTimeSlots() {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data;
}

// -----------------------------
// 🔹 Cancel a Time Slot
// -----------------------------
// PATCH /api/operators/time-slots/{id}/cancel
// Request body: { "reason": "string" }
export async function cancelTimeSlot(id, reason) {
  const payload = { reason };
  const response = await axios.patch(
    `${API_BASE_URL}/${id}/cancel`,
    payload,
    authHeader()
  );
  return response.data;
}
