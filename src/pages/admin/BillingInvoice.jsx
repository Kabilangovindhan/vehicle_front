import React, { useEffect, useState } from "react";
import { Receipt, X, Edit3, Save, Printer, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BillingInvoice() {
    const [billingQueue, setBillingQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEstimate, setSelectedEstimate] = useState(null);

    useEffect(() => {
        fetchBillingQueue();
    }, []);

    const fetchBillingQueue = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/adminBillingInvoice/billing-queue");
            const data = await res.json();
            setBillingQueue(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateInvoice = async (jobId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/adminBillingInvoice/invoice/${jobId}`);
            const data = await res.json();
            if (res.ok) {
                setSelectedEstimate(data);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl font-black tracking-tight">Billing Queue</h1>
                    <p className="text-slate-500 text-sm">Manage pending invoices and finalize customer billing.</p>
                </header>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                    {billingQueue.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400">No pending jobs in the queue.</p>
                        </div>
                    ) : (
                        billingQueue.map(job => (
                            <div key={job._id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                        <Receipt size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg leading-tight uppercase tracking-wide">
                                            {job.booking?.vehicle?.vehicleNumber}
                                        </p>
                                        <p className="text-sm text-slate-500 font-medium">{job.booking?.customer?.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleCreateInvoice(job._id)}
                                    className="w-full sm:w-auto bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    BILL NOW
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedEstimate && (
                    <InvoiceModal
                        estimate={selectedEstimate}
                        onClose={() => setSelectedEstimate(null)}
                        onRefresh={fetchBillingQueue}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function InvoiceModal({ estimate, onClose, onRefresh }) {
    const [formData, setFormData] = useState(estimate);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = Number(value);
        updatedItems[index].total = updatedItems[index].labourCharge + updatedItems[index].partsCost;
        const subTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
        const tax = Math.round(subTotal * 0.18);

        setFormData({
            ...formData,
            items: updatedItems,
            tax,
            grandTotal: subTotal + tax
        });
    };

    const handleSaveChanges = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/adminBillingInvoice/invoice/update/${formData._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: formData.items })
            });
            const data = await res.json();
            if (res.ok) {
                setFormData(data);
                setIsEditing(false);
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleConfirmBill = async () => {
        if (!window.confirm("Confirm generation of this invoice? Payment will be marked as Pending.")) return;
        setIsSubmitting(true);
        try {
            const res = await fetch("http://localhost:5000/api/adminBillingInvoice/confirm-bill", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    jobId: formData.job._id,
                    estimateId: formData._id,
                    tax: formData.tax,
                    grandTotal: formData.grandTotal
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert("✅ Invoice Created (Pending Payment)");
                onRefresh();
                onClose();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error finalizing bill");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Final Invoice</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Job ID: {formData._id?.slice(-6)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
                    <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white grid grid-cols-2 gap-4 shadow-lg">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Customer</p>
                            <p className="font-bold text-lg leading-tight">{formData.job?.booking?.customer?.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Vehicle No.</p>
                            <p className="font-bold text-lg text-emerald-400 tracking-wider leading-tight">{formData.job?.booking?.vehicle?.vehicleNumber}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-end px-1">
                        <h4 className="font-black text-slate-900 text-sm">Services & Parts</h4>
                        <button onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)} className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all border ${isEditing ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                            {isEditing ? <><Save size={14} /> Save Changes</> : <><Edit3 size={14} /> Edit Charges</>}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {formData.items.map((item, i) => (
                            <div key={i} className="group border border-slate-200 rounded-2xl p-4 bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="font-bold text-slate-800">{item.issueTitle}</span>
                                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-1 rounded-md uppercase">Item {i + 1}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1">LABOUR CHARGE</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                            <input type="number" disabled={!isEditing} value={item.labourCharge} onChange={(e) => handleItemChange(i, "labourCharge", e.target.value)} className="w-full pl-7 pr-3 py-2 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-70 font-medium" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400 ml-1">PARTS COST</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
                                            <input type="number" disabled={!isEditing} value={item.partsCost} onChange={(e) => handleItemChange(i, "partsCost", e.target.value)} className="w-full pl-7 pr-3 py-2 bg-slate-50 border-transparent border rounded-xl focus:bg-white focus:border-emerald-500 transition-all outline-none disabled:opacity-70 font-medium" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-dashed border-slate-100 text-right">
                                    <span className="text-xs text-slate-400 font-medium mr-2">Subtotal:</span>
                                    <span className="font-black text-slate-900">₹{item.total.toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md">
                    <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-sm text-slate-500 font-medium px-1">
                            <span>GST (18%)</span>
                            <span>₹{formData.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center px-1">
                            <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Total Amount</span>
                            <span className="text-2xl font-black text-emerald-600">₹{formData.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleConfirmBill}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white rounded-2xl py-3.5 font-black hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-slate-200 disabled:bg-slate-400"
                    >
                        {isSubmitting ? "Processing..." : "CONFIRM & BILL"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default BillingInvoice;