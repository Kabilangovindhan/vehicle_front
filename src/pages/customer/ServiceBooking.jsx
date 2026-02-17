import React, { useEffect, useState, useCallback } from "react";
import { ClipboardList, Loader2, Car, Calendar, Briefcase, CheckCircle2 } from "lucide-react";
import axios from "axios";

function ServiceBooking() {

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const phone = sessionStorage.getItem("phone");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const vRes = await axios.get(`http://localhost:5000/api/serviceBooking/${phone}`);
            setVehicles(vRes.data);
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
        const currentPhone = sessionStorage.getItem("phone");

        const bookingPayload = {
            customerPhone: currentPhone,
            vehicle: form.get("vehicleId"),
            serviceType: form.get("serviceType"),
            appointmentDate: form.get("appointmentDate"),
            problemDescription: form.get("problemDescription")
        };

        try {
            const res = await axios.post("http://localhost:5000/api/serviceBooking/createBooking", bookingPayload);
            alert(res.data.message || "Appointment Booked Successfully!");
            e.target.reset();
        } catch (err) {
            alert("Server Connection Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
            {/* --- NAV BAR (Matched JobAssignment) --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Briefcase size={20} />
                        </div>
                        Auto<span className="text-indigo-600">Care</span>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        Customer Portal
                    </div>
                </div>
            </nav>

            <div className="mx-auto p-8">
                {/* Header Section */}
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Schedule <span className="text-indigo-600">Service</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Book your next maintenance appointment in seconds.</p>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-3 mb-10 border-b border-slate-100 pb-8">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                                <ClipboardList size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Booking Details</h2>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">All fields are required</p>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="animate-spin text-indigo-600" size={40} />
                                <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Loading vehicle data</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

                                {/* Vehicle Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Car size={14} className="text-indigo-500" /> Select Vehicle
                                    </label>
                                    <select
                                        name="vehicleId"
                                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Choose a vehicle</option>
                                        {vehicles.map(v => (
                                            <option key={v._id} value={v._id}>
                                                {v.brand} {v.model} ({v.vehicleNumber})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Service Type */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Type</label>
                                    <select
                                        name="serviceType"
                                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">Choose Service</option>
                                        <option value="General Service">General Service</option>
                                        <option value="Oil Change">Oil Change</option>
                                        <option value="Water Wash">Water Wash</option>
                                        <option value="Repair">Repair</option>
                                    </select>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Calendar size={14} className="text-indigo-500" /> Preferred Date
                                    </label>
                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700"
                                        required
                                    />
                                </div>

                                {/* Problem Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
                                    <textarea
                                        name="problemDescription"
                                        placeholder="Tell us what's wrong with your vehicle..."
                                        className="w-full mt-2 bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 min-h-[150px] resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="md:col-span-2 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-100 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={20} />
                                                Confirm Appointment
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ServiceBooking;