import React, { useEffect, useState } from "react";
import {
  Car, ClipboardList, IndianRupee, CheckCircle2, XCircle, 
  Clock, User, AlertCircle, FileText, Printer, ChevronRight, Edit3, Save, X
} from "lucide-react";

function InspectionEstimateReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null); // Tracks the item being edited

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/inspectionestimateReport/all-reports");
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await fetch(`http://localhost:5000/api/inspectionestimateReport/update/${updatedData.estimate._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        setEditingItem(null);
        fetchData(); // Refresh list
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Fetching secure records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end border-b border-slate-300 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Inspection & Estimate Portal</h1>
            <p className="text-slate-500">Manage, review, and track service requests.</p>
          </div>
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Total Records: <span className="text-blue-600">{data.length}</span>
          </div>
        </div>

        {/* Data Mapping */}
        {data.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-300 rounded-2xl bg-white">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="text-lg font-medium text-slate-900 mt-2">No active reports</h3>
          </div>
        ) : (
          <div className="grid gap-8">
            {data.map((item, index) => {
              const est = item.estimate;
              const inspection = item.inspection;
              const booking = est.job?.booking;

              return (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header Row */}
                  <div className="bg-slate-900 p-6 flex flex-wrap justify-between items-center gap-4 text-white">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-xl"><User size={24} /></div>
                      <div>
                        <h3 className="text-lg font-bold">{booking?.customer?.name}</h3>
                        <p className="text-slate-400 text-sm">{booking?.customer?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={est.approvalStatus} />
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors" 
                        title="Edit Report"
                      >
                        <Edit3 size={18}/>
                      </button>
                      <button className="text-slate-400 hover:text-white transition-colors" title="Print"><Printer size={20}/></button>
                    </div>
                  </div>

                  {/* Grid Layout */}
                  <div className="p-6 grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 border-r border-slate-100 pr-6">
                      <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><Car size={18} className="text-blue-600"/> Vehicle</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-slate-500">Registration</div>
                        <div className="text-xl font-mono font-bold text-slate-900 uppercase">{booking?.vehicle?.vehicleNumber}</div>
                        <div className="text-sm font-medium">{booking?.vehicle?.brand} {booking?.vehicle?.model}</div>
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4"><ClipboardList size={18} className="text-blue-600"/> Inspection Notes</h4>
                      <div className="grid sm:grid-cols-2 gap-3 mb-4">
                        {inspection?.issuesFound?.map((issue, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 p-3 rounded-lg text-slate-700">
                            <AlertCircle size={16} className="text-blue-500" />
                            {issue.title || issue}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 italic">Remark: {inspection?.remarks || "None"}</p>
                    </div>
                  </div>

                  {/* Pricing Table */}
                  <div className="px-6 pb-6 pt-2">
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="p-3 text-left">Service</th>
                            <th className="p-3 text-right">Labour</th>
                            <th className="p-3 text-right">Parts</th>
                            <th className="p-3 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {est.items?.map((it, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-3 font-medium">{it.issueTitle}</td>
                              <td className="p-3 text-right">₹{it.labourCharge}</td>
                              <td className="p-3 text-right">₹{it.partsCost}</td>
                              <td className="p-3 text-right font-bold text-slate-900">₹{it.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-6 flex justify-end">
                      <div className="w-full sm:w-64 space-y-2 text-right">
                        <div className="text-sm text-slate-500">Tax: ₹{est.tax}</div>
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">
                          Grand Total: ₹{est.grandTotal?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal Component */}
      {editingItem && (
        <EditModal 
          item={editingItem} 
          onClose={() => setEditingItem(null)} 
          onSave={handleUpdate} 
        />
      )}
    </div>
  );
}

// EDIT MODAL COMPONENT
function EditModal({ item, onClose, onSave }) {
  const [formData, setFormData] = useState(JSON.parse(JSON.stringify(item)));

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.estimate.items];
    newItems[index][field] = Number(value);
    newItems[index].total = newItems[index].labourCharge + newItems[index].partsCost;
    
    const subTotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
    const tax = Math.round(subTotal * 0.18); // Example 18% tax logic
    
    setFormData({
      ...formData,
      estimate: { 
        ...formData.estimate, 
        items: newItems,
        tax: tax,
        grandTotal: subTotal + tax
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white w-full max-w-2xl h-full shadow-2xl overflow-y-auto p-8 animate-in slide-in-from-right">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Edit Report</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
        </div>

        <div className="space-y-6">
          {/* Inspection Section */}
          <section>
            <h3 className="font-bold text-blue-600 mb-3 uppercase text-xs tracking-widest">Inspection Details</h3>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
            <textarea 
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.inspection.remarks}
              onChange={(e) => setFormData({...formData, inspection: {...formData.inspection, remarks: e.target.value}})}
            />
          </section>

          {/* Estimate Items */}
          <section>
            <h3 className="font-bold text-blue-600 mb-3 uppercase text-xs tracking-widest">Pricing Items</h3>
            {formData.estimate.items.map((it, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl mb-4 space-y-3">
                <div className="font-bold text-sm">{it.issueTitle}</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-500">Labour (₹)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded p-2 text-sm"
                      value={it.labourCharge}
                      onChange={(e) => handleItemChange(idx, 'labourCharge', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Parts (₹)</label>
                    <input 
                      type="number" 
                      className="w-full border rounded p-2 text-sm"
                      value={it.partsCost}
                      onChange={(e) => handleItemChange(idx, 'partsCost', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Status Section */}
          <section>
            <h3 className="font-bold text-blue-600 mb-3 uppercase text-xs tracking-widest">Status</h3>
            <select 
              className="w-full border rounded-lg p-3 text-sm"
              value={formData.estimate.approvalStatus}
              onChange={(e) => setFormData({...formData, estimate: {...formData.estimate, approvalStatus: e.target.value}})}
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </section>

          <button 
            onClick={() => onSave(formData)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <Save size={20}/> Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Rejected: "bg-rose-100 text-rose-800 border-rose-200"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>
      {status?.toUpperCase()}
    </span>
  );
}

export default InspectionEstimateReport;