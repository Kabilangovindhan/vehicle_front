import React, { useEffect, useState } from "react";
import { Clock, Car, User, Phone, Wrench, ArrowUpRight, AlertCircle, RefreshCw, ClipboardList } from "lucide-react";

function ApprovalQueue() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovalQueue();
    }, []);

    const fetchApprovalQueue = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/approvalQueue/approvalQueue");
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto">
                {/* HEADER SECTION */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-4 md:py-6 md:px-8 mb-10">
                    <div className="mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                                <ClipboardList size={20} className="md:w-6 md:h-6" />
                            </div>
                            <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
                                Waiting <span className="text-indigo-600">Approval</span> Queue
                            </h1>
                        </div>
                        <button onClick={fetchApprovalQueue} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                            Refresh Queue
                        </button>
                    </div>
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
                        <h2 className="text-xl font-bold text-slate-800">Queue is Clear</h2>
                        <p className="text-slate-500 mt-1">There are no jobs currently waiting for customer approval.</p>
                    </div>
                ) : (
                    <div className="p-3 md:m-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">Vehicle Details</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">Customer</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Service</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {jobs.map((job) => (
                                        <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                                            {/* Vehicle Column */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-900 p-2 rounded-lg">
                                                        <Car size={18} className="text-indigo-400" />
                                                    </div>
                                                    <div>
                                                        <div className="font-black text-slate-800 tracking-wider">{job.booking?.vehicle?.vehicleNumber || "N/A"}</div>
                                                        <div className="text-xs text-slate-500 font-medium">
                                                            {job.booking?.vehicle?.brand} {job.booking?.vehicle?.model}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Customer Column */}
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

                                            {/* Service Column */}
                                            <td className="px-6 py-5">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                                                    <Wrench size={12} />
                                                    {job.booking?.serviceType}
                                                </div>
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-5">
                                                <span className="inline-flex items-center px-3 py-1 bg-amber-50 border border-amber-100 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 animate-pulse" />
                                                    {job.jobStatus}
                                                </span>
                                            </td>

                                            {/* Action Column */}
                                            <td className="px-6 py-5">
                                                <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 shadow-md shadow-slate-200">
                                                    View Details
                                                    <ArrowUpRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer summary */}
                        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400">
                                TOTAL PENDING APPROVALS : <span className="text-slate-700 ml-1">{jobs.length}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ApprovalQueue;
