import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllStations,
  getAllEvOwners,
  getAllOperators,
  getPendingEvOwners,
} from "../../api/adminDashboardOverviewApi";
import { getAllAdmins } from "../../api/adminApi";

export default function AdminDashboardOverview({ setActiveTab }) {
  const [totals, setTotals] = useState({
    stations: 0,
    owners: 0,
    pendingOwners: 0,
    operators: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const [
        stationsData,
        ownersData,
        pendingOwnersData,
        operatorsData,
        adminsData,
      ] = await Promise.all([
        getAllStations("", 0, 1000),
        getAllEvOwners("", 0, 1000),
        getPendingEvOwners("", 0, 1000),
        getAllOperators("", 0, 1000),
        getAllAdmins(0, 1000),
      ]);

      setTotals({
        stations: stationsData.length,
        owners: ownersData.length,
        pendingOwners: pendingOwnersData.length,
        operators: operatorsData.length,
        admins: adminsData.length,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard overview data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Admin Dashboard Overview
        </h2>
        <p>Loading summary data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        Admin Dashboard Overview
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Total Stations */}
        <div
          className="bg-blue-100 p-4 rounded shadow text-center cursor-pointer hover:bg-blue-200 transition"
          onClick={() => setActiveTab("stations")}
        >
          <h3 className="text-xl font-semibold">Total Stations</h3>
          <p className="text-3xl font-bold text-blue-600">
            {totals.stations}
          </p>
        </div>

        {/* EV Owners */}
        <div
          className="bg-green-100 p-4 rounded shadow text-center cursor-pointer hover:bg-green-200 transition"
          onClick={() => setActiveTab("owners")}
        >
          <h3 className="text-xl font-semibold">EV Owners</h3>
          <p className="text-3xl font-bold text-green-600">
            {totals.owners}
          </p>
        </div>

        {/* Pending EV Owners */}
        <div
          className="bg-yellow-100 p-4 rounded shadow text-center cursor-pointer hover:bg-yellow-200 transition"
          onClick={() => setActiveTab("owners")}
        >
          <h3 className="text-xl font-semibold">Pending EV Owners</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {totals.pendingOwners}
          </p>
        </div>

        {/* Operators */}
        <div
          className="bg-purple-100 p-4 rounded shadow text-center cursor-pointer hover:bg-purple-200 transition"
          onClick={() => setActiveTab("operators")}
        >
          <h3 className="text-xl font-semibold">Operators</h3>
          <p className="text-3xl font-bold text-purple-600">
            {totals.operators}
          </p>
        </div>

        {/* Backoffice Admins */}
        <div
          className="bg-pink-100 p-4 rounded shadow text-center cursor-pointer hover:bg-pink-200 transition"
          onClick={() => setActiveTab("admins")}
        >
          <h3 className="text-xl font-semibold">Backoffice Admins</h3>
          <p className="text-3xl font-bold text-pink-600">
            {totals.admins}
          </p>
        </div>
      </div>
    </div>
  );
}
