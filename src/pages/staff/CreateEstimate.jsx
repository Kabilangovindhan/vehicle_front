import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Calculator, 
    ChevronLeft, 
    Wrench, 
    Package, 
    Percent, 
    Banknote, 
    Loader2,
    ArrowRight,
    RotateCcw,
    ShieldCheck
} from "lucide-react";

function CreateEstimate() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [labourCost, setLabourCost] = useState("");
    const [partsCost, setPartsCost] = useState("");
    const [gstPercentage, setGstPercentage] = useState(18);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- ACCURATE MATHEMATICAL CALCULATIONS ---
    const subtotal = Math.max(0, Number(labourCost) + Number(partsCost));
    const calculatedTax = (subtotal * Number(gstPercentage)) / 100;
    const totalAmount = subtotal + calculatedTax;

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(num);
    };

    const handleReset = () => {
        if (window.confirm("Clear all estimation data?")) {
            setLabourCost("");
            setPartsCost("");
            setGstPercentage(18);
        }
    };

    const submitEstimate = async () => {
        if (totalAmount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5000/api/staff/estimate/${jobId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    labourCost: Number(labourCost), 
                    partsCost: Number(partsCost), 
                    tax: calculatedTax, 
                    totalAmount,
                    gstPercentage: Number(gstPercentage)
                })
            });

            if (res.ok) {
                navigate("/layout/assigned-jobs");
            } else {
                alert("Failed to create estimate. Please try again.");
            }
        } catch (err) {
            alert("Server error connection lost.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 lg:pb-10 font-sans">
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
                
                {/* Header Navigation */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Job Workspace
                    </button>

                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
                    >
                        <RotateCcw size={14} />
                        Reset Data
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
                    
                    {/* Left Side: Input Form */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-slate-200 p-5 sm:p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100">
                                    <Calculator size={24} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold tracking-tight">Financial Estimation</h2>
                                    <p className="text-xs text-slate-400 font-mono mt-0.5 uppercase tracking-wider">ID: {jobId?.slice(-12)}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Cost Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 block ml-1">
                                            Labour Charges
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400 font-semibold">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                                placeholder="0.00"
                                                value={labourCost}
                                                onChange={(e) => setLabourCost(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 block ml-1">
                                            Parts & Spares
                                        </label>
                                        <div className="relative flex items-center">
                                            <span className="absolute left-4 text-slate-400 font-semibold">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700"
                                                placeholder="0.00"
                                                value={partsCost}
                                                onChange={(e) => setPartsCost(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* GST Dropdown */}
                                <div>
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-2 block ml-1">
                                        Applicable GST Rate
                                    </label>
                                    <div className="relative">
                                        <select 
                                            value={gstPercentage}
                                            onChange={(e) => setGstPercentage(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-700 appearance-none"
                                        >
                                            <option value="0">0% — GST Exempt</option>
                                            <option value="5">5% — Essential Goods</option>
                                            <option value="12">12% — Standard Rate (L)</option>
                                            <option value="18">18% — Standard Rate (H)</option>
                                            <option value="28">28% — Luxury / Special</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ChevronLeft size={16} className="-rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badge */}
                        <div className="hidden sm:flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <ShieldCheck size={18} />
                            </div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Calculations verified per Indian Tax Standards</p>
                        </div>
                    </div>

                    {/* Right Side: Calculation Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="bg-slate-900 text-white rounded-2xl lg:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl sticky top-6">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Banknote size={20} className="text-indigo-400" />
                                Invoice Breakdown
                            </h3>

                            <div className="space-y-4 border-b border-slate-800 pb-6 mb-6">
                                <div className="flex justify-between text-slate-400 text-sm font-medium">
                                    <span>Net Amount</span>
                                    <span className="text-white">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 text-sm font-medium">GST Tax ({gstPercentage}%)</span>
                                    <span className="text-indigo-400 font-bold">+{formatCurrency(calculatedTax)}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px]">Total Payable</label>
                                <div className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tighter">
                                    {formatCurrency(totalAmount)}
                                </div>
                            </div>

                            <button 
                                onClick={submitEstimate}
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={24} />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Estimate</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                            
                            <p className="text-[10px] text-slate-500 text-center mt-6 font-bold uppercase tracking-[0.3em] opacity-60">
                                Auto-Generated Electronic Receipt
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Float Bar (Optional for very small screens) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex justify-between items-center z-50">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Grand Total</p>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalAmount)}</p>
                </div>
                <button 
                    onClick={submitEstimate}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                    Send Now
                </button>
            </div>
        </div>
    );
}

export default CreateEstimate;