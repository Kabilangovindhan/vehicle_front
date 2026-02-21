import React, { useEffect, useState } from "react";
import { 
    Loader2, Wrench, User, Car, 
    ClipboardList, CheckCircle2, AlertTriangle, 
    ArrowRight, Info, Settings 
} from "lucide-react";

function AssignedJob() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeJob, setActiveJob] = useState(null);
    const [activeTab, setActiveTab] = useState("details");

    const phone = sessionStorage.getItem("phone");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobManagement/fetch/${phone}`);
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (jobId, newStatus) => {
        setJobs(prev => prev.map(job => job._id === jobId ? { ...job, jobStatus: newStatus } : job));
        if (activeJob?._id === jobId) {
            setActiveJob(prev => ({ ...prev, jobStatus: newStatus }));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 gap-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse">Loading work queue...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 py-6 md:px-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <ClipboardList size={24} />
                        </div>
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                            Assigned <span className="text-indigo-600">Jobs</span>
                        </h1>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1 justify-end">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Active Duty
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                {/* TABLE/CARD VIEW */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="p-4">Job Details</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Service</th>
                                    <th className="p-4">Priority</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {jobs.map(job => (
                                    <tr key={job._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="p-4">
                                            <p className="font-mono text-[11px] text-slate-400 mb-1">#{job._id.slice(-6).toUpperCase()}</p>
                                            <p className="font-bold text-slate-700 flex items-center gap-1">
                                                <Car size={14} className="text-indigo-500" /> {job.booking?.vehicle?.vehicleNumber}
                                            </p>
                                        </td>
                                        <td className="p-4 font-medium text-slate-600">{job.booking?.customer?.name}</td>
                                        <td className="p-4">
                                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                                {job.booking?.serviceType}
                                            </span>
                                        </td>
                                        <td className="p-4"><PriorityBadge priority={job.priority} /></td>
                                        <td className="p-4"><StatusBadge status={job.jobStatus} /></td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => { setActiveJob(job); setActiveTab("details"); }}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all shadow-md active:scale-95"
                                            >
                                                Open Job
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {jobs.map(job => (
                            <div key={job._id} className="p-4 active:bg-slate-50" onClick={() => { setActiveJob(job); setActiveTab("details"); }}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-mono text-[10px] text-slate-400">#{job._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-lg font-bold text-slate-800 tracking-tight">{job.booking?.vehicle?.vehicleNumber}</p>
                                    </div>
                                    <StatusBadge status={job.jobStatus} />
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <p className="text-slate-500 font-medium">{job.booking?.serviceType}</p>
                                    <PriorityBadge priority={job.priority} />
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest">
                                    Manage Job <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* JOB TABS (DRAWER/MODAL STYLE) */}
                {activeJob && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <Wrench className="text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">{activeJob.booking?.vehicle?.vehicleNumber}</h2>
                                    <p className="text-xs text-slate-400 font-medium">Service Specialist assigned to {activeJob.booking?.customer?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveJob(null)} className="text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl">
                                Close Panel
                            </button>
                        </div>

                        <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-100 px-2">
                            <TabButton label="Overview" tab="details" icon={<Info size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Inspection" tab="inspection" icon={<Car size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Status Update" tab="status" icon={<Settings size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        <div className="p-6 md:p-10">
                            {activeTab === "details" && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <DetailItem label="Service Type" value={activeJob.booking?.serviceType} />
                                    <DetailItem label="Customer Name" value={activeJob.booking?.customer?.name} />
                                    <DetailItem label="Priority Level" value={activeJob.priority} />
                                    <DetailItem label="Current Status" value={activeJob.jobStatus} />
                                </div>
                            )}
                            {activeTab === "inspection" && (
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <CheckCircle2 size={48} className="text-slate-300 mb-4" />
                                    <h3 className="text-slate-500 font-bold uppercase tracking-widest text-sm">Vehicle Inspection Portal</h3>
                                    <p className="text-slate-400 text-xs mt-1">Inspection checklists are currently being updated.</p>
                                </div>
                            )}
                            {activeTab === "status" && (
                                <StatusUpdate job={activeJob} onUpdate={handleStatusUpdate} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// COMPONENTS

function PriorityBadge({ priority }) {
    const styles = priority === "High" ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-amber-50 text-amber-600 ring-amber-100";
    return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ${styles}`}>{priority}</span>;
}

function StatusBadge({ status }) {
    const colors = {
        "Completed": "bg-emerald-50 text-emerald-600 ring-emerald-100",
        "Working": "bg-blue-50 text-blue-600 ring-blue-100",
        "Ready Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-100"
    };
    const style = colors[status] || "bg-slate-100 text-slate-500 ring-slate-200";
    return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ${style}`}>{status}</span>;
}

function TabButton({ label, tab, icon, activeTab, setActiveTab }) {
    const isActive = activeTab === tab;
    return (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                isActive ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
        >
            {icon} {label}
        </button>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="flex flex-col gap-1 border-l-2 border-slate-100 pl-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            <span className="text-sm font-bold text-slate-700">{value}</span>
        </div>
    );
}

function StatusUpdate({ job, onUpdate }) {
    const [status, setStatus] = useState(job.jobStatus);
    const [loading, setLoading] = useState(false);

    const updateStatus = async () => {
        setLoading(true);
        try {
            await fetch(`http://localhost:5000/api/jobManagement/update/${job._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            onUpdate(job._id, status);
            alert("Status Successfully Updated");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex-1 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Select Milestone</p>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                >
                    <option>Assigned</option>
                    <option>Inspection</option>
                    <option>Waiting Approval</option>
                    <option>Working</option>
                    <option>Completed</option>
                    <option>Ready Delivery</option>
                </select>
            </div>
            <button
                onClick={updateStatus}
                disabled={loading}
                className="w-full md:w-auto mt-6 md:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                Apply Status
            </button>
        </div>
    );
}

export default AssignedJob;