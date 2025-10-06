// ============================================================
// ✅ Owners.jsx — Back Office EV Owner Management (Final)
// ============================================================

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPendingEvOwners,
  getDeactivatedEvOwners,
  getEvOwnerByNic,
  activateEvOwner,
  deactivateEvOwner,
  resetEvOwnerPassword,
} from "../../api/adminOwnerApi";
import { FaSearch, FaSync, FaEye } from "react-icons/fa";

export default function Owners() {
  const [activeTab, setActiveTab] = useState("pending");
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchNic, setSearchNic] = useState("");
  const [viewOwner, setViewOwner] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  // -----------------------------
  // 🔹 Load Owners by Tab
  // -----------------------------
  const loadOwners = async () => {
    try {
      setLoading(true);
      let data = [];
      if (activeTab === "pending") data = await getPendingEvOwners();
      else if (activeTab === "deactivated") data = await getDeactivatedEvOwners();
      setOwners(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load owners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwners();
  }, [activeTab]);

  // -----------------------------
  // 🔹 Search by NIC
  // -----------------------------
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchNic.trim()) return toast.warning("Enter a NIC to search");

    try {
      setLoading(true);
      const result = await getEvOwnerByNic(searchNic.trim());
      setOwners([result]);
      setActiveTab("search");
    } catch (err) {
      toast.error(err.response?.data || "Owner not found");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // 🔹 Toggle Activation / Deactivation
  // -----------------------------
  const handleToggleStatus = async (owner) => {
    try {
      if (owner.status === "active") {
        await deactivateEvOwner(owner.nic);
        toast.info("Owner deactivated");
      } else {
        await activateEvOwner(owner.nic);
        toast.success("Owner activated");
      }
      loadOwners();
    } catch (err) {
      toast.error(err.response?.data || "Failed to update status");
    }
  };

  // -----------------------------
  // 🔹 View Owner Details
  // -----------------------------
  const handleView = async (nic) => {
    try {
      const owner = await getEvOwnerByNic(nic);
      setViewOwner(owner);
    } catch (err) {
      toast.error(err.response?.data || "Failed to load owner details");
    }
  };

  // -----------------------------
  // 🔹 Reset Password
  // -----------------------------
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await resetEvOwnerPassword(viewOwner.nic, newPassword);
      toast.success("Password reset successfully");
      setNewPassword("");
      setViewOwner(null);
    } catch (err) {
      toast.error(err.response?.data || "Failed to reset password");
    }
  };

  // -----------------------------
  // 🧩 UI
  // -----------------------------
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">EV Owner Management</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["pending", "deactivated"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "pending" ? "Pending Owners" : "Deactivated Owners"}
          </button>
        ))}
        <button
          onClick={loadOwners}
          className="ml-auto flex items-center gap-2 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
        >
          <FaSync /> Refresh
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by NIC..."
          value={searchNic}
          onChange={(e) => setSearchNic(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">NIC</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Toggle</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : owners.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No owners found.
                </td>
              </tr>
            ) : (
              owners.map((owner) => (
                <tr key={owner.nic} className="border-b hover:bg-gray-50">
                  <td className="p-3">{owner.nic}</td>
                  <td className="p-3">{owner.name}</td>
                  <td className="p-3">{owner.email}</td>
                  <td className="p-3">{owner.phone}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        owner.status === "active"
                          ? "bg-green-100 text-green-700"
                          : owner.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {owner.status.charAt(0).toUpperCase() +
                        owner.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={owner.status === "active"}
                        onChange={() => handleToggleStatus(owner)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleView(owner.nic)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Owner Modal */}
      {viewOwner && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-3">Owner Details</h2>
            <div className="space-y-2">
              <p><strong>NIC:</strong> {viewOwner.nic}</p>
              <p><strong>Name:</strong> {viewOwner.name}</p>
              <p><strong>Email:</strong> {viewOwner.email}</p>
              <p><strong>Phone:</strong> {viewOwner.phone}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    viewOwner.status === "active"
                      ? "bg-green-100 text-green-700"
                      : viewOwner.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {viewOwner.status}
                </span>
              </p>

              {viewOwner.vehicles?.length > 0 && (
                <div>
                  <strong>Vehicles:</strong>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {viewOwner.vehicles.map((v, i) => (
                      <li key={i}>
                        {v.make} {v.model} ({v.plate}) — {v.connectorType}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Password Reset */}
              <form onSubmit={handlePasswordReset} className="mt-4 space-y-2">
                <label className="block font-semibold text-sm">
                  Reset Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setViewOwner(null)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
