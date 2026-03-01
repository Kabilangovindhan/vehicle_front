import React, { useEffect, useState } from "react";
import { Receipt, X, Edit3, Save, Printer, CheckCircle2, AlertCircle, FileText, Clock, User, Truck, Hash, Calendar, DollarSign, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function BillingInvoice() {

    const [billingQueue, setBillingQueue] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEstimate, setSelectedEstimate] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredQueue = billingQueue.filter(job =>
        job.booking?.vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.booking?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-6 w-6 rounded-full bg-emerald-600/20 animate-pulse"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20">
                            <Receipt className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Billing Queue</h1>
                            <p className="text-slate-500 text-sm mt-1">Manage and process pending customer invoices</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Search by vehicle number or customer name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-96 px-4 py-3 pl-11 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                        />
                        <FileText className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Pending Invoices</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">{billingQueue.length}</p>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-xl">
                                <Clock className="text-amber-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Today's Queue</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">
                                    {billingQueue.filter(job => new Date(job.createdAt).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 font-medium">Est. Revenue</p>
                                <p className="text-3xl font-bold text-slate-900 mt-1">
                                    ₹{billingQueue.reduce((acc, job) => acc + (job.totalAmount || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <DollarSign className="text-emerald-600" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Queue Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQueue.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                            <Receipt className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-400 text-lg font-medium">No pending jobs in the queue</p>
                            <p className="text-slate-400 text-sm mt-1">New jobs will appear here when ready for billing</p>
                        </div>
                    ) : (
                        filteredQueue.map(job => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                            >
                                <div className="p-5">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                                <Receipt className="text-slate-600 group-hover:text-emerald-600 transition-colors" size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg text-slate-900">{job.booking?.vehicle?.vehicleNumber}</p>
                                                <p className="text-sm text-slate-500">{job.booking?.vehicle?.model || 'Vehicle Model'}</p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
                                            Pending
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <User size={16} className="text-slate-400" />
                                            <span>{job.booking?.customer?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Hash size={16} className="text-slate-400" />
                                            <span>Job #{job._id?.slice(-8).toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Calendar size={16} className="text-slate-400" />
                                            <span>{new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                        <div>
                                            <p className="text-xs text-slate-400 font-medium">Estimate</p>
                                            <p className="font-bold text-slate-900">₹{(job.totalAmount || 0).toLocaleString()}</p>
                                        </div>
                                        <button
                                            onClick={() => handleCreateInvoice(job._id)}
                                            className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                                        >
                                            <Receipt size={16} />
                                            Process
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
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
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                                <Receipt className="text-emerald-600" size={20} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Invoice Preview</h2>
                                <p className="text-xs text-slate-500 font-medium">INV-{formData._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-6 space-y-6">
                        {/* Customer Info Card */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs font-medium text-slate-400 mb-1">Customer Details</p>
                                    <p className="font-semibold text-lg">{formData.job?.booking?.customer?.name}</p>
                                    <p className="text-sm text-slate-400 mt-1">{formData.job?.booking?.customer?.phone || 'Phone number not available'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-slate-400 mb-1">Vehicle Information</p>
                                    <p className="font-semibold text-lg text-emerald-400">{formData.job?.booking?.vehicle?.vehicleNumber}</p>
                                    <p className="text-sm text-slate-400 mt-1">{formData.job?.booking?.vehicle?.model || 'Model not specified'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Bar */}
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900">Invoice Items</h3>
                            <button
                                onClick={() => isEditing ? handleSaveChanges() : setIsEditing(true)}
                                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${isEditing
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {isEditing ? <><Save size={16} /> Save Changes</> : <><Edit3 size={16} /> Edit Items</>}
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="space-y-4">
                            {formData.items.map((item, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-slate-900">{item.issueTitle}</span>
                                        <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                                            Item {i + 1}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                Labour Charge
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                                <input
                                                    type="number"
                                                    disabled={!isEditing}
                                                    value={item.labourCharge}
                                                    onChange={(e) => handleItemChange(i, "labourCharge", e.target.value)}
                                                    className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${isEditing
                                                        ? "bg-white border-slate-300 focus:border-emerald-500"
                                                        : "bg-slate-100 border-slate-200"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                Parts Cost
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                                                <input
                                                    type="number"
                                                    disabled={!isEditing}
                                                    value={item.partsCost}
                                                    onChange={(e) => handleItemChange(i, "partsCost", e.target.value)}
                                                    className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${isEditing
                                                        ? "bg-white border-slate-300 focus:border-emerald-500"
                                                        : "bg-slate-100 border-slate-200"
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex justify-end">
                                        <span className="text-sm">
                                            <span className="text-slate-500">Subtotal: </span>
                                            <span className="font-semibold text-slate-900">₹{item.total.toLocaleString()}</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-900">₹{(formData.grandTotal - formData.tax).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">GST (18%)</span>
                            <span className="font-medium text-slate-900">₹{formData.tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                            <span className="font-semibold text-slate-900">Total Amount</span>
                            <span className="text-2xl font-bold text-emerald-600">₹{formData.grandTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleConfirmBill}
                            disabled={isSubmitting}
                            className="flex-1 bg-emerald-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-700 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20"
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm & Generate Invoice'}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-white transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default BillingInvoice;