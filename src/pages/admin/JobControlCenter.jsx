import React, { useEffect, useState } from "react";
import { Loader2, Car, User, Phone, Wrench, AlertCircle, ShieldCheck, Clock, RefreshCw } from "lucide-react";

function JobControlCenter() {
    
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobControlCenter/fetch");
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingState />;

    return (
        <div className="min-h-screen font-sans">
            {/* Header Section */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live System</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Job Control <span className="text-indigo-600">Center</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border shadow-sm">
                    <RefreshCw size={16} className="text-slate-400 animate-spin-slow" />
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Active Units</p>
                        <p className="text-lg font-black text-slate-800 leading-none">{jobs.length}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto">
                {jobs.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

/* SUB-COMPONENTS */

function JobCard({ job }) {
    return (
        <div className="group bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between">
            <div>
                {/* Card Header: Vehicle & Status */}
                <div className="flex justify-between items-start mb-6">
                    <div className="bg-indigo-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                        <Car className="text-indigo-600" size={24} />
                    </div>
                    <StatusBadge status={job.jobStatus} />
                </div>

                {/* Vehicle ID */}
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">{job.booking?.vehicle?.vehicleNumber || "N/A"}</h3>

                {/* Data Points */}
                <div className="space-y-3 mb-6">
                    <DataRow icon={<User size={14} />} label="Customer" value={job.booking?.customer?.name} />
                    <DataRow icon={<Wrench size={14} />} label="Service" value={job.booking?.serviceType} />
                    <DataRow icon={<Phone size={14} />} label="Staff Contact" value={job.assignedStaff?.phone} />
                </div>
            </div>

            {/* Footer: Assigned Staff */}
            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-white shadow-sm">{job.assignedStaff?.name?.charAt(0) || "S"}</div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Technician</p>
                        <p className="text-sm font-semibold text-slate-700">{job.assignedStaff?.name || "Unassigned"}</p>
                    </div>
                </div>
                <ShieldCheck size={18} className="text-slate-300" />
            </div>
        </div>
    );
}

function DataRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-slate-400">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-medium text-slate-400 leading-tight">{label}</span>
                <span className="text-sm font-medium text-slate-700 leading-tight">{value || "---"}</span>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        Assigned: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        Inspection: "bg-amber-50 text-amber-600 ring-amber-100",
        "Waiting Approval": "bg-orange-50 text-orange-600 ring-orange-100",
        Working: "bg-blue-50 text-blue-600 ring-blue-100",
        Completed: "bg-emerald-50 text-emerald-600 ring-emerald-100",
        "Ready Delivery": "bg-purple-50 text-purple-600 ring-purple-100",
    };

    return <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider ring-1 ring-inset ${styles[status] || "bg-slate-50 text-slate-600 ring-slate-100"}`}>{status}</span>;
}

function LoadingState() {
    return (
        <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <p className="text-slate-500 font-bold animate-pulse">Initializing Control Center...</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="bg-white p-12 md:p-24 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-slate-300" />
            </div>
            <h2 className="font-black text-2xl text-slate-800 mb-2">System Clear</h2>
            <p className="text-slate-500 max-w-xs mx-auto">No active jobs are currently in the pipeline. New bookings will appear here automatically.</p>
        </div>
    );
}

export default JobControlCenter;
