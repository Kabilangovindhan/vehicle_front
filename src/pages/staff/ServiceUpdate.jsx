import React, { useEffect, useState } from "react";
import { Clock, Car, User, Phone, Wrench, ArrowUpRight, AlertCircle, RefreshCw, Hammer, CheckCircle2, PackageCheck } from "lucide-react";

function ServiceUpdate() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Working");

    const tabs = [
        {
            id: "Working",
            label: "Working",
            icon: Hammer,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            id: "Completed",
            label: "Completed",
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            id: "Ready Delivery",
            label: "Ready Delivery",
            icon: PackageCheck,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
    ];

    useEffect(() => {
        fetchJobs();
    }, [activeTab]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/serviceUpdate/jobs?status=${activeTab}`);
            const data = await res.json();
            setJobs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case "Working":
                return "bg-blue-50 border-blue-100 text-blue-600";

            case "Completed":
                return "bg-emerald-50 border-emerald-100 text-emerald-600";

            case "Ready Delivery":
                return "bg-purple-50 border-purple-100 text-purple-600";

            default:
                return "bg-slate-50 border-slate-100 text-slate-600";
        }
    };
    const goToNextStep = async (jobId) => {
    try {

        const res = await fetch(
            `http://localhost:5000/api/serviceUpdate/jobs/${jobId}/next`,
            {
                method: "PUT"
            }
        );

        const data = await res.json();

        if (res.ok) {

            // Refresh list automatically
            fetchJobs();

        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
    }
};

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                {/* HEADER SAME AS APPROVAL QUEUE */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-200">
                            <Clock className="text-white" size={24} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                                Service <span className="text-indigo-600">Update</span>
                            </h1>

                            <p className="text-slate-500 text-sm font-medium">Monitor vehicle service progress and delivery readiness</p>
                        </div>
                    </div>

                    <button onClick={fetchJobs} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh List
                    </button>
                </div>

                {/* STATUS TABS */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    {tabs.map((tab) => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${activeTab === tab.id ? `${tab.bg} ${tab.color} ring-2 ring-indigo-200` : "bg-white text-slate-400 border border-slate-200 hover:bg-slate-50"}`}>
                            <tab.icon size={16} />

                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA SAME AS APPROVAL QUEUE */}
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

                        <p className="text-slate-500 mt-1">There are no jobs currently in "{activeTab}" status.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
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
                                        <tr key={job._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-slate-900 p-2 rounded-lg">
                                                        <Car size={18} className="text-indigo-400" />
                                                    </div>

                                                    <div>
                                                        <div className="font-black text-slate-800">{job.booking?.vehicle?.vehicleNumber}</div>

                                                        <div className="text-xs text-slate-500">
                                                            {job.booking?.vehicle?.brand} {job.booking?.vehicle?.model}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                                        <User size={14} />

                                                        {job.booking?.customer?.name}
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Phone size={12} />

                                                        {job.booking?.customer?.phone}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                                                    <Wrench size={12} />

                                                    {job.booking?.serviceType}
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className={`inline-flex items-center px-3 py-1 border rounded-full text-[10px] font-black uppercase ${getStatusStyles(job.jobStatus)}`}>{job.jobStatus}</span>
                                            </td>

                                            <td className="px-6 py-5">
                                                <button
                                                    onClick={() => goToNextStep(job._id)}
                                                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 transition-all"
                                                >
                                                    Go to next
                                                    <ArrowUpRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
                            <p className="text-xs font-bold text-slate-400">
                                TOTAL {activeTab.toUpperCase()} JOBS :
                                <span className="text-slate-700 ml-1">{jobs.length}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceUpdate;
