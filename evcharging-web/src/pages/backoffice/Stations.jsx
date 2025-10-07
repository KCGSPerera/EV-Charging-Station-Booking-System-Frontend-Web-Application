// ============================================================
// ✅ Stations.jsx — Back Office Station Management (Final Responsive)
// ============================================================

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";
import {
  getAllStations,
  createStation,
  updateStation,
  activateStation,
  deactivateStation,
  deleteStation,
  getStationById,
} from "../../api/adminStationApi";
import { getAllOperators } from "../../api/adminOperatorApi";
import { GoogleMap, Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../components/GoogleMapsProvider";

const mapContainerStyle = { width: "100%", height: "400px" };

export default function Stations() {
  const { isLoaded } = useGoogleMaps();
  const [stations, setStations] = useState([]);
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);

  const [mapCenter, setMapCenter] = useState({ lat: 7.8731, lng: 80.7718 });
  const [mapRef, setMapRef] = useState(null);
  const markerRef = useRef(null);
  const autocompleteRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "AC",
    availableSlots: 0,
    operatorNic: "",
    google: { placeId: "", lat: 0, lng: 0, address: "Manual selection" },
    location: { latitude: 0, longitude: 0 },
  });

  // ============================================================
  // 🔹 Load Stations & Operators
  // ============================================================
  const loadStations = async () => {
    try {
      setLoading(true);
      const data = await getAllStations(search);
      setStations(data);
    } catch {
      toast.error("Failed to load stations");
    } finally {
      setLoading(false);
    }
  };

  const loadOperators = async () => {
    try {
      const data = await getAllOperators();
      setOperators(data);
    } catch {
      toast.error("Failed to load operators");
    }
  };

  useEffect(() => {
    loadStations();
    loadOperators();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => loadStations(), 400);
    return () => clearTimeout(t);
  }, [search]);

  // ============================================================
  // 🔹 Map Marker Logic
  // ============================================================
  const placeMarker = (map, lat, lng) => {
    if (!window.google || !map) return;

    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng });
      return;
    }

    markerRef.current = new window.google.maps.Marker({
      map,
      position: { lat, lng },
      draggable: true,
    });

    markerRef.current.addListener("dragend", (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setFormData((prev) => ({
        ...prev,
        google: { ...prev.google, lat: newLat, lng: newLng },
        location: { latitude: newLat, longitude: newLng },
      }));
      setMapCenter({ lat: newLat, lng: newLng });
    });
  };

  const handleMapClick = useCallback(
    (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setFormData((prev) => ({
        ...prev,
        google: { ...prev.google, lat, lng },
        location: { latitude: lat, longitude: lng },
      }));
      setMapCenter({ lat, lng });
      placeMarker(mapRef, lat, lng);
    },
    [mapRef]
  );

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry) {
      toast.warn("No details available for that place.");
      return;
    }
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || place.name || "Unnamed location";
    const placeId = place.place_id || "";

    setFormData((prev) => ({
      ...prev,
      google: { placeId, lat, lng, address },
      location: { latitude: lat, longitude: lng },
    }));

    setMapCenter({ lat, lng });
    if (mapRef) {
      mapRef.panTo({ lat, lng });
      mapRef.setZoom(15);
      placeMarker(mapRef, lat, lng);
    }
  };

  // ============================================================
  // 🔹 CRUD + Status + View
  // ============================================================
  const handleAddStation = async (e) => {
    e.preventDefault();
    try {
      await createStation(formData);
      toast.success("Station created successfully");
      setShowAddModal(false);
      resetForm();
      loadStations();
    } catch (err) {
      toast.error(err.response?.data || "Failed to create station");
    }
  };

  const handleEdit = async (id) => {
    try {
      const station = await getStationById(id);
      setSelectedStation(station);
      setFormData({
        name: station.name,
        type: station.type,
        availableSlots: station.availableSlots,
        operatorNic: station.operatorNic || "",
        google: {
          placeId: station.google?.placeId || "",
          lat: station.google?.lat || station.location?.latitude || 0,
          lng: station.google?.lng || station.location?.longitude || 0,
          address: station.google?.address || station.address || "Manual edit",
        },
        location: {
          latitude: station.location?.latitude || 0,
          longitude: station.location?.longitude || 0,
        },
      });
      setMapCenter({
        lat: station.location?.latitude || 7.8731,
        lng: station.location?.longitude || 80.7718,
      });
      setShowEditModal(true);
    } catch {
      toast.error("Failed to load station details");
    }
  };

  const handleView = async (id) => {
    try {
      const station = await getStationById(id);
      setSelectedStation(station);
      setShowViewModal(true);
    } catch {
      toast.error("Failed to load station details");
    }
  };

  const handleUpdateStation = async (e) => {
    e.preventDefault();
    try {
      await updateStation(selectedStation.id, formData);
      toast.success("Station updated successfully");
      setShowEditModal(false);
      setSelectedStation(null);
      loadStations();
    } catch (err) {
      toast.error(err.response?.data || "Failed to update station");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this station?")) return;
    try {
      await deleteStation(id);
      toast.success("Station deleted");
      loadStations();
    } catch (err) {
      toast.error(err.response?.data || "Failed to delete station");
    }
  };

  const handleToggleStatus = async (station) => {
    try {
      if (station.status === "active") {
        await deactivateStation(station.id);
        toast.info("Station deactivated");
      } else {
        await activateStation(station.id);
        toast.success("Station activated");
      }
      loadStations();
    } catch (err) {
      toast.error(err.response?.data || "Failed to update status");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "AC",
      availableSlots: 0,
      operatorNic: "",
      google: { placeId: "", lat: 0, lng: 0, address: "Manual selection" },
      location: { latitude: 0, longitude: 0 },
    });
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  // ============================================================
  // 🧩 UI
  // ============================================================
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Charging Station Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaPlus /> Add Station
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 w-full sm:w-auto flex-grow"
        />
        <button
          onClick={() => loadStations()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaSearch /> Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-left">Operator</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Toggle</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-6">Loading...</td></tr>
            ) : stations.length === 0 ? (
              <tr><td colSpan="7" className="text-center py-6">No stations found.</td></tr>
            ) : (
              stations.map((s) => {
                const operator = operators.find((op) => op.nic === s.operatorNic);
                return (
                  <tr key={s.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.address || s.google?.address || "—"}</td>
                    <td className="p-3">{operator ? operator.name : "—"}</td>
                    <td className="p-3">{s.type}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        s.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={s.status === "active"}
                          onChange={() => handleToggleStatus(s)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <button onClick={() => handleView(s.id)} className="text-gray-700 hover:text-gray-900" title="View"><FaEye /></button>
                      <button onClick={() => handleEdit(s.id)} className="text-blue-600 hover:text-blue-800" title="Edit"><FaEdit /></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-800" title="Delete"><FaTrash /></button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isLoaded && (showAddModal || (showEditModal && selectedStation)) && (
        <StationModal
          title={showAddModal ? "Add New Station" : "Edit Station"}
          onClose={() => {
            setShowAddModal(false);
            setShowEditModal(false);
            markerRef.current?.setMap(null);
            markerRef.current = null;
          }}
          onSubmit={showAddModal ? handleAddStation : handleUpdateStation}
          formData={formData}
          setFormData={setFormData}
          operators={operators}
          mapCenter={mapCenter}
          handleMapClick={handleMapClick}
          handlePlaceChanged={handlePlaceChanged}
          autocompleteRef={autocompleteRef}
          mapRef={mapRef}
          setMapRef={setMapRef}
          placeMarker={placeMarker}
        />
      )}

      {showViewModal && selectedStation && (
        <ViewStationModal
          station={selectedStation}
          onClose={() => {
            setShowViewModal(false);
            setSelectedStation(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================
// ✅ StationModal (Add/Edit)
// ============================================================
function StationModal({
  title,
  onClose,
  onSubmit,
  formData,
  setFormData,
  operators,
  mapCenter,
  handleMapClick,
  handlePlaceChanged,
  autocompleteRef,
  mapRef,
  setMapRef,
  placeMarker,
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block font-medium">Station Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border rounded px-3 py-2 w-full"
            required
          />

          <label className="block font-medium">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="AC">AC</option>
            <option value="DC">DC</option>
            <option value="MIX">MIX</option>
          </select>

          <label className="block font-medium">Available Slots</label>
          <input
            type="number"
            value={formData.availableSlots}
            onChange={(e) =>
              setFormData({ ...formData, availableSlots: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
            required
          />

          <label className="block font-medium">Assign Operator</label>
          <select
            value={formData.operatorNic}
            onChange={(e) =>
              setFormData({ ...formData, operatorNic: e.target.value })
            }
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">-- Select Operator --</option>
            {operators.map((op) => (
              <option key={op.nic} value={op.nic}>
                {op.name} ({op.email})
              </option>
            ))}
          </select>

          <label className="block font-medium mb-2">
            <FaMapMarkerAlt className="inline mr-2" />
            Search or Click on Map
          </label>
          <Autocomplete
            onLoad={(ac) => (autocompleteRef.current = ac)}
            onPlaceChanged={handlePlaceChanged}
          >
            <input
              type="text"
              placeholder="Search for a place..."
              className="border rounded px-3 py-2 w-full mb-3"
            />
          </Autocomplete>

          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={8}
            onLoad={(map) => {
              setMapRef(map);
              if (formData.location.latitude && formData.location.longitude) {
                placeMarker(map, formData.location.latitude, formData.location.longitude);
              }
            }}
            onClick={handleMapClick}
          />

          <p className="text-sm text-gray-600 mt-2">
            Lat: {formData.location.latitude.toFixed(5)} | Lng:{" "}
            {formData.location.longitude.toFixed(5)}
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}

// ============================================================
// ✅ ViewStationModal (Responsive + Readonly Map)
// ============================================================
function ViewStationModal({ station, onClose }) {
  const center = {
    lat: station.location?.latitude || 7.8731,
    lng: station.location?.longitude || 80.7718,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-y-auto">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-5xl mx-3 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 text-center sm:text-left">
          Station Details
        </h2>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4 text-gray-800 mb-6 text-sm sm:text-base">
          <p><strong>ID:</strong> {station.id}</p>
          <p><strong>Code:</strong> {station.code || "—"}</p>
          <p><strong>Name:</strong> {station.name}</p>
          <p><strong>Operator NIC:</strong> {station.operatorNic || "—"}</p>
          <p><strong>Address:</strong> {station.address || "—"}</p>
          <p><strong>Type:</strong> {station.type}</p>
          <p><strong>Status:</strong> {station.status}</p>
          <p><strong>Created:</strong> {new Date(station.createdAt).toLocaleString()}</p>
          <p><strong>Updated:</strong> {new Date(station.updatedAt).toLocaleString()}</p>
        </div>

        {/* Map */}
        <div className="rounded-lg overflow-hidden mb-6 border">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "300px" }}
            center={center}
            zoom={13}
            onLoad={(map) => {
              new window.google.maps.Marker({
                map,
                position: center,
                title: station.name,
              });
            }}
          />
        </div>

        {/* Charger Summary */}
        {station.chargerSummary && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-lg mb-2 text-center sm:text-left">
              Charger Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 text-center text-sm gap-2">
              <div><strong>Total</strong><p>{station.chargerSummary.total}</p></div>
              <div><strong>Available</strong><p>{station.chargerSummary.available}</p></div>
              <div><strong>Busy</strong><p>{station.chargerSummary.busy}</p></div>
              <div><strong>Fault</strong><p>{station.chargerSummary.fault}</p></div>
              <div><strong>Offline</strong><p>{station.chargerSummary.offline}</p></div>
            </div>
          </div>
        )}

        {/* Chargers Table */}
        {station.chargers && station.chargers.length > 0 && (
          <div className="overflow-x-auto mb-6">
            <h3 className="text-lg font-semibold mb-2 text-center sm:text-left">Chargers</h3>
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Code</th>
                  <th className="p-2 text-left">Connector</th>
                  <th className="p-2 text-left">Power (kW)</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Created</th>
                  <th className="p-2 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {station.chargers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="p-2">{c.code}</td>
                    <td className="p-2">{c.connectorType}</td>
                    <td className="p-2">{c.powerKw}</td>
                    <td className="p-2">{c.status}</td>
                    <td className="p-2">{new Date(c.createdAt).toLocaleString()}</td>
                    <td className="p-2">{new Date(c.updatedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-center sm:justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
