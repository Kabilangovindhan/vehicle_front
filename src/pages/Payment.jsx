import React, { useState } from "react";
import { 
  Receipt, 
  CreditCard, 
  Printer, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Wallet,
  IndianRupee 
} from "lucide-react";

function BillingInvoice() {
  const [step, setStep] = useState("billing"); // billing | invoice | receipt

  const [bill, setBill] = useState({
    customerName: "",
    vehicleNumber: "",
    serviceCharge: "",
    spareParts: "",
    tax: 18,
    paymentMode: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  };

  const serviceCharge = Number(bill.serviceCharge || 0);
  const spareParts = Number(bill.spareParts || 0);
  const subTotal = serviceCharge + spareParts;
  const taxAmount = (subTotal * bill.tax) / 100;
  const totalAmount = subTotal + taxAmount;

  /* ================= UI CLASSES ================= */
  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all";
  const labelStyle = "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1";

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-sans antialiased">
      <div className="max-w-2xl mx-auto">
        
        {/* STEPPER HEADER (Hidden during Print) */}
        <div className="print:hidden mb-10 flex items-center justify-center gap-4">
          {["billing", "invoice", "receipt"].map((s, idx) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${step === s ? 'text-blue-600' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${step === s ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                  {idx + 1}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{s}</span>
              </div>
              {idx < 2 && <div className="w-8 h-[2px] bg-slate-200" />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* ================= STEP 1: BILLING INPUT ================= */}
          {step === "billing" && (
            <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><IndianRupee size={24} /></div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Billing Entry</h2>
              </div>

              <form onSubmit={() => setStep("invoice")} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelStyle}>Client Name</label>
                    <input name="customerName" value={bill.customerName} placeholder="e.g. Rahul Sharma" className={inputStyle} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Vehicle Plate No.</label>
                    <input name="vehicleNumber" value={bill.vehicleNumber} placeholder="MH 12 AB 1234" className={inputStyle} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Labor/Service Charge (₹)</label>
                    <input type="number" name="serviceCharge" value={bill.serviceCharge} placeholder="0.00" className={inputStyle} onChange={handleChange} required />
                  </div>
                  <div>
                    <label className={labelStyle}>Spare Parts Total (₹)</label>
                    <input type="number" name="spareParts" value={bill.spareParts} placeholder="0.00" className={inputStyle} onChange={handleChange} />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-3xl p-6 text-white mt-8 shadow-lg shadow-slate-200">
                  <div className="flex justify-between text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <span>Tax (GST {bill.tax}%)</span>
                    <span>₹ {taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Grand Total</span>
                    <span className="text-3xl font-black text-blue-400">₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 group">
                  Verify & Generate Invoice <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 2: INVOICE PREVIEW ================= */}
          {step === "invoice" && (
            <div className="p-8 md:p-12 animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Proforma Invoice</h2>
              <div className="flex flex-col items-center mb-8">
                <p className="text-sm font-bold text-slate-900">{bill.customerName}</p>
                <p className="text-xs text-slate-500">{bill.vehicleNumber}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-slate-50 text-sm">
                  <span className="text-slate-500 font-medium">Service Charge</span>
                  <span className="font-bold text-slate-900">₹ {serviceCharge}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-50 text-sm">
                  <span className="text-slate-500 font-medium">Spare Parts</span>
                  <span className="font-bold text-slate-900">₹ {spareParts}</span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-slate-500 font-medium">GST ({bill.tax}%)</span>
                  <span className="font-bold text-slate-900">₹ {taxAmount}</span>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl flex justify-between items-center">
                  <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Total Payable</span>
                  <span className="text-2xl font-black text-blue-600">₹ {totalAmount}</span>
                </div>
              </div>

              <div className="space-y-4">
                <label className={labelStyle}>Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-3">
                  {["Cash", "UPI", "Card"].map((mode) => (
                    <button 
                      key={mode} 
                      onClick={() => setBill({...bill, paymentMode: mode})}
                      className={`py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${bill.paymentMode === mode ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <button onClick={() => setStep("billing")} className="flex-1 flex items-center justify-center gap-2 font-bold text-slate-400 hover:text-slate-600 transition-colors py-4">
                  <ArrowLeft size={18} /> Edit Bill
                </button>
                <button 
                  onClick={() => setStep("receipt")} 
                  disabled={!bill.paymentMode}
                  className="flex-[2] bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
                >
                  Confirm Payment <Wallet size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: RECEIPT (Final) ================= */}
          {step === "receipt" && (
            <div className="p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
              <div className="print:hidden">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Transaction Successful</h2>
                <p className="text-slate-500 text-sm mb-10 font-medium">Payment received via {bill.paymentMode}</p>
              </div>

              {/* The actual receipt document */}
              <div className="bg-slate-50 p-8 rounded-3xl border-2 border-dashed border-slate-200 text-left mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Workshop Invoice</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">#{Math.floor(Math.random() * 90000) + 10000}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString()}</p>
                    <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">Paid</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Vehicle</span>
                    <span className="font-bold">{bill.vehicleNumber}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Owner</span>
                    <span className="font-bold">{bill.customerName}</span>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Amount Paid</span>
                  <span className="text-2xl font-black text-slate-900">₹ {totalAmount}</span>
                </div>
              </div>

              <div className="print:hidden flex flex-col sm:flex-row gap-4">
                <button onClick={() => window.print()} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
                  <Printer size={18} /> Print Receipt
                </button>
                <button onClick={() => setStep("billing")} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black py-4 rounded-2xl transition-colors">
                  New Billing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingInvoice;












