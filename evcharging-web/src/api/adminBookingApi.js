// ============================================================
// ✅ adminBookingApi.js — Back Office Booking Management (View Only)
// ============================================================

import axios from "axios";

const API_URL = "http://localhost:5062/api/bookings";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// 🔹 Get all bookings for a specific station
export async function getBookingsByStation(stationId) {
  const response = await axios.get(`${API_URL}?stationId=${stationId}`, authHeader());
  return response.data;
}

// 🔹 Get all pending bookings for a specific station
export async function getPendingBookingsByStation(stationId) {
  const response = await axios.get(`${API_URL}/pending?stationId=${stationId}`, authHeader());
  return response.data;
}

// 🔹 Get all pending bookings for today
export async function getPendingBookingsToday() {
  const response = await axios.get(`${API_URL}/pending/today`, authHeader());
  return response.data;
}

// 🔹 Get all pending bookings for today for a selected station
export async function getPendingBookingsTodayByStation(stationId) {
  const response = await axios.get(
    `${API_URL}/pending/today?stationId=${stationId}`,
    authHeader()
  );
  return response.data;
}
