import axios from "axios";

// ✅ Correct base URL based on Swagger
const API_URL = "http://localhost:5062/api/Auth";

export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // { token, email, role, userId }
}
