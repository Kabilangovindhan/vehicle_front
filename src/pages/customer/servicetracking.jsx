import React, { useEffect, useState } from "react";
import {
    Wrench, Car, Loader2, Calendar, Briefcase,
    ArrowRight, MapPin, CheckCircle2, Clock
} from "lucide-react";

function ServiceTracking() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const phone = sessionStorage.getItem("phone");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/serviceTracking/${phone}`);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.log("Tracking Fetch Error", err);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
            {/* --- NAV BAR (Consistent with Portal Theme) --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Briefcase size={20} />
                        </div>
                        Auto<span className="text-indigo-600">Care</span>
                    </div>
                    <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Live Status
                    </div>
                </div>
            </nav>

            <div className="mx-auto p-8">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        Service <span className="text-indigo-600">Timeline</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">Monitor your vehicle's progress through our service center.</p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                        <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Syncing Records</span>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="bg-white border border-slate-200 p-16 text-center rounded-[2rem] shadow-sm">
                        <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Car className="text-slate-300 w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">No Active Services</h3>
                        <p className="text-slate-400 mt-2 font-medium">Your service history is currently empty.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((b) => (
                            <div
                                key={b._id}
                                className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                            >
                                <div className="flex flex-col md:flex-row items-stretch md:items-center">

                                    {/* Left: Service Type & Status */}
                                    <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/30">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-100">
                                                <Wrench size={18} />
                                            </div>
                                            <StatusBadge status={b.status} />
                                        </div>
                                        <h3 className="font-black text-xl tracking-tight text-slate-800">{b.serviceType}</h3>
                                        <div className="text-[10px] text-slate-400 font-mono mt-1 uppercase">W/O: {b._id.slice(-8)}</div>
                                    </div>

                                    {/* Center: Details */}
                                    <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Car size={12} className="text-indigo-500" /> Vehicle
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">{b.vehicle?.vehicleNumber || "N/A"}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar size={12} className="text-indigo-500" /> Scheduled
                                            </p>
                                            <p className="text-sm font-bold text-slate-700">
                                                {new Date(b.appointmentDate).toLocaleDateString(undefined, {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Interaction/Icon */}
                                    <div className="p-6 md:pr-8 flex items-center justify-end">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-amber-50 text-amber-700 ring-amber-100",
        Approved: "bg-blue-50 text-blue-700 ring-blue-100",
        "In Progress": "bg-indigo-50 text-indigo-700 ring-indigo-100",
        Completed: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        Delivered: "bg-purple-50 text-purple-700 ring-purple-100",
        Rejected: "bg-red-50 text-red-700 ring-red-100"
    };

    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ring-1 inline-flex items-center gap-1.5 ${styles[status] || "bg-slate-50 text-slate-600 ring-slate-100"}`}>
            <span className={`w-1 h-1 rounded-full bg-current`}></span>
            {status}
        </span>
    );
};

export default ServiceTracking;