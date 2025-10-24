import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL;

// ✅ Correct base URL based on Swagger
const API_URL = `${BASE_URL}/Auth`;

export async function loginUser(credentials) {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data; // { token, email, role, userId }
}
