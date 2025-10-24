// -----------------------------
// 🔹 Get All Operators (with search + pagination)
// -----------------------------
export async function getAllOperators(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(API_URL, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get All EV Owners (Admin)
// -----------------------------
export async function getAllEvOwners(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get("http://localhost:5062/api/admin/owners/all", {
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
  const response = await axios.get(`${API_URL}/pending`, { ...authHeader(), params });
  return response.data;
}

// -----------------------------
// 🔹 Get All Stations
// -----------------------------
export async function getAllStations(q = "", skip = 0, take = 50) {
  const params = { q, skip, take };
  const response = await axios.get(API_URL, { ...authHeader(), params });
  return response.data;
}