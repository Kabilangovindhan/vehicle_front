import React, { useEffect, useState } from "react";
import {
    Receipt, X, FileText, Download, Eye, Calendar,
    Truck, User, DollarSign, CreditCard, CheckCircle2,
    Clock, AlertCircle, Search, Filter, Printer,
    CheckSquare, XSquare, RefreshCw, Phone, Mail,
    MapPin, Calendar as CalendarIcon, Hash, BadgeCheck,
    Shield, UserCheck, Ban, AlertTriangle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function PaymentVerification() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        paid: 0,
        totalAmount: 0,
        pendingAmount: 0,
        paidAmount: 0
    });

    useEffect(() => {
        fetchAllInvoices();
    }, []);

    const fetchAllInvoices = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/paymentVerification/invoices/all`);
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
            calculateStats(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (invoiceData) => {
        const total = invoiceData.length;
        const pending = invoiceData.filter(inv => inv.paymentStatus === 'Pending').length;
        const paid = invoiceData.filter(inv => inv.paymentStatus === 'Paid').length;
        const totalAmount = invoiceData.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
        const pendingAmount = invoiceData.filter(inv => inv.paymentStatus === 'Pending')
            .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
        const paidAmount = invoiceData.filter(inv => inv.paymentStatus === 'Paid')
            .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

        setStats({ total, pending, paid, totalAmount, pendingAmount, paidAmount });
    };

    const handleVerifyPayment = async (invoiceId, status) => {
        try {
            const response = await fetch(`http://localhost:5000/api/paymentVerification/verify-payment/${invoiceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    paymentStatus: status,
                    verifiedBy: sessionStorage.getItem("userId") || "admin",
                    verifiedAt: new Date()
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(`Payment ${status === 'Paid' ? 'verified' : 'rejected'} successfully`);
                fetchAllInvoices(); // Refresh the list
                setSelectedInvoice(null);
            } else {
                alert(data.message || 'Verification failed');
            }
        } catch (error) {
            console.error('Verification error:', error);
            alert('Verification processing failed');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-amber-50 text-amber-700 ring-amber-200',
            'Paid': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
            'Verified': 'bg-blue-50 text-blue-700 ring-blue-200',
            'Rejected': 'bg-rose-50 text-rose-700 ring-rose-200'
        };
        return colors[status] || 'bg-slate-50 text-slate-700 ring-slate-200';
    };

    const getPriorityColor = (amount) => {
        if (amount > 10000) return 'text-rose-600 bg-rose-50';
        if (amount > 5000) return 'text-amber-600 bg-amber-50';
        return 'text-emerald-600 bg-emerald-50';
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.job?.booking?.vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.job?.booking?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.job?.booking?.customer?.phone?.includes(searchTerm);

        const matchesStatus = statusFilter === "all" || invoice.paymentStatus === statusFilter;

        // Date range filter
        let matchesDate = true;
        if (dateRange.from && dateRange.to) {
            const invoiceDate = new Date(invoice.createdAt);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            toDate.setHours(23, 59, 59);
            matchesDate = invoiceDate >= fromDate && invoiceDate <= toDate;
        }

        return matchesSearch && matchesStatus && matchesDate;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Receipt className="h-8 w-8 text-blue-600/40 animate-pulse" />
                        </div>
                    </div>
                    <p className="text-slate-600 font-medium mt-4">Loading payment verification dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                                <Shield className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900">Payment Verification</h1>
                                <p className="text-slate-500 text-sm mt-1">Verify and manage customer payments</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchAllInvoices}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={18} />
                            Refresh
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Total Invoices</span>
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <FileText size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            <p className="text-xs text-slate-500 mt-1">All time invoices</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Pending</span>
                                <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                                    <Clock size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                            <p className="text-xs text-amber-600 font-medium mt-1">₹{stats.pendingAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Verified</span>
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{stats.paid}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">₹{stats.paidAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Total Amount</span>
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">₹{stats.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-1">Across all invoices</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search vehicle, customer, invoice..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                            
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Verified</option>
                                </select>
                            </div>

                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="date"
                                    value={dateRange.from}
                                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input
                                    type="date"
                                    value={dateRange.to}
                                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invoices List */}
                {filteredInvoices.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Receipt size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Invoices Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {searchTerm || statusFilter !== 'all' || dateRange.from
                                ? 'No invoices match your search criteria.'
                                : 'No invoices available for verification.'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredInvoices.map((invoice, index) => (
                            <motion.div
                                key={invoice._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
                            >
                                <div className="p-5">
                                    {/* Invoice Header */}
                                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-xl ${
                                                invoice.paymentStatus === 'Paid' 
                                                    ? 'bg-emerald-50' 
                                                    : 'bg-amber-50'
                                            }`}>
                                                <Receipt className={`${
                                                    invoice.paymentStatus === 'Paid' 
                                                        ? 'text-emerald-600' 
                                                        : 'text-amber-600'
                                                }`} size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-lg text-slate-900">
                                                        INV-{invoice._id?.slice(-8).toUpperCase()}
                                                    </p>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset ${getStatusColor(invoice.paymentStatus)}`}>
                                                        {invoice.paymentStatus}
                                                    </span>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${getPriorityColor(invoice.grandTotal || 0)}`}>
                                                        ₹{invoice.grandTotal?.toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500 flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedInvoice(invoice)}
                                            className="w-full lg:w-auto px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} />
                                            View & Verify
                                        </button>
                                    </div>

                                    {/* Invoice Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                                        <DetailItem
                                            icon={<User size={16} />}
                                            label="Customer"
                                            value={invoice.job?.booking?.customer?.name || 'N/A'}
                                            subValue={invoice.job?.booking?.customer?.phone}
                                        />
                                        <DetailItem
                                            icon={<Truck size={16} />}
                                            label="Vehicle"
                                            value={invoice.job?.booking?.vehicle?.vehicleNumber || 'N/A'}
                                            subValue={invoice.job?.booking?.vehicle?.model}
                                        />
                                        <DetailItem
                                            icon={<CreditCard size={16} />}
                                            label="Payment Method"
                                            value={invoice.paymentMethod || 'Not selected'}
                                            status={invoice.paymentMethod ? 'info' : 'warning'}
                                        />
                                        <DetailItem
                                            icon={<DollarSign size={16} />}
                                            label="Amount"
                                            value={`₹${invoice.grandTotal?.toLocaleString() || '0'}`}
                                            highlight
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <VerificationModal
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                        onVerify={handleVerifyPayment}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Enhanced Detail Item Component
function DetailItem({ icon, label, value, subValue, highlight = false, status }) {
    const statusColors = {
        info: 'text-blue-600',
        warning: 'text-amber-600',
        success: 'text-emerald-600'
    };

    return (
        <div className="flex items-start gap-2">
            <div className="text-slate-400 mt-0.5">{icon}</div>
            <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : status ? statusColors[status] : 'text-slate-700'}`}>
                    {value}
                </p>
                {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
            </div>
        </div>
    );
}

// Verification Modal Component
function VerificationModal({ invoice, onClose, onVerify }) {
    const [verificationNotes, setVerificationNotes] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleVerify = (status) => {
        setIsProcessing(true);
        onVerify(invoice._id, status);
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
                className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <Shield size={24} />
                            <div>
                                <h2 className="text-xl font-bold">Payment Verification</h2>
                                <p className="text-sm text-blue-100">INV-{invoice._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-blue-500 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${
                            invoice.paymentStatus === 'Paid'
                                ? 'bg-emerald-50'
                                : 'bg-amber-50'
                        }`}>
                            {invoice.paymentStatus === 'Paid' ? (
                                <CheckCircle2 className="text-emerald-600" size={24} />
                            ) : (
                                <Clock className="text-amber-600" size={24} />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                    Current Status: {invoice.paymentStatus}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {invoice.paymentStatus === 'Paid'
                                        ? 'This payment has been verified and completed.'
                                        : 'This payment is pending verification.'}
                                </p>
                            </div>
                            {invoice.paymentMethod && (
                                <div className="px-3 py-1 bg-white rounded-lg border border-slate-200">
                                    <span className="text-xs font-medium text-slate-500">Method: </span>
                                    <span className="text-sm font-semibold text-slate-700">{invoice.paymentMethod}</span>
                                </div>
                            )}
                        </div>

                        {/* Customer Information Card */}
                        <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border border-slate-200">
                            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <User size={18} className="text-blue-600" />
                                Customer Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                                    <User size={20} className="text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Name</p>
                                        <p className="font-medium text-slate-900">{invoice.job?.booking?.customer?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100">
                                    <Phone size={20} className="text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Phone</p>
                                        <p className="font-medium text-slate-900">{invoice.job?.booking?.customer?.phone || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 md:col-span-2">
                                    <Mail size={20} className="text-slate-400" />
                                    <div>
                                        <p className="text-xs text-slate-500">Email</p>
                                        <p className="font-medium text-slate-900">{invoice.job?.booking?.customer?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle and Service Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                title="Vehicle Details"
                                icon={<Truck size={18} />}
                                items={[
                                    { label: 'Vehicle Number', value: invoice.job?.booking?.vehicle?.vehicleNumber },
                                    { label: 'Model', value: invoice.job?.booking?.vehicle?.model },
                                    { label: 'Brand', value: invoice.job?.booking?.vehicle?.brand }
                                ]}
                            />
                            <InfoCard
                                title="Service Details"
                                icon={<FileText size={18} />}
                                items={[
                                    { label: 'Service Type', value: invoice.job?.booking?.serviceType },
                                    { label: 'Service Date', value: invoice.job?.booking?.serviceDate ? new Date(invoice.job?.booking?.serviceDate).toLocaleDateString() : 'N/A' },
                                    { label: 'Time Slot', value: invoice.job?.booking?.timeSlot }
                                ]}
                            />
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-slate-900 rounded-xl p-5 text-white">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <DollarSign size={18} className="text-emerald-400" />
                                Payment Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span>₹{(invoice.grandTotal - (invoice.tax || 0)).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">GST (18%)</span>
                                    <span>₹{invoice.tax?.toLocaleString() || '0'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-700">
                                    <span>Grand Total</span>
                                    <span className="text-emerald-400">₹{invoice.grandTotal?.toLocaleString()}</span>
                                </div>
                                {invoice.paymentMethod && (
                                    <div className="mt-2 pt-2 border-t border-slate-700">
                                        <p className="text-sm text-slate-400">Payment Method: <span className="font-medium text-emerald-400">{invoice.paymentMethod}</span></p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Invoice Timeline */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <Clock size={18} className="text-blue-600" />
                                Invoice Timeline
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium">Created: </span>
                                        {new Date(invoice.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="text-sm text-slate-600">
                                        <span className="font-medium">Last Updated: </span>
                                        {new Date(invoice.updatedAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verification Notes */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Verification Notes (Optional)
                            </label>
                            <textarea
                                value={verificationNotes}
                                onChange={(e) => setVerificationNotes(e.target.value)}
                                placeholder="Add any notes about this verification..."
                                rows="3"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Footer with Verification Buttons */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {invoice.paymentStatus !== 'Paid' && (
                            <>
                                <button
                                    onClick={() => handleVerify('Paid')}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={18} />
                                            Verify Payment
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleVerify('Rejected')}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-3 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-all disabled:bg-slate-400 flex items-center justify-center gap-2"
                                >
                                    <Ban size={18} />
                                    Reject Payment
                                </button>
                            </>
                        )}
                        {invoice.paymentStatus === 'Paid' && (
                            <div className="flex-1 px-4 py-3 bg-emerald-100 text-emerald-700 font-semibold rounded-xl flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} />
                                Already Verified
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="px-4 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// Info Card Component
function InfoCard({ title, icon, items }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white rounded-lg text-blue-600">
                    {icon}
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    item.value && (
                        <div key={index} className="text-sm flex justify-between">
                            <span className="text-slate-500">{item.label}:</span>
                            <span className="font-medium text-slate-900">{item.value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default PaymentVerification;