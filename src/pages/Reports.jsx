import React, { useState } from "react";
import {
  BarChart3,
  IndianRupee,
  Wrench,
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Calendar
} from "lucide-react";

/* ================= SAMPLE DATA ================= */

const SERVICES = [
  { id: 1, date: "2026-01-29", service: "General Service", count: 12, revenue: 18000 },
  { id: 2, date: "2026-01-26", service: "Oil Change", count: 8, revenue: 7200 },
  { id: 3, date: "2026-01-20", service: "Engine Repair", count: 3, revenue: 19500 },
  { id: 4, date: "2025-12-18", service: "Brake Service", count: 6, revenue: 9600 },
  { id: 5, date: "2025-09-10", service: "General Service", count: 15, revenue: 22500 }
];

const INVENTORY = [
  { id: 1, item: "Engine Oil", stock: 40, min: 20 },
  { id: 2, item: "Brake Pads", stock: 10, min: 15 },
  { id: 3, item: "Chain Lube", stock: 25, min: 10 },
  { id: 4, item: "Spark Plug", stock: 6, min: 10 }
];

/* ================= DATE FILTER ================= */

const filterByRange = (date, range) => {
  const today = new Date();
  const d = new Date(date);

  switch (range) {
    case "Daily":
      return d.toDateString() === today.toDateString();

    case "Weekly": {
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      return d >= lastWeek;
    }

    case "Monthly": {
      const lastMonth = new Date();
      lastMonth.setMonth(today.getMonth() - 1);
      return d >= lastMonth;
    }

    case "6 Months": {
      const last6Months = new Date();
      last6Months.setMonth(today.getMonth() - 6);
      return d >= last6Months;
    }

    case "Yearly": {
      const lastYear = new Date();
      lastYear.setFullYear(today.getFullYear() - 1);
      return d >= lastYear;
    }

    default:
      return true;
  }
};

function Reports() {
  const [range, setRange] = useState("Daily");

  const filteredServices = SERVICES.filter(s =>
    filterByRange(s.date, range)
  );

  const totalServices = filteredServices.reduce((a, b) => a + b.count, 0);
  const totalRevenue = filteredServices.reduce((a, b) => a + b.revenue, 0);
  const lowStockItems = INVENTORY.filter(i => i.stock < i.min);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <BarChart3 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Admin Reports & Analytics</h1>
            <p className="text-sm text-slate-500">
              Performance overview by time period
            </p>
          </div>
        </div>

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {["Daily", "Weekly", "Monthly", "6 Months", "Yearly"].map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                range === r
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-slate-500 hover:bg-slate-100"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            icon={<Wrench className="text-blue-600" />}
            title={`${range} Services`}
            value={totalServices}
          />
          <SummaryCard
            icon={<IndianRupee className="text-green-600" />}
            title={`${range} Revenue`}
            value={`₹ ${totalRevenue}`}
          />
          <SummaryCard
            icon={<AlertTriangle className="text-red-600" />}
            title="Low Stock Items"
            value={lowStockItems.length}
          />
        </div>

        {/* SERVICE REPORT */}
        <Section title={`${range} Service Report`} icon={<Calendar />}>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Service Type</th>
                <th className="p-4 text-left">Count</th>
                <th className="p-4 text-left">Revenue (₹)</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map(s => (
                <tr key={s.id} className="border-t hover:bg-slate-50">
                  <td className="p-4">{s.date}</td>
                  <td className="p-4 font-medium">{s.service}</td>
                  <td className="p-4">{s.count}</td>
                  <td className="p-4">₹ {s.revenue}</td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-slate-400">
                    No records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Section>

        {/* INVENTORY */}
        <Section title="Inventory Status" icon={<Boxes />}>
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {INVENTORY.map(i => (
                <tr key={i.id} className="border-t">
                  <td className="p-4 font-medium">{i.item}</td>
                  <td className="p-4">{i.stock}</td>
                  <td className="p-4">
                    {i.stock < i.min ? (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700">
                        Sufficient
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        {/* ADMIN INSIGHTS */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" /> Admin Insights
          </h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-2">
            <li>{range} data helps track service demand patterns.</li>
            <li>Revenue analysis supports financial planning.</li>
            <li>Low stock alerts prevent service delays.</li>
            <li>Yearly trends help evaluate business growth.</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function SummaryCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow mb-10">
      <div className="flex items-center gap-2 p-5 border-b font-bold">
        {icon} {title}
      </div>
      <div className="p-5 overflow-x-auto">{children}</div>
    </div>
  );
}

export default Reports;

















