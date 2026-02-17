import React, { useEffect, useState } from "react";
import {
    Calendar, User, Car, Loader2, XCircle, Wrench,
    Truck, Phone, Hash, UserCheck, Search, Briefcase
} from "lucide-react";

function JobAssignment() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobAssignment/staff", {
                headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
            });
            const data = await res.json();
            setStaffList(data);
        } catch (err) {
            console.error("Failed to fetch staff", err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobAssignment/fetchbooking");
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        setUpdatingId(id);
        try {
            const res = await fetch(`http://localhost:5000/api/jobAssignment/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
            }
        } catch (err) {
            alert("Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const approveBooking = async (bookingId) => {
        const mechanicId = selectedStaff[bookingId];
        if (!mechanicId) { alert("Please select staff"); return; }

        try {
            const res = await fetch(`http://localhost:5000/api/jobAssignment/approvebooking/${bookingId}/approve`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ mechanicId })
            });
            if (res.ok) { fetchBookings(); }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen text-slate-900 pb-12">
            {/* --- NAV BAR (Matched Theme) --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Briefcase size={20} /></div>
                        Job<span className="text-indigo-600">Assignment</span>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                        Live Fleet Sync
                    </div>
                </div>
            </nav>

            <div className="mt-8">
                {/* --- SEARCH & COUNTER --- */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by customer or service..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Requests: {bookings.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Retrieving Work Orders</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        {filteredBookings.map((b) => (
                            <div key={b._id} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                                <div className="flex flex-col lg:flex-row items-center p-2">

                                    {/* Left: Identity/Type */}
                                    <div className="p-6 lg:w-1/4 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-slate-100 rounded-xl text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Wrench size={18} />
                                            </div>
                                            <StatusBadge status={b.status} />
                                        </div>
                                        <h3 className="font-black text-lg tracking-tight">{b.serviceType}</h3>
                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase">ID: {b._id.slice(-8)}</div>
                                    </div>

                                    {/* Center: Contact & Vehicle */}
                                    <div className="lg:flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 bg-slate-50/50 lg:rounded-2xl border border-transparent lg:border-slate-100">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Customer Contact</p>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold flex items-center gap-2"><User size={14} className="text-indigo-500" /> {b.customer?.name || "Guest"}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {b.customer?.phone || "N/A"}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-tighter">Vehicle Info</p>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-bold flex items-center gap-2"><Car size={14} className="text-indigo-500" /> {b.vehicle?.vehicleNumber || "N/A"}</span>
                                                <span className="text-xs text-slate-500 flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> {new Date(b.appointmentDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="p-6 lg:w-1/4 w-full flex flex-col gap-3">
                                        {b.status === "Pending" ? (
                                            <>
                                                <div className="relative">
                                                    <select
                                                        onChange={(e) => setSelectedStaff({ ...selectedStaff, [b._id]: e.target.value })}
                                                        className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 text-xs font-bold appearance-none cursor-pointer"
                                                    >
                                                        <option value="">Select Staff</option>
                                                        {staffList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                                    </select>
                                                </div>
                                                <button
                                                    onClick={() => approveBooking(b._id)}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95"
                                                >
                                                    Assign Job
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 tracking-widest">
                                                <UserCheck size={14} /> ACTIVE ASSIGNMENT
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button onClick={() => updateStatus(b._id, "Delivered")} className="flex-1 p-2 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Truck size={16} className="mx-auto" /></button>
                                            <button onClick={() => updateStatus(b._id, "Rejected")} className="flex-1 p-2 border border-slate-100 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"><XCircle size={16} className="mx-auto" /></button>
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
        Pending: "bg-yellow-50 text-yellow-700 ring-yellow-100",
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

export default JobAssignment;