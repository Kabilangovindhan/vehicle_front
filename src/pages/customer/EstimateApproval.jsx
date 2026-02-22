import React, { useEffect, useState } from "react";
import { 
    CheckCircle2, XCircle, Clock, Car, 
    User, Wrench, Clipboard, IndianRupee, 
    FileText, AlertCircle
} from "lucide-react";

function EstimateReport() {

    const [estimates, setEstimates] = useState([]);
    const [loading, setLoading] = useState(true);
    const phone = sessionStorage.getItem("phone");

    useEffect(() => {
        fetchEstimate();
    }, []);

    const fetchEstimate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/estimateApproval/estimate/${phone}`);
            const data = await res.json();
            setEstimates(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    const approveEstimate = async (id) => {
        if (!window.confirm("Are you sure you want to approve this estimate?")) return;
        await fetch(`http://localhost:5000/api/estimateApproval/approve/${id}`, { method: "PUT" });
        fetchEstimate();
    };

    const rejectEstimate = async (id) => {
        if (!window.confirm("Are you sure you want to reject this estimate?")) return;
        await fetch(`http://localhost:5000/api/estimateApproval/reject/${id}`, { method: "PUT" });
        fetchEstimate();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                {/* PAGE HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Service <span className="text-indigo-600">Estimates</span>
                        </h1>
                        <p className="text-slate-500 font-medium">Review and manage your vehicle service approvals</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200 inline-flex items-center gap-2">
                        <FileText size={18} className="text-indigo-500" />
                        <span className="font-bold text-slate-700">{estimates.length} Estimates Found</span>
                    </div>
                </div>

                {estimates.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clipboard size={32} className="text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">No Estimates Available</h2>
                        <p className="text-slate-500 mt-2">When the workshop generates an estimate for your vehicle, it will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {estimates.map((est) => (
                            <div key={est._id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                
                                {/* TOP BAR: VEHICLE & STATUS */}
                                <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-3 rounded-2xl">
                                            <Car className="text-indigo-400" size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-black tracking-wider uppercase">
                                                {est.job?.booking?.vehicle?.vehicleNumber || "N/A"}
                                            </h2>
                                            <p className="text-slate-400 text-sm font-medium">
                                                {est.job?.booking?.vehicle?.brand} {est.job?.booking?.vehicle?.model}
                                            </p>
                                        </div>
                                    </div>
                                    <StatusBadge status={est.approvalStatus} />
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        
                                        {/* LEFT COLUMN: CUSTOMER & SERVICE INFO */}
                                        <div className="space-y-6">
                                            <div>
                                                <Label text="Customer Details" />
                                                <div className="flex items-center gap-3 mt-2 text-slate-700">
                                                    <User size={16} className="text-slate-400" />
                                                    <span className="font-bold">{est.job?.booking?.customer?.name}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label text="Service Context" />
                                                <div className="flex items-center gap-3 mt-2 text-slate-700">
                                                    <Wrench size={16} className="text-slate-400" />
                                                    <span className="font-bold">{est.job?.booking?.serviceType}</span>
                                                </div>
                                            </div>
                                            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                                                <Label text="Technician Remarks" color="text-indigo-600" />
                                                <p className="text-sm text-indigo-900 mt-1 italic">
                                                    "{est.inspection?.remarks || "No additional remarks"}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* RIGHT COLUMN: LINE ITEMS & PRICING */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <Label text="Estimate Breakdown" />
                                            <div className="border border-slate-100 rounded-2xl overflow-hidden overflow-x-auto">
                                                <table className="w-full text-center border-collapse min-w-[400px]">
                                                    <thead>
                                                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                                                            <th className="px-4 py-3">Issue Title</th>
                                                            <th className="px-4 py-3">Labour</th>
                                                            <th className="px-4 py-3">Parts</th>
                                                            <th className="px-4 py-3">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {est.items?.map((item, idx) => (
                                                            <tr key={idx} className="text-sm hover:bg-slate-50/50 transition-colors">
                                                                <td className="px-4 py-3">
                                                                    <p className="font-bold text-slate-800">{item.issueTitle}</p>
                                                                </td>
                                                                <td className="px-4 py-3 font-medium text-slate-600">₹{item.labourCharge}</td>
                                                                <td className="px-4 py-3 font-medium text-slate-600">₹{item.partsCost}</td>
                                                                <td className="px-4 py-3 font-bold text-indigo-600">₹{item.total}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* SUMMARY & ACTIONS */}
                                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-4">
                                                <div className="w-full md:w-auto space-y-1">
                                                    <div className="flex justify-between md:gap-12 text-sm text-slate-500">
                                                        <span>Tax (GST)</span>
                                                        <span className="font-bold">₹{est.tax}</span>
                                                    </div>
                                                    <div className="flex justify-between md:gap-12 text-xl font-black text-slate-900 pt-2 border-t border-slate-100">
                                                        <span>Grand Total</span>
                                                        <span className="text-indigo-600">₹{est.grandTotal}</span>
                                                    </div>
                                                </div>

                                                {/* ACTION BUTTONS */}
                                                {est.approvalStatus === "Pending" && (
                                                    <div className="flex gap-3 w-full md:w-auto">
                                                        <button 
                                                            onClick={() => rejectEstimate(est._id)}
                                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 border-2 border-rose-100 text-rose-600 px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-rose-50 transition-colors"
                                                        >
                                                            <XCircle size={18} /> Reject
                                                        </button>
                                                        <button 
                                                            onClick={() => approveEstimate(est._id)}
                                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black uppercase text-xs hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                                        >
                                                            <CheckCircle2 size={18} /> Approve
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Label({ text, color = "text-slate-400" }) {
    return <p className={`text-[10px] font-black uppercase tracking-widest ${color}`}>{text}</p>;
}

function StatusBadge({ status }) {
    const config = {
        Pending: { icon: Clock, class: "bg-amber-500/20 text-amber-400 border-amber-500/20" },
        Approved: { icon: CheckCircle2, class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" },
        Rejected: { icon: XCircle, class: "bg-rose-500/20 text-rose-400 border-rose-500/20" },
    };
    const { icon: Icon, class: className } = config[status] || config.Pending;
    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${className}`}>
            <Icon size={14} />
            {status}
        </div>
    );
}

export default EstimateReport;