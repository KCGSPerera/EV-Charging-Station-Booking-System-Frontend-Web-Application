// export default function StationProfile() {
//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>
//       <p className="text-gray-700">
//         This section will allow the station operator to view and update their
//         personal details, such as name, email, and contact information.
//       </p>
//     </div>
//   );
// }


/**
 * ============================================================
 * ✅ StationProfile.jsx — Station Operator Profile Page (2025)
 * ============================================================
 * PURPOSE:
 *   • Display logged-in operator’s profile information.
 *   • Allow password reset via modal popup.
 *
 * ENDPOINTS USED (from stationOperatorProfile.js):
 *   GET   /api/station-operators/me
 *   PATCH /api/station-operators/me/password
 *
 * DESIGN:
 *   - Blue theme consistent with operator dashboard.
 *   - Clean card layout for profile.
 *   - Modal popup for password reset.
 * ============================================================
 */

import { useEffect, useState } from "react";
import { getMyOperatorProfile, updateMyPassword } from "../../api/stationOperatorProfile";
import { toast } from "react-toastify";

export default function StationProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Password reset modal
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  // -----------------------------
  // 🔹 Fetch profile on page load
  // -----------------------------
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getMyOperatorProfile();
        setProfile(data);
      } catch (error) {
        toast.error("Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // -----------------------------
  // 🔹 Handle Password Reset
  // -----------------------------
  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      toast.warning("Please enter both fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setUpdating(true);
      await updateMyPassword(newPassword);
      toast.success("Password reset successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowModal(false);
    } catch (error) {
      toast.error("Failed to reset password.");
    } finally {
      setUpdating(false);
    }
  };

  // -----------------------------
  // 🔹 Loading State
  // -----------------------------
  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">My Profile</h2>
        <p className="text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  // -----------------------------
  // 🔹 Profile Display
  // -----------------------------
  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">My Profile</h2>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-2xl border border-gray-100">
        <h3 className="text-lg font-semibold text-blue-700 mb-4">Personal Information</h3>
        <div className="space-y-2 text-gray-700">
          <p><strong>Name:</strong> {profile?.name || "N/A"}</p>
          <p><strong>NIC:</strong> {profile?.nic || "N/A"}</p>
          <p><strong>Email:</strong> {profile?.email || "N/A"}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`${
                profile?.status === "Active"
                  ? "text-green-600 font-medium"
                  : "text-red-600 font-medium"
              }`}
            >
              {profile?.status || "Unknown"}
            </span>
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {profile?.createdAt
              ? new Date(profile.createdAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Reset Password Button */}
        <div className="mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-lg transition"
          >
            Reset Password
          </button>
        </div>
      </div>

      {/* ============================================================
          🔹 Password Reset Modal
          ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h3 className="text-xl font-bold text-blue-700 mb-4">Reset Password</h3>

            <div className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Enter new password"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 text-gray-800 font-medium"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={updating}
                className={`px-4 py-2 rounded-lg font-medium text-white ${
                  updating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {updating ? "Resetting..." : "Confirm Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
