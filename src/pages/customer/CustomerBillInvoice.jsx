import React, { useEffect, useState } from "react";
import { Receipt, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function CustomerInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const customerId = localStorage.getItem("customerId"); // from login

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <h1 className="text-2xl font-black mb-6">My Invoices</h1>

            {invoices.length === 0 ? (
                <p>No invoices available</p>
            ) : (
                <div className="space-y-4">
                    {invoices.map(invoice => (
                        <div
                            key={invoice._id}
                            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold text-lg">
                                    {invoice.job?.booking?.vehicle?.vehicleNumber}
                                </p>
                                <p className="text-sm text-slate-500">
                                    Amount: ₹{invoice.grandTotal}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Status: {invoice.paymentStatus}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedInvoice(invoice)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl"
                            >
                                View Bill
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedInvoice && (
                    <InvoiceModal
                        invoice={selectedInvoice}
                        onClose={() => setSelectedInvoice(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function InvoiceModal({ invoice, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 rounded-3xl w-full max-w-md"
            >
                <div className="flex justify-between mb-4">
                    <h2 className="font-black text-xl">Invoice Details</h2>
                    <button onClick={onClose}><X /></button>
                </div>

                <div className="space-y-2 text-sm">
                    <p><strong>Vehicle:</strong> {invoice.job?.booking?.vehicle?.vehicleNumber}</p>
                    <p><strong>GST:</strong> ₹{invoice.gst}</p>
                    <p><strong>Total:</strong> ₹{invoice.grandTotal}</p>
                    <p><strong>Status:</strong> {invoice.paymentStatus}</p>
                    <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
            </motion.div>
        </div>
    );
}

export default CustomerInvoice;