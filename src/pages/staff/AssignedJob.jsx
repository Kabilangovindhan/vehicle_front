import React, { useEffect, useState } from "react";
import { 
    Loader2, Wrench, Car, 
    ClipboardList, CheckCircle2, 
    Info, Settings, Plus, X, Save,
    Calculator, Receipt, ChevronRight,
    AlertCircle
} from "lucide-react";

function AssignedJob() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeJob, setActiveJob] = useState(null);
    const [activeTab, setActiveTab] = useState("details");
    const [prefilledIssues, setPrefilledIssues] = useState([]);

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

    const handleInspectionComplete = (issues) => {
        setPrefilledIssues(issues);
        setActiveTab("estimate");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 gap-4 p-4">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
                <p className="text-slate-500 font-medium animate-pulse text-center">Loading work queue...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-20 px-4 py-4 md:py-6 md:px-8">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <ClipboardList size={20} className="md:w-6 md:h-6" />
                        </div>
                        <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">
                            Assigned <span className="text-indigo-600">Jobs</span>
                        </h1>
                    </div>
                    <div className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full md:hidden">
                        {jobs.length} Active
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-3 md:p-8">
                {/* Desktop Table View */}
                <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8">
                    <div className="overflow-x-auto">
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
                                                onClick={() => { setActiveJob(job); setActiveTab("details"); setPrefilledIssues([]); }}
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
                </div>

                {/* Mobile List View */}
                <div className="md:hidden space-y-3 mb-8">
                    {jobs.map(job => (
                        <div key={job._id} onClick={() => { setActiveJob(job); setActiveTab("details"); }} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm active:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-mono text-[10px] text-slate-400">#{job._id.slice(-6).toUpperCase()}</p>
                                    <p className="font-bold text-slate-800 text-lg flex items-center gap-2">
                                        <Car size={16} className="text-indigo-500" /> {job.booking?.vehicle?.vehicleNumber}
                                    </p>
                                </div>
                                <PriorityBadge priority={job.priority} />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 font-medium">{job.booking?.customer?.name}</p>
                                    <StatusBadge status={job.jobStatus} />
                                </div>
                                <div className="bg-slate-100 p-2 rounded-full">
                                    <ChevronRight size={16} className="text-slate-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Active Job Panel */}
                {activeJob && (
                    <div className="mt-4 md:mt-8 bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {/* Panel Header */}
                        <div className="bg-slate-900 p-5 md:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <Wrench className="text-indigo-400" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-black tracking-tight">{activeJob.booking?.vehicle?.vehicleNumber}</h2>
                                    <p className="text-[10px] md:text-xs text-slate-400 font-medium tracking-wide">Customer: {activeJob.booking?.customer?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveJob(null)} className="w-full md:w-auto text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl transition-all">
                                Close Panel
                            </button>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex overflow-x-auto scrollbar-hide bg-slate-50 border-b border-slate-100 px-2 sticky top-[72px] md:top-[88px] z-10">
                            <TabButton label="Overview" tab="details" icon={<Info size={14}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Inspect" tab="inspection" icon={<Car size={14}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Estimate" tab="estimate" icon={<Calculator size={14}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Status" tab="status" icon={<Settings size={14}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                        </div>

                        <div className="p-4 md:p-10">
                            {activeTab === "details" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                                    <DetailItem label="Service Type" value={activeJob.booking?.serviceType} />
                                    <DetailItem label="Customer Name" value={activeJob.booking?.customer?.name} />
                                    <DetailItem label="Priority Level" value={activeJob.priority} />
                                    <DetailItem label="Current Status" value={activeJob.jobStatus} />
                                </div>
                            )}
                            
                            {activeTab === "inspection" && (
                                <InnerInspectionForm 
                                    jobId={activeJob._id} 
                                    onComplete={handleInspectionComplete} 
                                />
                            )}

                            {activeTab === "estimate" && (
                                <EstimateForm 
                                    jobId={activeJob._id} 
                                    prefilledIssues={prefilledIssues} 
                                />
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

function EstimateForm({ jobId, prefilledIssues }) {
    const [items, setItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (prefilledIssues && prefilledIssues.length > 0) {
            const mappedItems = prefilledIssues.map(issue => ({
                issueTitle: issue.title,
                description: issue.description,
                labourCharge: 0,
                partsCost: 0,
                total: 0
            }));
            setItems(mappedItems);
        }
    }, [prefilledIssues]);

    const subTotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subTotal * 0.18; // Updated to 18% (Standard GST)
    const grandTotal = subTotal + tax;

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const saveEstimate = async () => {
        if (items.length === 0) return alert("Complete inspection first to generate items.");
        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/jobManagement/estimate/${jobId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    job: jobId,
                    items: items, 
                    tax: tax,
                    grandTotal: grandTotal 
                })
            });
            if (res.ok) alert("Estimate Submitted Successfully");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <AlertCircle className="text-slate-300 mb-4" size={48} />
                <h3 className="text-lg font-black text-slate-800">No Inspection Data Found</h3>
                <p className="text-slate-500 text-sm max-w-xs mt-2">Please complete the "Inspect" tab first to pull identified issues into this estimate.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* List Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="p-4 text-left">Identified Issue</th>
                                <th className="p-4 text-right">Labour (₹)</th>
                                <th className="p-4 text-right">Parts (₹)</th>
                                <th className="p-4 text-right">Line Total</th>
                                <th className="p-4 text-center"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item, i) => (
                                <tr key={i} className="bg-white hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-700">{item.issueTitle}</div>
                                        <div className="text-[10px] text-slate-400 truncate max-w-[200px]">{item.description}</div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <input 
                                            type="number" 
                                            className="w-24 text-right p-2 rounded-lg bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white outline-none font-mono font-bold transition-all"
                                            value={item.labourCharge}
                                            placeholder="0"
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                const newItems = [...items];
                                                newItems[i].labourCharge = val;
                                                newItems[i].total = val + newItems[i].partsCost;
                                                setItems(newItems);
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 text-right">
                                        <input 
                                            type="number" 
                                            className="w-24 text-right p-2 rounded-lg bg-slate-50 border border-transparent focus:border-indigo-500 focus:bg-white outline-none font-mono font-bold transition-all"
                                            value={item.partsCost}
                                            placeholder="0"
                                            onChange={(e) => {
                                                const val = parseFloat(e.target.value) || 0;
                                                const newItems = [...items];
                                                newItems[i].partsCost = val;
                                                newItems[i].total = val + newItems[i].labourCharge;
                                                setItems(newItems);
                                            }}
                                        />
                                    </td>
                                    <td className="p-4 text-right font-black text-indigo-600 text-base">
                                        ₹{item.total.toLocaleString('en-IN')}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-rose-500 transition-colors p-2">
                                            <X size={18}/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Footer / Total */}
                <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="flex gap-8">
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">Subtotal</p>
                            <p className="text-lg font-bold">₹{subTotal.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-center sm:text-left">
                            <p className="text-[10px] font-black uppercase opacity-50 tracking-widest">GST (18%)</p>
                            <p className="text-lg font-bold">₹{tax.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-center sm:text-left border-l border-white/10 pl-8">
                            <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Grand Total</p>
                            <p className="text-2xl font-black">₹{grandTotal.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <button onClick={saveEstimate} disabled={isSubmitting} className="w-full sm:w-auto bg-indigo-600 px-8 py-4 rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-900/20">
                        {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Receipt size={18}/>} 
                        <span>Send Final Estimate</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function InnerInspectionForm({ jobId, onComplete }) {
    const [issues, setIssues] = useState([]);
    const [input, setInput] = useState({ title: "", description: "" });
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addIssue = () => {
        if (input.title.trim()) {
            setIssues([...issues, { ...input, description: input.description || "No specific details provided" }]);
            setInput({ title: "", description: "" });
        }
    };

    const removeIssue = (index) => {
        setIssues(issues.filter((_, i) => i !== index));
    };

    const saveInspection = async () => {
        if (issues.length === 0) return alert("Please list at least one issue found");
        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/inspectionReport/save/${jobId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    job: jobId,
                    issuesFound: issues, 
                    remarks 
                })
            });
            if (res.ok) {
                alert("Inspection Report Saved Successfully!");
                onComplete(issues);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">Log Findings</label>
                <div className="flex flex-col gap-2">
                    <input
                        value={input.title}
                        onChange={e => setInput({...input, title: e.target.value})}
                        placeholder="Issue Title (e.g. Brake Wear)"
                        className="w-full border border-slate-200 p-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-500"
                    />
                    <div className="flex gap-2">
                        <input
                            value={input.description}
                            onChange={e => setInput({...input, description: e.target.value})}
                            placeholder="Detailed description..."
                            className="flex-1 border border-slate-200 p-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-500"
                        />
                        <button onClick={addIssue} className="bg-slate-900 text-white px-4 rounded-xl hover:bg-slate-800 transition-all">
                            <Plus size={18}/>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4">
                    {issues.map((issue, index) => (
                        <div key={index} className="flex justify-between items-start bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <div>
                                <p className="text-sm font-black text-indigo-900">{issue.title}</p>
                                <p className="text-xs text-indigo-600/70 font-medium">{issue.description}</p>
                            </div>
                            <button onClick={() => removeIssue(index)} className="text-indigo-300 hover:text-rose-500 p-1">
                                <X size={18}/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">General Remarks</label>
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Summary of vehicle condition..."
                    rows="3"
                    className="w-full border border-slate-200 p-3 rounded-xl focus:border-indigo-500 outline-none transition-all resize-none text-sm font-medium"
                />
            </div>

            <button
                onClick={saveInspection}
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16} />}
                {isSubmitting ? "Uploading..." : "Submit Inspection Report"}
            </button>
        </div>
    );
}

// --- UI HELPERS ---
function PriorityBadge({ priority }) {
    const styles = priority === "High" ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-amber-50 text-amber-600 ring-amber-100";
    return <span className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] font-black uppercase tracking-tighter ring-1 ${styles}`}>{priority}</span>;
}

function StatusBadge({ status }) {
    const colors = { "Completed": "bg-emerald-50 text-emerald-600 ring-emerald-100", "Working": "bg-blue-50 text-blue-600 ring-blue-100", "Ready Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-100" };
    const style = colors[status] || "bg-slate-100 text-slate-500 ring-slate-200";
    return <span className={`px-2 py-0.5 rounded text-[9px] md:text-[10px] font-black uppercase tracking-tighter ring-1 ${style}`}>{status}</span>;
}

function TabButton({ label, tab, icon, activeTab, setActiveTab }) {
    const isActive = activeTab === tab;
    return (
        <button 
            onClick={() => setActiveTab(tab)} 
            className={`flex items-center gap-2 px-4 md:px-6 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${isActive ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-600"}`}
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
            alert("Status Updated");
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100">
            <div className="flex-1 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Set Milestone</p>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none appearance-none">
                    <option>Assigned</option>
                    <option>Inspection</option>
                    <option>Waiting Approval</option>
                    <option>Working</option>
                    <option>Completed</option>
                    <option>Ready Delivery</option>
                </select>
            </div>
            <button onClick={updateStatus} disabled={loading} className="w-full md:w-auto md:mt-6 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} Update Status
            </button>
        </div>
    );
}

export default AssignedJob;