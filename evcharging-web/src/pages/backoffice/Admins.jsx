import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { getAllAdmins, deleteAdmin, getAdminById } from "../../api/adminApi";

export default function Admins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(true);
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-700">🛡️ Backoffice Admins</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <FaPlus /> Add Admin
        </button>
      </div>

      {loading ? (
        <p>Loading admin list...</p>
      ) : admins.length === 0 ? (
        <p className="text-gray-500">No admins found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded shadow">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Role</th>
              <th className="text-center p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{admin.name || "—"}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3">{admin.role}</td>
                <td className="p-3 flex justify-center gap-3">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleView(admin.id)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800"
                    onClick={() =>
                      toast.info("Edit admin functionality coming soon!")
                    }
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

      {/* ✅ Modal for Viewing One Admin */}
      {showModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-black text-lg"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Admin Details
            </h3>
            <p>
              <b>Name:</b> {selectedAdmin.name || "—"}
            </p>
            <p>
              <b>Email:</b> {selectedAdmin.email}
            </p>
            <p>
              <b>Role:</b> {selectedAdmin.role}
            </p>
            <p>
              <b>Created On:</b>{" "}
              {new Date(selectedAdmin.createdAt).toLocaleDateString() || "—"}
            </p>
            <div className="mt-4 text-right">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
