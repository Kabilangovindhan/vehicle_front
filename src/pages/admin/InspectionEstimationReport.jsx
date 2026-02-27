import React, { useEffect, useState } from "react";
import { Car, ClipboardList, IndianRupee, CheckCircle2, XCircle, Clock, User, AlertCircle, FileText, Printer, ChevronRight } from "lucide-react";

function AdminInspectionEstimateReport() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/inspectionestimateReport/all-reports");
            const result = await res.json();
            setData(result);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-500 font-medium">Fetching secure records...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Page Header */}
                <div className="flex justify-between items-end border-b border-slate-300 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inspection & Estimate Portal</h1>
                        <p className="text-slate-500">Manage, review, and track service requests.</p>
                    </div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                        Total Records: <span className="text-blue-600">{data.length}</span>
                    </div>
                </div>

                {/* Data Mapping */}
                {data.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-white">
                        <FileText className="mx-auto h-12 w-12 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900 mt-2">No active reports</h3>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {data.map((item, index) => {
                            const est = item.estimate;
                            const inspection = item.inspection;
                            const booking = est.job?.booking;

                            return (
                                <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                                    {/* Header Row */}
                                    <div className="bg-slate-900 p-6 flex flex-wrap justify-between items-center gap-4 text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-white/10 p-3 rounded-xl">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">{booking?.customer?.name}</h3>
                                                <p className="text-slate-400 text-sm">{booking?.customer?.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={est.approvalStatus} />
                                            <button className="text-slate-400 hover:text-white transition-colors" title="Print">
                                                <Printer size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Grid Layout */}
                                    <div className="p-6 grid lg:grid-cols-3 gap-8">
                                        {/* Vehicle Info */}
                                        <div className="lg:col-span-1 border-r border-slate-100 pr-6">
                                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                                                <Car size={18} className="text-blue-600" /> Vehicle
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="text-sm text-slate-500">Registration Number</div>
                                                <div className="text-xl font-mono font-bold text-slate-900 uppercase tracking-tight">{booking?.vehicle?.vehicleNumber}</div>
                                                <div className="text-sm font-medium">
                                                    {booking?.vehicle?.brand} {booking?.vehicle?.model}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Inspection Findings */}
                                        <div className="lg:col-span-2">
                                            <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                                                <ClipboardList size={18} className="text-blue-600" /> Inspection Notes
                                            </h4>
                                            <div className="grid sm:grid-cols-2 gap-3 mb-4">
                                                {inspection?.issuesFound?.map((issue, i) => (
                                                    <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 p-3 rounded-lg text-slate-700">
                                                        <AlertCircle size={16} className="text-blue-500" />
                                                        {issue.title || issue}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-400 italic">Remark: {inspection?.remarks || "None"}</p>
                                        </div>
                                    </div>

                                    {/* Pricing Table */}
                                    <div className="px-6 pb-6 pt-2">
                                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 text-slate-600">
                                                    <tr>
                                                        <th className="p-3 text-left">Service</th>
                                                        <th className="p-3 text-right">Labour</th>
                                                        <th className="p-3 text-right">Parts</th>
                                                        <th className="p-3 text-right">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {est.items?.map((it, i) => (
                                                        <tr key={i} className="hover:bg-slate-50">
                                                            <td className="p-3 font-medium">{it.issueTitle}</td>
                                                            <td className="p-3 text-right">₹{it.labourCharge}</td>
                                                            <td className="p-3 text-right">₹{it.partsCost}</td>
                                                            <td className="p-3 text-right font-bold text-slate-900">₹{it.total}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {/* Final Totals */}
                                        <div className="mt-6 flex justify-end">
                                            <div className="w-full sm:w-64 space-y-2 text-right">
                                                <div className="text-sm text-slate-500">Tax: ₹{est.tax}</div>
                                                <div className="text-2xl font-black text-slate-900 tracking-tighter">Grand Total: ₹{est.grandTotal?.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component for clean status representation
function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-amber-100 text-amber-800 border-amber-200",
        Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
        Rejected: "bg-rose-100 text-rose-800 border-rose-200",
    };
    return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>{status.toUpperCase()}</span>;
}

export default AdminInspectionEstimateReport;
