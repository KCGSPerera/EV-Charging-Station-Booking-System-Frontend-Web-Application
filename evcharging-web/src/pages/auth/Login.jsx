import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });

      if (data && data.token) {
        login(data.token);

        // Normalize role
        const role = data.role?.toLowerCase();

        // ✅ Show success toast
        toast.success(`Welcome ${data.role}! Redirecting...`, {
          autoClose: 2500,
        });

        // Redirect after 2.5 seconds (to allow toast to show)
        setTimeout(() => {
          if (role === "backoffice") {
            navigate("/backoffice");
          } else if (role === "stationoperator") {
            navigate("/operator");
          } else {
            toast.warning("Unknown role, returning to login.");
            navigate("/login");
          }
        }, 2500);
      } else {
        setError("Login failed: No token returned from server.");
        toast.error("❌ Login failed: Invalid response.");
      }
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
      toast.error("❌ Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded p-6 w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          EV Charging System Login
        </h1>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
