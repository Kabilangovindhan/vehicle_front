import React, { useEffect, useState } from "react";
import { 
    Loader2, Wrench, Car, 
    ClipboardList, CheckCircle2, 
    Info, Settings, Plus, X, Save,
    Calculator, Receipt 
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
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 md:p-8">
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
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
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter transition-all shadow-md"
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

                {activeJob && (
                    <div className="mt-8 bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
                        <div className="bg-slate-900 p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                                    <Wrench className="text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">{activeJob.booking?.vehicle?.vehicleNumber}</h2>
                                    <p className="text-xs text-slate-400 font-medium tracking-wide">Customer: {activeJob.booking?.customer?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveJob(null)} className="text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest border border-slate-700 px-4 py-2 rounded-xl transition-all">
                                Close Panel
                            </button>
                        </div>

                        <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-100 px-2">
                            <TabButton label="Overview" tab="details" icon={<Info size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Inspection" tab="inspection" icon={<Car size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
                            <TabButton label="Estimate" tab="estimate" icon={<Calculator size={16}/>} activeTab={activeTab} setActiveTab={setActiveTab} />
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
                                <InnerInspectionForm jobId={activeJob._id} />
                            )}

                            {activeTab === "estimate" && (
                                <EstimateForm jobId={activeJob._id} />
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

// --- LOGIC UPDATED TO MATCH estimateSchema ---
function EstimateForm({ jobId }) {
    const [items, setItems] = useState([]); // Array of {issueTitle, description, labourCharge, partsCost, total}
    const [form, setForm] = useState({ title: "", desc: "", labor: 0, parts: 0 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const subTotal = items.reduce((sum, item) => sum + item.total, 0);
    const tax = subTotal * 0.10; 
    const grandTotal = subTotal + tax;

    const addItem = () => {
        if (form.title.trim()) {
            const labor = parseFloat(form.labor) || 0;
            const parts = parseFloat(form.parts) || 0;
            const newItem = {
                issueTitle: form.title,
                description: form.desc || "Standard Service",
                labourCharge: labor,
                partsCost: parts,
                total: labor + parts
            };
            setItems([...items, newItem]);
            setForm({ title: "", desc: "", labor: 0, parts: 0 });
        }
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const saveEstimate = async () => {
        if (items.length === 0) return alert("Add items first");
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

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <input
                    placeholder="Item/Issue Title"
                    className="p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                />
                <input
                    placeholder="Short Description"
                    className="p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                    value={form.desc}
                    onChange={e => setForm({...form, desc: e.target.value})}
                />
                <input
                    type="number" placeholder="Labor Charge"
                    className="p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                    value={form.labor}
                    onChange={e => setForm({...form, labor: e.target.value})}
                />
                <div className="flex gap-2">
                    <input
                        type="number" placeholder="Parts Cost"
                        className="flex-1 p-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500"
                        value={form.parts}
                        onChange={e => setForm({...form, parts: e.target.value})}
                    />
                    <button onClick={addItem} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800"><Plus/></button>
                </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            <th className="p-4 text-left">Item</th>
                            <th className="p-4 text-right">Labor</th>
                            <th className="p-4 text-right">Parts</th>
                            <th className="p-4 text-right">Total</th>
                            <th className="p-4 text-center"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {items.map((item, i) => (
                            <tr key={i}>
                                <td className="p-4 font-bold text-slate-700">{item.issueTitle}</td>
                                <td className="p-4 text-right font-mono">${item.labourCharge}</td>
                                <td className="p-4 text-right font-mono">${item.partsCost}</td>
                                <td className="p-4 text-right font-bold text-indigo-600">${item.total}</td>
                                <td className="p-4 text-center"><button onClick={() => removeItem(i)} className="text-rose-400 hover:text-rose-600"><X size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-black uppercase opacity-50">Grand Total (Inc. 10% Tax)</p>
                        <p className="text-2xl font-black">${grandTotal.toFixed(2)}</p>
                    </div>
                    <button onClick={saveEstimate} disabled={isSubmitting} className="bg-indigo-600 px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 hover:bg-indigo-500 transition-all">
                        {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Receipt size={16}/>} Send Estimate
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- LOGIC UPDATED TO MATCH inspectionSchema ---
function InnerInspectionForm({ jobId }) {
    const [issues, setIssues] = useState([]); // Array of {title, description}
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
            if (res.ok) alert("Inspection Report Saved");
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
                        <button onClick={addIssue} className="bg-slate-900 text-white px-4 rounded-xl hover:bg-slate-800 transition-all"><Plus/></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4">
                    {issues.map((issue, index) => (
                        <div key={index} className="flex justify-between items-start bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                            <div>
                                <p className="text-sm font-black text-indigo-900">{issue.title}</p>
                                <p className="text-xs text-indigo-600/70 font-medium">{issue.description}</p>
                            </div>
                            <button onClick={() => removeIssue(index)} className="text-indigo-300 hover:text-rose-500"><X size={18}/></button>
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

// --- UI HELPERS (Unchanged) ---
function PriorityBadge({ priority }) {
    const styles = priority === "High" ? "bg-rose-50 text-rose-600 ring-rose-100" : "bg-amber-50 text-amber-600 ring-amber-100";
    return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ${styles}`}>{priority}</span>;
}

function StatusBadge({ status }) {
    const colors = { "Completed": "bg-emerald-50 text-emerald-600 ring-emerald-100", "Working": "bg-blue-50 text-blue-600 ring-blue-100", "Ready Delivery": "bg-indigo-50 text-indigo-600 ring-indigo-100" };
    const style = colors[status] || "bg-slate-100 text-slate-500 ring-slate-200";
    return <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ring-1 ${style}`}>{status}</span>;
}

function TabButton({ label, tab, icon, activeTab, setActiveTab }) {
    const isActive = activeTab === tab;
    return (
        <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${isActive ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
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
        <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div className="flex-1 w-full">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Set Milestone</p>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 outline-none">
                    <option>Assigned</option>
                    <option>Inspection</option>
                    <option>Waiting Approval</option>
                    <option>Working</option>
                    <option>Completed</option>
                    <option>Ready Delivery</option>
                </select>
            </div>
            <button onClick={updateStatus} disabled={loading} className="w-full md:w-auto mt-6 md:mt-0 bg-emerald-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} Update Status
            </button>
        </div>
    );
}

export default AssignedJob;