import React, { useEffect, useState } from "react";
import { Wrench, Car, User, ClipboardList, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function jobManagement() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [activeSelection, setActiveSelection] = useState(null);

    const phone = sessionStorage.getItem("phone");

    useEffect(() => { fetchJobs(); }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/jobManagement/fetch/${phone}`);
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            setUpdatingId(jobId);
            const res = await fetch(`http://localhost:5000/api/jobManagement/update/${jobId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            const data = await res.json();
            if (res.ok) {
                setJobs(prev => prev.map(job =>
                    job._id === jobId ? { ...job, jobStatus: data.job.jobStatus } : job
                ));
                setActiveSelection(null);
            }
        } catch {
            alert("Update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12">
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 p-6">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
                        <ClipboardList className="text-indigo-600" /> My Work Queue
                    </h1>
                    <p className="text-sm text-slate-500">{jobs.length} assignments found</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-6 space-y-4">
                {jobs.map(job => (
                    <div key={job._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 transition-all hover:border-slate-300">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Job Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Wrench className="text-indigo-600" size={20} />
                                    <h3 className="font-bold text-lg text-slate-800">{job.booking.serviceType}</h3>
                                    <span className={`ml-auto px-3 py-1 text-[10px] uppercase tracking-wider font-black rounded-full ${job.jobStatus === "Pending" ? "bg-amber-100 text-amber-700" :
                                            job.jobStatus === "In Progress" ? "bg-indigo-100 text-indigo-700" :
                                                "bg-emerald-100 text-emerald-700"
                                        }`}>
                                        {job.jobStatus}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
                                    <div className="flex items-center gap-2 text-sm font-medium"><Car size={16} className="text-slate-400" /> {job.booking.vehicle.vehicleNumber}</div>
                                    <div className="flex items-center gap-2 text-sm font-medium"><User size={16} className="text-slate-400" /> {job.booking.customer.name}</div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 min-w-[160px]">
                                <button
                                    onClick={() => navigate(`/layout/inspection/${job._id}`)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold">
                                    Inspection
                                </button>

                                {/* <button
                                    onClick={() => navigate(`/layout/estimate/${job._id}`)}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-bold">
                                    Create Estimate
                                </button> */}


                                <button
                                    onClick={() => setActiveSelection(activeSelection === job._id ? null : job._id)}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold"
                                >
                                    Update Progress
                                </button>
                            </div>
                        </div>

                        {/* Inline Radio Selection (Removed "Assigned") */}
                        {activeSelection === job._id && (
                            <div className="mt-2 p-5 bg-slate-50 rounded-xl border border-slate-100 border-dashed animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex flex-wrap gap-6">
                                        {["Pending", "In Progress", "Completed"].map((status) => (
                                            <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="radio"
                                                        name={`status-${job._id}`}
                                                        className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-indigo-600 transition-all cursor-pointer"
                                                        checked={job.jobStatus === status}
                                                        onChange={() => handleStatusChange(job._id, status)}
                                                        disabled={updatingId === job._id}
                                                    />
                                                    <div className="absolute w-2.5 h-2.5 bg-indigo-600 rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none" />
                                                </div>
                                                <span className={`text-sm font-bold transition-colors ${job.jobStatus === status ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-800"}`}>
                                                    {status}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {updatingId === job._id && (
                                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold italic animate-pulse">
                                            <Loader2 className="animate-spin" size={14} /> Saving...
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default jobManagement;