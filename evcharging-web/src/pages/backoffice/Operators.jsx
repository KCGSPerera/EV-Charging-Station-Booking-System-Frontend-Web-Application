// ============================================================
// ✅ Operator.jsx — Back Office Operator Management (Enhanced)
// ============================================================

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllOperators,
  createOperator,
  updateOperatorStatus,
  deleteOperator,
  updateOperatorPassword,
  getOperatorByNic,
} from "../../api/adminOperatorApi";
import { FaPlus, FaTrash, FaEye } from "react-icons/fa";

export default function Operator() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const [formData, setFormData] = useState({
    nic: "",
    name: "",
    email: "",
    password: "",
  });

  // -----------------------------
  // 🔹 Fetch Operators
  // -----------------------------
  const loadOperators = async (query = "") => {
    try {
      setLoading(true);
      const data = await getAllOperators(query);
      setOperators(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load operators");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOperators();
  }, []);

  // -----------------------------
  // 🔹 Live Search (on typing)
  // -----------------------------
  useEffect(() => {
    const delay = setTimeout(() => {
      loadOperators(search);
    }, 400);
    return () => clearTimeout(delay);
  }, [search]);

  // -----------------------------
  // 🔹 Handle Add Operator
  // -----------------------------
  const handleAddOperator = async (e) => {
    e.preventDefault();
    try {
      await createOperator(formData);
      toast.success("Operator created successfully");
      setShowAddModal(false);
      setFormData({ nic: "", name: "", email: "", password: "" });
      loadOperators();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create operator");
    }
  };

  // -----------------------------
  // 🔹 Handle Delete Operator
  // -----------------------------
  const handleDelete = async (nic) => {
    if (!window.confirm("Are you sure you want to delete this operator?")) return;
    try {
      await deleteOperator(nic);
      toast.success("Operator deleted");
      loadOperators();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete operator");
    }
  };

  // -----------------------------
  // 🔹 Handle Status Toggle
  // -----------------------------
  const handleToggleStatus = async (op) => {
    const newStatus = op.status === "active" ? "inactive" : "active";
    try {
      await updateOperatorStatus(op.nic, newStatus);
      toast.success(`Operator ${newStatus === "active" ? "activated" : "deactivated"}`);
      loadOperators();
    } catch (err) {
      toast.error(err.response?.data || "Failed to update status");
    }
  };

  // -----------------------------
  // 🔹 View Operator Details
  // -----------------------------
  const handleView = async (nic) => {
    try {
      const op = await getOperatorByNic(nic);
      setSelectedOperator(op);
      setShowViewModal(true);
    } catch (err) {
      toast.error(err.response?.data || "Failed to fetch details");
    }
  };

  // -----------------------------
  // 🔹 Handle Password Update
  // -----------------------------
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateOperatorPassword(selectedOperator.nic, newPassword);
      toast.success("Password updated successfully");
      setNewPassword("");
      setShowViewModal(false);
    } catch (err) {
      toast.error(err.response?.data || "Failed to update password");
    }
  };

  // -----------------------------
  // 🧩 UI
  // -----------------------------
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Station Operator Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Operator
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by NIC, Name, or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">NIC</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : operators.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6">
                  No operators found.
                </td>
              </tr>
            ) : (
              operators.map((op) => (
                <tr key={op.nic} className="border-b hover:bg-gray-50">
                  <td className="p-3">{op.nic}</td>
                  <td className="p-3">{op.name}</td>
                  <td className="p-3">{op.email}</td>
                  <td className="p-3">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={op.status === "active"}
                        onChange={() => handleToggleStatus(op)}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                  </td>
                  <td className="p-3 flex justify-center gap-3">
                    <button
                      onClick={() => handleView(op.nic)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(op.nic)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Operator Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Operator</h2>
            <form onSubmit={handleAddOperator} className="space-y-3">
              <input
                type="text"
                placeholder="NIC"
                value={formData.nic}
                onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border rounded px-3 py-2 w-full"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View / Edit Modal */}
      {showViewModal && selectedOperator && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Operator Details</h2>

            <div className="space-y-2">
              <p><strong>NIC:</strong> {selectedOperator.nic}</p>
              <p><strong>Name:</strong> {selectedOperator.name}</p>
              <p><strong>Email:</strong> {selectedOperator.email}</p>
              <div className="flex items-center gap-3">
                <strong>Status:</strong>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOperator.status === "active"}
                    onChange={() => handleToggleStatus(selectedOperator)}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Password Reset */}
              <form onSubmit={handlePasswordUpdate} className="mt-4">
                <label className="block mb-1 font-semibold">Change Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border rounded px-3 py-2 w-full"
                  required
                />
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowViewModal(false)}
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
