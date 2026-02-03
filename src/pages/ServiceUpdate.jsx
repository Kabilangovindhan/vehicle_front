import React, { useState } from "react";
import {
  BarChart3,
  Calendar,
  ClipboardList,
  Bike,
  CheckCircle2,
  Clock
} from "lucide-react";

/* ================= SAMPLE BOOKING DATA ================= */
const REPORT_DATA = [
  {
    id: 1,
    customerName: "Rahul",
    bike: "Honda Shine",
    serviceType: "General Service",
    date: "2026-01-25",
    status: "Completed"
  },
  {
    id: 2,
    customerName: "Arun",
    bike: "Yamaha R15",
    serviceType: "Oil Change",
    date: "2026-01-26",
    status: "In Progress"
  },
  {
    id: 3,
    customerName: "Karthik",
    bike: "Royal Enfield Classic",
    serviceType: "Engine Repair",
    date: "2026-01-27",
    status: "Pending"
  }
];

function Reports() {
  const [filter, setFilter] = useState("All");

  const filteredData =
    filter === "All"
      ? REPORT_DATA
      : REPORT_DATA.filter((item) => item.status === filter);

  const countByStatus = (status) =>
    REPORT_DATA.filter((item) => item.status === status).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <BarChart3 size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Service Booking Reports</h2>
            <p className="text-sm text-slate-500">
              Track service bookings and status overview
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
            <ClipboardList className="text-blue-600" />
            <div>
              <p className="text-sm text-slate-500">Total Bookings</p>
              <p className="text-2xl font-bold">{REPORT_DATA.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
            <CheckCircle2 className="text-green-600" />
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold">{countByStatus("Completed")}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
            <Clock className="text-yellow-600" />
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold">{countByStatus("Pending")}</p>
            </div>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex gap-4 mb-6">
          {["All", "Pending", "In Progress", "Completed"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                filter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-slate-500 hover:bg-slate-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">Customer</th>
                <th className="p-4 text-left">Bike</th>
                <th className="p-4 text-left">Service</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-medium">{item.customerName}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Bike size={14} /> {item.bike}
                  </td>
                  <td className="p-4">{item.serviceType}</td>
                  <td className="p-4 flex items-center gap-2">
                    <Calendar size={14} /> {item.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <p className="text-center text-slate-400 py-8">
              No records found
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default Reports;
