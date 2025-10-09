// ============================================================
// ✅ stationOperatorReservations.js — Station Operator Reservations API (2025)
// ============================================================
// PURPOSE:
//   • Manage reservations related to stations assigned to operators.
//   • Includes viewing, approving, regenerating QR codes, and scanning reservations.
//   • Backend endpoints used:
//       GET  /api/operators/stations/{stationId}/reservations
//       POST /api/operators/reservations/{id}/approve
//       POST /api/operators/reservations/{id}/regenerate-qr
//       POST /api/operators/scan-reservation
//       GET  /api/operators/my-reservations
// ============================================================

import axios from "axios";

// -----------------------------
// 🔹 Base URL
// -----------------------------
const API_URL = "http://localhost:5062/api/operators";

// -----------------------------
// 🔹 Common Authorization Header
// -----------------------------
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

// ============================================================
// 🔸 1. Get Reservations for a Specific Station
// ============================================================
// ✅ Endpoint: GET /api/operators/stations/{stationId}/reservations
// Optional Query Params: status, date, skip, take
// ============================================================
export async function getStationReservations(stationId, filters = {}) {
  try {
    const params = {
      status: filters.status || "",
      date: filters.date || "",
      skip: filters.skip || 0,
      take: filters.take || 50,
    };

    const response = await axios.get(
      `${API_URL}/stations/${stationId}/reservations`,
      {
        ...authHeader(),
        params,
        responseType: "text", // backend sends text/plain
      }
    );

    // Parse text/plain JSON safely
    return JSON.parse(response.data);
  } catch (error) {
    console.error("❌ Error fetching station reservations:", error);
    throw error;
  }
}

// ============================================================
// 🔸 2. Approve a Reservation by ID
// ============================================================
// ✅ Endpoint: POST /api/operators/reservations/{id}/approve
// ============================================================
export async function approveReservation(reservationId) {
  try {
    const response = await axios.post(
      `${API_URL}/reservations/${reservationId}/approve`,
      {},
      {
        ...authHeader(),
        responseType: "text",
      }
    );

    return JSON.parse(response.data);
  } catch (error) {
    console.error("❌ Error approving reservation:", error);
    throw error;
  }
}

// ============================================================
// 🔸 3. Regenerate QR Code for a Reservation
// ============================================================
// ✅ Endpoint: POST /api/operators/reservations/{id}/regenerate-qr
// ============================================================
export async function regenerateReservationQr(reservationId) {
  try {
    const response = await axios.post(
      `${API_URL}/reservations/${reservationId}/regenerate-qr`,
      {},
      {
        ...authHeader(),
        responseType: "text",
      }
    );

    return JSON.parse(response.data);
  } catch (error) {
    console.error("❌ Error regenerating QR code:", error);
    throw error;
  }
}

// ============================================================
// 🔸 4. Scan Reservation (QR-based)
// ============================================================
// ✅ Endpoint: POST /api/operators/scan-reservation
// Request Body: { "json": "string" }
// ============================================================
export async function scanReservation(qrJson) {
  try {
    const response = await axios.post(
      `${API_URL}/scan-reservation`,
      { json: qrJson },
      {
        ...authHeader(),
        responseType: "text",
      }
    );

    return JSON.parse(response.data);
  } catch (error) {
    console.error("❌ Error scanning reservation:", error);
    throw error;
  }
}

// ============================================================
// 🔸 5. Get All Reservations of Logged-In Operator
// ============================================================
// ✅ Endpoint: GET /api/operators/my-reservations
// Optional Query Params: status, date, skip, take
// ============================================================
export async function getMyReservations(filters = {}) {
  try {
    const params = {
      status: filters.status || "",
      date: filters.date || "",
      skip: filters.skip || 0,
      take: filters.take || 50,
    };

    const response = await axios.get(`${API_URL}/my-reservations`, {
      ...authHeader(),
      params,
      responseType: "text",
    });

    return JSON.parse(response.data);
  } catch (error) {
    console.error("❌ Error fetching operator reservations:", error);
    throw error;
  }
}
