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

// const API_BASE_URL = "http://localhost:5062/api/operators/time-slots";
const BASE_URL = import.meta.env.VITE_BASE_API_URL;
// const API_URL = `${BASE_URL}/time-slots`;
const API_BASE_URL = `${BASE_URL}/operators/time-slots`;


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
export async function getAllTimeSlots1() {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data;
}

export async function getAllTimeSlots(params = {}) {
  const {
    skip = 0,
    take = 50,
    stationId,
    chargerId,
    date,
    status,
  } = params;

  const config = {
    ...authHeader(),          // keeps Authorization header
    params: {
      skip,
      take,
    },
  };

  // only send filters when provided
  if (stationId) config.params.stationId = stationId;
  if (chargerId) config.params.chargerId = chargerId;
  if (date)      config.params.date = date;       // yyyy-MM-dd
  if (status && status !== "all") config.params.status = status;

  const response = await axios.get(API_BASE_URL, config);
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
