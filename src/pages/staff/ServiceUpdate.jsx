import React, { useEffect, useState } from "react";
import { 
  Clock, 
  Car, 
  User, 
  Phone, 
  Wrench, 
  ArrowUpRight, 
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  PackageCheck,
  Hammer
} from "lucide-react";

function ServiceUpdate() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  // Default tab is "Working"
  const [activeTab, setActiveTab] = useState("Working");

  const tabs = [
    { id: "Working", label: "In Progress", icon: Hammer, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "Completed", label: "Completed", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { id: "Ready Delivery", label: "Ready for Delivery", icon: PackageCheck, color: "text-purple-600", bg: "bg-purple-50" }
  ];

  useEffect(() => {
    fetchJobs();
  }, [activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Sending the activeTab as a query parameter to the backend
      const res = await fetch(`http://localhost:5000/api/serviceUpdate/approvalQueue?status=${activeTab}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Working": return "bg-blue-50 border-blue-100 text-blue-600";
      case "Completed": return "bg-emerald-50 border-emerald-100 text-emerald-600";
      case "Ready Delivery": return "bg-purple-50 border-purple-100 text-purple-600";
      default: return "bg-slate-50 border-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
              <Wrench className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                Service <span className="text-indigo-600">Management</span>
              </h1>
              <p className="text-slate-500 text-sm font-medium">Monitor live service status and deliveries</p>
            </div>
          </div>
          
          <button 
            onClick={fetchJobs}
            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh List
          </button>
        </div>

        {/* STATUS TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? `${tab.bg} ${tab.color} ring-2 ring-indigo-500/20 shadow-sm` 
                : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">No Jobs Found</h2>
            <p className="text-slate-500 mt-1">There are no vehicles currently in "{activeTab}" status.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Vehicle Details</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Service Type</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="bg-slate-900 p-2 rounded-lg">
                            <Car size={18} className="text-indigo-400" />
                          </div>
                          <div>
                            <div className="font-black text-slate-800 tracking-wider">
                              {job.booking?.vehicle?.vehicleNumber || "N/A"}
                            </div>
                            <div className="text-xs text-slate-500 font-medium lowercase">
                              {job.booking?.vehicle?.brand} {job.booking?.vehicle?.model}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <User size={14} className="text-slate-400" />
                            {job.booking?.customer?.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={12} />
                            {job.booking?.customer?.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                          {job.booking?.serviceType}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-3 py-1 border rounded-full text-[10px] font-black uppercase tracking-tighter ${getStatusStyles(job.jobStatus)}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-75" />
                          {job.jobStatus}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-md shadow-slate-200">
                          Manage
                          <ArrowUpRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Current {activeTab} Jobs: <span className="text-slate-700 ml-1">{jobs.length}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceUpdate;