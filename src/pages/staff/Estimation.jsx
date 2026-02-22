import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calculator, Save, ChevronLeft, IndianRupee } from "lucide-react";

function Estimation() {
    
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [labor, setLabor] = useState("");
    const [partsCost, setPartsCost] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Auto-calculation Logic ---
    const lValue = parseFloat(labor) || 0;
    const pValue = parseFloat(partsCost) || 0;
    const subtotal = lValue + pValue;
    const taxRate = 0.18; // 18% GST
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    const saveEstimate = async () => {
        if (!labor || !partsCost) {
            alert("Please enter both Labor and Parts costs.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/inspectionReport/save-estimate/${jobId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        labourCharge: lValue,
                        partsCost: pValue,
                        tax: taxAmount.toFixed(2),
                        totalAmount: totalAmount.toFixed(2),
                        approvalStatus: "Pending"
                    })
                }
            );

            if (res.ok) {
                alert("Estimate Saved Successfully!");
                navigate("/layout/assigned-jobs");
            }
        } catch (error) {
            alert("Failed to save estimate.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg">
                        <Calculator size={20} />
                        <span className="font-bold uppercase tracking-wider text-sm">Cost Estimation</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-black text-slate-800 mb-8 border-b pb-4">Job Estimate</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Input Side */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Labor Charges (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter labor cost"
                                        value={labor}
                                        onChange={(e) => setLabor(e.target.value)}
                                        className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-lg font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">Parts Total Cost (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="Enter total parts cost"
                                        value={partsCost}
                                        onChange={(e) => setPartsCost(e.target.value)}
                                        className="w-full border-2 border-slate-100 p-4 rounded-2xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-lg font-medium"
                                    />
                                </div>
                            </div>

                            {/* Summary Side */}
                            <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center opacity-80">
                                        <span className="text-sm font-medium">Subtotal</span>
                                        <span className="font-bold text-lg">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center opacity-80">
                                        <span className="text-sm font-medium">GST (18%)</span>
                                        <span className="font-bold text-lg">₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="border-t border-indigo-400 pt-4 mt-4">
                                        <p className="text-xs uppercase font-black tracking-widest opacity-70 mb-1">Grand Total</p>
                                        <p className="text-4xl font-black">₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={saveEstimate}
                                    disabled={isSubmitting}
                                    className="mt-8 w-full bg-white text-indigo-600 hover:bg-indigo-50 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : <><Save size={22} /> Save Estimate</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="text-center text-slate-400 text-sm mt-8 font-medium">
                    Please ensure all charges match the workshop service standards.
                </p>
            </div>
        </div>
    );
}

export default Estimation;