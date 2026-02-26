import React, { useEffect, useState, useMemo } from "react";
import {
  Loader2, Car, User, Phone, Wrench, Search,
  AlertCircle, ShieldCheck, RefreshCw, Filter, ChevronRight
} from "lucide-react";

function JobControlCenter() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 10000); // 10s is usually safer for local dev
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobControlCenter/fetch");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Professional Filtering Logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = 
        job.booking?.vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.booking?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "All" || job.jobStatus === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [jobs, searchTerm, filterStatus]);

  if (loading) return <SkeletonLoader />;

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Top Navigation / Header */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Operations</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800">Control Center</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search vehicle or customer..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="bg-white border border-slate-200 text-sm font-semibold py-2 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Assigned">Assigned</option>
              <option value="Inspection">Inspection</option>
              <option value="Working">Working</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {filteredJobs.length === 0 ? (
          <EmptyState isFiltered={searchTerm || filterStatus !== "All"} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function JobCard({ job }) {
  return (
    <div className="group relative bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-slate-50 p-3 rounded-2xl text-indigo-600">
          <Car size={22} strokeWidth={2.5} />
        </div>
        <StatusBadge status={job.jobStatus} />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">
          {job.booking?.vehicle?.vehicleNumber}
        </h3>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{job.booking?.serviceType}</p>
      </div>

      <div className="space-y-3 pb-6 border-b border-slate-50">
        <InfoItem icon={<User size={14}/>} text={job.booking?.customer?.name} />
        <InfoItem icon={<Phone size={14}/>} text={job.assignedStaff?.phone} isMuted />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
            {job.assignedStaff?.name?.substring(0, 2).toUpperCase() || "NA"}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Technician</p>
            <p className="text-xs font-bold text-slate-700">{job.assignedStaff?.name || "Pending"}</p>
          </div>
        </div>
        <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function InfoItem({ icon, text, isMuted }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-300">{icon}</span>
      <span className={`text-sm font-semibold ${isMuted ? 'text-slate-400' : 'text-slate-600'}`}>
        {text || "Not Provided"}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Assigned: "text-blue-600 bg-blue-50 border-blue-100",
    Inspection: "text-amber-600 bg-amber-50 border-amber-100",
    Working: "text-indigo-600 bg-indigo-50 border-indigo-100",
    Completed: "text-emerald-600 bg-emerald-50 border-emerald-100",
    "Ready Delivery": "text-purple-600 bg-purple-50 border-purple-100"
  };

  return (
    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wide ${styles[status] || 'text-slate-500 bg-slate-50 border-slate-100'}`}>
      {status}
    </span>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-slate-200 rounded-lg mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-white rounded-[2rem] border border-slate-100 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ isFiltered }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
      <div className="p-6 bg-slate-50 rounded-full mb-4">
        <AlertCircle size={48} className="text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-800">
        {isFiltered ? "No matches found" : "Workspace clear"}
      </h3>
      <p className="text-slate-500 text-center max-w-xs mt-2">
        {isFiltered ? "Try adjusting your filters or search terms." : "All caught up! New jobs will appear here in real-time."}
      </p>
    </div>
  );
}

export default JobControlCenter;