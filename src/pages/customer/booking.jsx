import React, { useEffect, useState, useCallback } from "react";
import { ClipboardList } from "lucide-react";

function Booking() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const phone = sessionStorage.getItem("phone") || "9000000004";

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const vRes = await fetch("http://localhost:5000/api/vehicle/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });
            const vData = await vRes.json();
            setVehicles(vData);
        } catch (error) {
            console.error("Error fetching vehicles:", error);
        } finally {
            setLoading(false);
        }
    }, [phone]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        setIsSubmitting(true);
        const form = new FormData(e.target);
        const currentPhone = sessionStorage.getItem("phone") || "9025626140";

        const bookingPayload = {
            customerPhone: currentPhone,
            vehicle: form.get("vehicleId"),
            serviceType: form.get("serviceType"),
            appointmentDate: form.get("appointmentDate"),
            problemDescription: form.get("problemDescription")
        };

        try {
            const res = await fetch("http://localhost:5000/api/booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingPayload)
            });
            const data = await res.json();
            if (res.ok) {
                alert("Appointment Booked Successfully!");
                e.target.reset();
            } else {
                alert("Booking Failed: " + (data.error || data.message || "Unknown Error"));
            }
        } catch (err) {
            alert("Server Connection Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            {/* max-w-full ensures the container expands to the edges of the sidebar/header area */}
            <div className="max-w-full mx-auto">
                
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">AutoCare Service Portal</h1>
                    <p className="text-slate-500 text-lg mt-2">Efficiently schedule and manage your vehicle maintenance.</p>
                </div>

                <div className="w-full">
                    {/* Main Card occupying full width */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-6">
                            <ClipboardList className="text-indigo-600" size={32} />
                            <h2 className="text-2xl font-bold text-slate-800">Schedule Service Appointment</h2>
                        </div>

                        {/* Two-column grid for wide screen balance */}
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            
                            {/* Vehicle Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Select Vehicle</label>
                                <select
                                    name="vehicleId"
                                    className="w-full border-slate-300 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all border shadow-sm"
                                    required
                                >
                                    <option value="">Choose your registered vehicle</option>
                                    {vehicles.map(v => (
                                        <option key={v._id.$oid || v._id} value={v._id.$oid || v._id}>
                                            {v.brand} {v.model} — {v.vehicleNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Service Type */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Service Type</label>
                                <select name="serviceType" className="w-full border-slate-300 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all border shadow-sm" required>
                                    <option value="">Choose Service</option>
                                    <option value="General Service">General Service</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Water Wash">Water Wash</option>
                                    <option value="Repair">Repair</option>
                                </select>
                            </div>

                            {/* Date Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Preferred Date</label>
                                <input type="date" name="appointmentDate" className="w-full border-slate-300 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all border shadow-sm" required />
                            </div>

                            {/* Problem Description - Spans full width on wider screens */}
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Problem Description</label>
                                <textarea 
                                    name="problemDescription" 
                                    placeholder="Please provide details about the issue..." 
                                    className="w-full border-slate-300 rounded-xl p-4 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none h-40 transition-all resize-none border shadow-sm" 
                                />
                            </div>

                            {/* Submit Button Section */}
                            <div className="md:col-span-2 flex justify-end mt-4">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting} 
                                    className="w-full md:w-auto px-16 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-xl transition-all shadow-xl hover:shadow-indigo-200 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? "Processing Booking..." : "Confirm & Book Appointment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Booking;