import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import {
  getAllAdmins,
  deleteAdmin,
  getAdminById,
  createAdmin,
  updateAdmin,
} from "../../api/adminApi";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Add/Edit Admin form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "BACKOFFICE",
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admins");
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    try {
      const data = await getAdminById(id);
      setSelectedAdmin(data);
      setShowViewModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch admin details");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteAdmin(id);
        toast.success("Admin deleted successfully");
        fetchAdmins();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete admin");
      }
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdmin(formData);
      toast.success("Admin created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", role: "BACKOFFICE" });
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create admin");
    }
  };

  const handleEdit = async (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email,
      password: "",
      role: admin.role || "BACKOFFICE",
    });
    setShowEditModal(true);
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    try {
      await updateAdmin(selectedAdmin.id, formData);
      toast.success("Admin updated successfully!");
      setShowEditModal(false);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update admin");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">🛡️ Backoffice Admins</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
          onClick={() => {
            setShowAddModal(true);
            setFormData({ name: "", email: "", password: "", role: "BACKOFFICE" });
          }}
        >
          <FaPlus /> Add Admin
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading admin list...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No admins found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{admin.email}</td>
                <td className="p-3">BACK OFFICE</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(admin.id)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() => handleEdit(admin)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(admin.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ View Modal */}
      {showViewModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => setShowViewModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Admin Details
            </h3>
            <p><b>Email:</b> {selectedAdmin.email}</p>
            <p><b>Role:</b> BACK OFFICE</p>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add Admin Modal */}
      {showAddModal && (
        <AdminModal
          title="Add New Admin"
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddAdmin}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* ✅ Edit Admin Modal */}
      {showEditModal && (
        <AdminModal
          title="Edit Admin"
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateAdmin}
          formData={formData}
          setFormData={setFormData}
          isEdit={true}
        />
      )}
    </div>
  );
}

/* ✅ Reusable Admin Modal Component */
function AdminModal({ title, onClose, onSubmit, formData, setFormData, isEdit }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-4 text-blue-700">{title}</h3>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block font-semibold">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-semibold">Role</label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="BACKOFFICE">Backoffice</option>
              <option value="STATIONOPERATOR">StationOperator</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {isEdit ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
