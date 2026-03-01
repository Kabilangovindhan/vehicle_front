import React, { useEffect, useState } from "react";
import {
    Receipt, X, FileText, Download, Eye, Calendar,
    Truck, User, DollarSign, CreditCard, CheckCircle2,
    Clock, AlertCircle, Search, Filter, Printer,
    Wallet, Smartphone, CreditCard as CardIcon, IndianRupee
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CustomerInvoice() {

    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const customerId = sessionStorage.getItem("phone"); // from login

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        console.log(customerId)
        try {
            const res = await fetch(`http://localhost:5000/api/customerInvoice/invoices/${customerId}`);
            const data = await res.json();
            setInvoices(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentSuccess = (updatedInvoice) => {
        // Update the invoice in the list
        setInvoices(prevInvoices => 
            prevInvoices.map(inv => 
                inv._id === updatedInvoice._id ? updatedInvoice : inv
            )
        );
        // Close the modal
        setSelectedInvoice(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-amber-50 text-amber-700 ring-amber-200',
            'Paid': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
            'Overdue': 'bg-rose-50 text-rose-700 ring-rose-200',
            'Cancelled': 'bg-slate-50 text-slate-700 ring-slate-200'
        };
        return colors[status] || 'bg-slate-50 text-slate-700 ring-slate-200';
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch =
            invoice.job?.booking?.vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice._id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || invoice.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
    const paidAmount = invoices.filter(inv => inv.paymentStatus === 'Paid')
        .reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-emerald-600/20 animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-slate-600 font-medium mt-4">Loading your invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-emerald-600 rounded-xl shadow-lg shadow-emerald-600/20">
                            <Receipt className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">My Invoices</h1>
                            <p className="text-slate-500 text-sm mt-1">View and manage your service invoices</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Total Invoices</span>
                                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                    <FileText size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Total Amount</span>
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">₹{totalAmount.toLocaleString()}</p>
                        </div>

                        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-slate-600">Paid Amount</span>
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <CheckCircle2 size={18} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900">₹{paidAmount.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by vehicle number or invoice ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Overdue">Overdue</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
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
                            {searchTerm || statusFilter !== 'all'
                                ? 'No invoices match your search criteria.'
                                : 'You don\'t have any invoices yet.'}
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
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-emerald-50 rounded-xl">
                                                <Receipt className="text-emerald-600" size={22} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-bold text-lg text-slate-900">
                                                        INV-{invoice._id?.slice(-8).toUpperCase()}
                                                    </p>
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ring-1 ring-inset ${getStatusColor(invoice.paymentStatus)}`}>
                                                        {invoice.paymentStatus}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
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
                                            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                                        >
                                            <Eye size={16} />
                                            View Details
                                        </button>
                                    </div>

                                    {/* Invoice Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                                        <DetailItem
                                            icon={<Truck size={16} />}
                                            label="Vehicle"
                                            value={invoice.job?.booking?.vehicle?.vehicleNumber || 'N/A'}
                                        />
                                        <DetailItem
                                            icon={<User size={16} />}
                                            label="Service Type"
                                            value={invoice.job?.booking?.serviceType || 'N/A'}
                                        />
                                        <DetailItem
                                            icon={<DollarSign size={16} />}
                                            label="Subtotal"
                                            value={`₹${(invoice.grandTotal - (invoice.tax || 0)).toLocaleString()}`}
                                        />
                                        <DetailItem
                                            icon={<CreditCard size={16} />}
                                            label="Grand Total"
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

            {/* Invoice Modal */}
            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceModal
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Detail Item Component
function DetailItem({ icon, label, value, highlight = false }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-slate-400">{icon}</div>
            <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase">{label}</p>
                <p className={`text-sm font-semibold ${highlight ? 'text-emerald-600' : 'text-slate-700'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

// Payment Options Component
function PaymentOptions({ invoice, onPaymentComplete, onCancel }) {
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const paymentMethods = [
        { id: 'Cash', name: 'Cash', icon: Wallet, color: 'emerald' },
        { id: 'UPI', name: 'UPI', icon: Smartphone, color: 'blue' },
        { id: 'Card', name: 'Card', icon: CardIcon, color: 'purple' },
    ];

    const handlePayment = async () => {
        setIsProcessing(true);
        
        // Validate based on method
        if (selectedMethod === 'UPI' && !upiId) {
            alert('Please enter UPI ID');
            setIsProcessing(false);
            return;
        }
        
        if (selectedMethod === 'Card') {
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                alert('Please fill all card details');
                setIsProcessing(false);
                return;
            }
            if (cardNumber.replace(/\s/g, '').length !== 16) {
                alert('Please enter valid 16-digit card number');
                setIsProcessing(false);
                return;
            }
        }

        try {
            const response = await fetch(`http://localhost:5000/api/customerInvoice/pay/${invoice._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethod: selectedMethod, // Now sending "Cash", "UPI", or "Card"
                    paymentDetails: selectedMethod === 'UPI' ? { upiId } : 
                                   selectedMethod === 'Card' ? { 
                                       cardNumber: cardNumber.slice(-4), // Only store last 4 digits
                                       cardHolderName: cardName 
                                   } : {}
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert(`Payment successful via ${selectedMethod}`);
                onPaymentComplete(data.invoice);
            } else {
                alert(data.message || 'Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0; i < match.length; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.slice(0, 2) + '/' + v.slice(2, 4);
        }
        return v;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
            <div className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 border-b border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wallet className="text-emerald-600" size={20} />
                        <h3 className="font-semibold text-slate-900">Select Payment Method</h3>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <X size={18} className="text-slate-500" />
                    </button>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                    Amount to pay: <span className="font-bold text-emerald-600">₹{invoice.grandTotal?.toLocaleString()}</span>
                </p>
            </div>

            <div className="p-4">
                {/* Payment Method Selection */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;
                        const colorClasses = {
                            emerald: isSelected ? 'bg-emerald-600 text-white border-emerald-600' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50',
                            blue: isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-200 text-blue-600 hover:bg-blue-50',
                            purple: isSelected ? 'bg-purple-600 text-white border-purple-600' : 'border-purple-200 text-purple-600 hover:bg-purple-50'
                        };

                        return (
                            <button
                                key={method.id}
                                onClick={() => setSelectedMethod(method.id)}
                                className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${colorClasses[method.color]}`}
                            >
                                <Icon size={24} />
                                <span className="text-xs font-medium">{method.name}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Payment Details Forms */}
                <AnimatePresence mode="wait">
                    {selectedMethod === 'Cash' && (
                        <motion.div
                            key="cash"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <div className="flex items-center gap-3">
                                    <IndianRupee className="text-amber-600" size={24} />
                                    <div>
                                        <p className="font-medium text-amber-800">Cash Payment</p>
                                        <p className="text-sm text-amber-600">Pay ₹{invoice.grandTotal?.toLocaleString()} in cash at our service center</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {selectedMethod === 'UPI' && (
                        <motion.div
                            key="upi"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Enter UPI ID
                                    </label>
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="example@upi"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-xs text-blue-600">
                                        Enter your UPI ID to complete the payment. You'll receive a payment request on your UPI app.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {selectedMethod === 'Card' && (
                        <motion.div
                            key="card"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="JOHN DOE"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 uppercase"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Expiry
                                        </label>
                                        <input
                                            type="text"
                                            value={cardExpiry}
                                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            maxLength="5"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="password"
                                            value={cardCvv}
                                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                            placeholder="123"
                                            maxLength="3"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Payment Button */}
                {selectedMethod && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4"
                    >
                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
                                isProcessing 
                                    ? 'bg-slate-400 cursor-not-allowed' 
                                    : selectedMethod === 'Cash'
                                        ? 'bg-emerald-600 hover:bg-emerald-700'
                                        : selectedMethod === 'UPI'
                                            ? 'bg-blue-600 hover:bg-blue-700'
                                            : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                `Pay ₹${invoice.grandTotal?.toLocaleString()} via ${selectedMethod}`
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

// Invoice Modal Component
function InvoiceModal({ invoice, onClose, onPaymentSuccess }) {
    const [isPrinting, setIsPrinting] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);
        window.print();
        setTimeout(() => setIsPrinting(false), 1000);
    };

    const handlePaymentComplete = (updatedInvoice) => {
        onPaymentSuccess(updatedInvoice);
    };

    const canPay = invoice.paymentStatus !== 'Paid' && invoice.paymentStatus !== 'Cancelled';

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
                className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <Receipt size={24} />
                            <div>
                                <h2 className="text-xl font-bold">Invoice Details</h2>
                                <p className="text-sm text-emerald-100">INV-{invoice._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
                                disabled={isPrinting}
                            >
                                <Printer size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-xl flex items-center gap-3 ${
                            invoice.paymentStatus === 'Paid'
                                ? 'bg-emerald-50'
                                : invoice.paymentStatus === 'Pending'
                                    ? 'bg-amber-50'
                                    : 'bg-rose-50'
                        }`}>
                            {invoice.paymentStatus === 'Paid' ? (
                                <CheckCircle2 className="text-emerald-600" size={24} />
                            ) : invoice.paymentStatus === 'Pending' ? (
                                <Clock className="text-amber-600" size={24} />
                            ) : (
                                <AlertCircle className="text-rose-600" size={24} />
                            )}
                            <div className="flex-1">
                                <p className="font-semibold text-slate-900">
                                    Payment Status: {invoice.paymentStatus}
                                </p>
                                <p className="text-sm text-slate-600">
                                    {invoice.paymentStatus === 'Paid'
                                        ? 'This invoice has been paid successfully.'
                                        : invoice.paymentStatus === 'Pending'
                                            ? 'Payment is pending. Please complete the payment.'
                                            : 'This invoice has been cancelled.'}
                                </p>
                            </div>
                            {canPay && !showPayment && (
                                <button
                                    onClick={() => setShowPayment(true)}
                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    Make Payment
                                </button>
                            )}
                        </div>

                        {/* Payment Options */}
                        {showPayment && (
                            <PaymentOptions
                                invoice={invoice}
                                onPaymentComplete={handlePaymentComplete}
                                onCancel={() => setShowPayment(false)}
                            />
                        )}

                        {/* Customer and Vehicle Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                title="Customer Information"
                                icon={<User size={18} />}
                                items={[
                                    { label: 'Name', value: invoice.job?.booking?.customer?.name },
                                    { label: 'Phone', value: invoice.job?.booking?.customer?.phone },
                                    { label: 'Email', value: invoice.job?.booking?.customer?.email }
                                ]}
                            />
                            <InfoCard
                                title="Vehicle Information"
                                icon={<Truck size={18} />}
                                items={[
                                    { label: 'Number', value: invoice.job?.booking?.vehicle?.vehicleNumber },
                                    { label: 'Model', value: invoice.job?.booking?.vehicle?.model },
                                    { label: 'Year', value: invoice.job?.booking?.vehicle?.year }
                                ]}
                            />
                        </div>

                        {/* Service Details */}
                        <InfoCard
                            title="Service Details"
                            icon={<FileText size={18} />}
                            items={[
                                { label: 'Service Type', value: invoice.job?.booking?.serviceType },
                                { label: 'Service Date', value: new Date(invoice.job?.booking?.serviceDate).toLocaleDateString() },
                                { label: 'Time Slot', value: invoice.job?.booking?.timeSlot }
                            ]}
                        />

                        {/* Invoice Items */}
                        {invoice.items && invoice.items.length > 0 && (
                            <div className="bg-slate-50 rounded-xl p-4">
                                <h3 className="font-semibold text-slate-900 mb-3">Invoice Items</h3>
                                <div className="space-y-3">
                                    {invoice.items.map((item, index) => (
                                        <div key={index} className="bg-white rounded-lg p-3 border border-slate-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-slate-900">{item.issueTitle}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-slate-500">Labour:</span>
                                                    <span className="ml-2 font-medium">₹{item.labourCharge}</span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">Parts:</span>
                                                    <span className="ml-2 font-medium">₹{item.partsCost}</span>
                                                </div>
                                                <div className="col-span-2 pt-2 border-t border-slate-100">
                                                    <span className="text-slate-500">Subtotal:</span>
                                                    <span className="ml-2 font-semibold">₹{item.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Payment Summary */}
                        <div className="bg-slate-900 rounded-xl p-4 text-white">
                            <h3 className="font-semibold mb-3">Payment Summary</h3>
                            <div className="space-y-2">
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
                                    <div className="mt-2 pt-2 border-t border-slate-700 text-sm">
                                        <span className="text-slate-400">Payment Method: </span>
                                        <span className="font-medium text-emerald-400 uppercase">{invoice.paymentMethod}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Invoice Dates */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-slate-500">Created Date</p>
                                <p className="font-semibold text-slate-900">
                                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="bg-slate-50 rounded-lg p-3">
                                <p className="text-slate-500">Last Updated</p>
                                <p className="font-semibold text-slate-900">
                                    {new Date(invoice.updatedAt).toLocaleDateString('en-US', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// Info Card Component for Modal
function InfoCard({ title, icon, items }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white rounded-lg text-emerald-600">
                    {icon}
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    item.value && (
                        <div key={index} className="text-sm">
                            <span className="text-slate-500">{item.label}: </span>
                            <span className="font-medium text-slate-900">{item.value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

export default CustomerInvoice;