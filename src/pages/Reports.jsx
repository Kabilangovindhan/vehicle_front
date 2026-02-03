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






















// import React, { useState } from "react";
// import {
//   BarChart3,
//   IndianRupee,
//   Wrench,
//   Boxes,
//   AlertTriangle,
//   CheckCircle2,
//   Calendar,
//   Download,
//   TrendingUp,
//   ChevronRight,
//   ArrowUpRight,
//   Filter
// } from "lucide-react";

// /* ================= SAMPLE DATA ================= */
// const SERVICES = [
//   { id: 1, date: "2026-01-29", service: "General Service", count: 12, revenue: 18000, trend: "+15%" },
//   { id: 2, date: "2026-01-26", service: "Oil Change", count: 8, revenue: 7200, trend: "+5%" },
//   { id: 3, date: "2026-01-20", service: "Engine Repair", count: 3, revenue: 19500, trend: "-2%" },
//   { id: 4, date: "2025-12-18", service: "Brake Service", count: 6, revenue: 9600, trend: "+8%" },
//   { id: 5, date: "2025-09-10", service: "General Service", count: 15, revenue: 22500, trend: "+12%" }
// ];

// const INVENTORY = [
//   { id: 1, item: "Engine Oil", stock: 40, min: 20, unit: "Ltrs" },
//   { id: 2, item: "Brake Pads", stock: 10, min: 15, unit: "Pairs" },
//   { id: 3, item: "Chain Lube", stock: 25, min: 10, unit: "Cans" },
//   { id: 4, item: "Spark Plug", stock: 6, min: 10, unit: "Units" }
// ];

// /* ================= DATE FILTER UTILS ================= */
// const filterByRange = (date, range) => {
//   const today = new Date();
//   const d = new Date(date);
//   switch (range) {
//     case "Daily": return d.toDateString() === today.toDateString();
//     case "Weekly": return d >= new Date(today.setDate(today.getDate() - 7));
//     case "Monthly": return d >= new Date(today.setMonth(today.getMonth() - 1));
//     case "6 Months": return d >= new Date(today.setMonth(today.getMonth() - 6));
//     case "Yearly": return d >= new Date(today.setFullYear(today.getFullYear() - 1));
//     default: return true;
//   }
// };

// function Reports() {
//   const [range, setRange] = useState("Monthly");

//   const filteredServices = SERVICES.filter(s => filterByRange(s.date, range));
//   const totalServices = filteredServices.reduce((a, b) => a + b.count, 0);
//   const totalRevenue = filteredServices.reduce((a, b) => a + b.revenue, 0);
//   const lowStockItems = INVENTORY.filter(i => i.stock < i.min);

//   return (
//     <div className="min-h-screen bg-[#F1F5F9] pb-12">
//       {/* TOP NAVIGATION BAR */}
//       <div className="bg-white border-b sticky top-0 z-10 px-4 md:px-8 py-4">
//         <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
//               <BarChart3 size={24} />
//             </div>
//             <div>
//               <h1 className="text-xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
//               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Admin Control Panel</p>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
//             <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
//               {["Daily", "Weekly", "Monthly", "Yearly"].map(r => (
//                 <button
//                   key={r}
//                   onClick={() => setRange(r)}
//                   className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
//                     range === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   {r}
//                 </button>
//               ))}
//             </div>
//             <button className="p-2 bg-white border rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm">
//               <Download size={18} />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        
//         {/* SUMMARY GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <StatCard 
//             label={`${range} Services`} 
//             value={totalServices} 
//             icon={<Wrench />} 
//             color="text-blue-600" 
//             bgColor="bg-blue-50"
//             trend="+12.5% from last period"
//           />
//           <StatCard 
//             label="Total Revenue" 
//             value={`₹${totalRevenue.toLocaleString()}`} 
//             icon={<IndianRupee />} 
//             color="text-emerald-600" 
//             bgColor="bg-emerald-50"
//             trend="+8.2% vs average"
//           />
//           <StatCard 
//             label="Low Stock Alert" 
//             value={lowStockItems.length} 
//             icon={<AlertTriangle />} 
//             color="text-rose-600" 
//             bgColor="bg-rose-50"
//             isAlert={lowStockItems.length > 0}
//             trend="Needs immediate restock"
//           />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* MAIN TABLE SECTION */}
//           <div className="lg:col-span-2 space-y-8">
//             <Section 
//               title="Service Performance" 
//               icon={<Calendar size={18} />} 
//               badge={filteredServices.length}
//             >
//               <div className="overflow-x-auto -mx-5 md:mx-0">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-slate-50 border-y border-slate-100">
//                       <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</th>
//                       <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</th>
//                       <th className="px-6 py-4 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Volume</th>
//                       <th className="px-6 py-4 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Revenue</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50">
//                     {filteredServices.map(s => (
//                       <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
//                         <td className="px-6 py-4 text-sm font-medium text-slate-500">{s.date}</td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-bold text-slate-800">{s.service}</span>
//                             <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded italic">{s.trend}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-sm font-black text-slate-900 text-center">{s.count}</td>
//                         <td className="px-6 py-4 text-right">
//                           <span className="text-sm font-black text-slate-900">₹{s.revenue.toLocaleString()}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Section>
//           </div>

//           {/* SIDEBAR: INVENTORY & INSIGHTS */}
//           <div className="space-y-8">
//             <Section title="Live Inventory" icon={<Boxes size={18} />}>
//               <div className="space-y-6">
//                 {INVENTORY.map(i => {
//                   const isLow = i.stock < i.min;
//                   const progress = Math.min((i.stock / (i.min * 2)) * 100, 100);
//                   return (
//                     <div key={i.id} className="space-y-2">
//                       <div className="flex justify-between items-end">
//                         <p className="text-sm font-bold text-slate-700">{i.item}</p>
//                         <p className={`text-xs font-black ${isLow ? 'text-rose-600' : 'text-slate-500'}`}>
//                           {i.stock} <span className="text-[10px] text-slate-400 uppercase">{i.unit}</span>
//                         </p>
//                       </div>
//                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
//                         <div 
//                           className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]' : 'bg-blue-500'}`}
//                           style={{ width: `${progress}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </Section>

//             {/* AI INSIGHTS CARD */}
//             <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
//               <TrendingUp className="absolute -right-6 -bottom-6 text-white/5 w-32 h-32" />
//               <div className="relative z-10">
//                 <div className="flex items-center gap-2 mb-4">
//                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
//                    <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">Business Insight</h3>
//                 </div>
//                 <p className="text-sm text-slate-300 leading-relaxed mb-6">
//                   Peak demand for <span className="text-white font-bold">General Service</span> detected. Consider allocating more technicians for the weekend.
//                 </p>
//                 <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2">
//                   View Recommendations <ChevronRight size={14} />
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

// /* ================= ATOMIC COMPONENTS ================= */

// function StatCard({ label, value, icon, color, bgColor, trend, isAlert }) {
//   return (
//     <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
//       <div className="flex justify-between items-start mb-4">
//         <div className={`p-3 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110 duration-500`}>
//           {React.cloneElement(icon, { size: 24 })}
//         </div>
//         {isAlert && <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />}
//       </div>
//       <div>
//         <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
//         <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
//         <p className={`text-[10px] font-bold mt-2 ${isAlert ? 'text-rose-500' : 'text-slate-500'}`}>{trend}</p>
//       </div>
//     </div>
//   );
// }

// function Section({ title, icon, children, badge }) {
//   return (
//     <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
//       <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
//         <div className="flex items-center gap-2 text-slate-800 font-black tracking-tight">
//           <span className="text-blue-600">{icon}</span>
//           {title}
//         </div>
//         {badge && (
//           <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full">
//             {badge} Records
//           </span>
//         )}
//       </div>
//       <div className="p-6">{children}</div>
//     </div>
//   );
// }

// export default Reports;