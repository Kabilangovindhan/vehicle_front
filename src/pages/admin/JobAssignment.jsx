import React, { useEffect, useState } from "react";
import {
    Calendar,
    User,
    Car,
    Loader2,
    XCircle,
    Phone,
    UserCheck,
    Search,
    Briefcase,
    CheckCircle2,
    AlertCircle
} from "lucide-react";

function JobAssignment() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [staffList, setStaffList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    const [activeModal, setActiveModal] = useState(null); 
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const [targetStaff, setTargetStaff] = useState("");

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
        } catch (err) { console.error("Staff fetch failed", err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobAssignment/fetchbooking");
            const data = await res.json();
            setBookings(data);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleReject = async () => {
        if (!rejectionReason) return alert("Please provide a reason");
        const id = selectedBooking._id;
        try {
            const res = await fetch(`http://localhost:5000/api/jobAssignment/update/${id}`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ status: "Rejected", rejectedReason: rejectionReason })
            });
            if (res.ok) {
                await fetchBookings();
                closeModal();
            } else {
                const errData = await res.json();
                alert(errData.message || "Update failed");
            }
        } catch (err) { alert("Network error"); }
    };

    const handleApprove = async () => {
        if (!targetStaff) return alert("Please select staff");
        try {
            const res = await fetch(`http://localhost:5000/api/jobAssignment/approvebooking/${selectedBooking._id}/approve`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ 
                    mechanicId: targetStaff,
                    priority: "Normal" 
                })
            });
            if (res.ok) {
                await fetchBookings();
                closeModal();
            } else {
                const errData = await res.json();
                alert(errData.message || "Approval failed");
            }
        } catch (err) { console.error(err); alert("Connection failed"); }
    };

    const closeModal = () => {
        setActiveModal(null);
        setSelectedBooking(null);
        setRejectionReason("");
        setTargetStaff("");
    };

    const filteredBookings = bookings.filter(b =>
        b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-12">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Briefcase size={20} />
                        </div>
                        Job<span className="text-indigo-600">Assignment</span>
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-[10px] font-black uppercase border border-indigo-100 tracking-widest">
                        Live Fleet Sync
                    </div>
                </div>
            </nav>

            <div className="mt-8 max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customer or service..."
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-500/10 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Total Requests: {filteredBookings.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
                ) : (
                    <div className="grid gap-6">
                        {filteredBookings.map((b) => (
                            <div key={b._id} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="flex flex-col lg:flex-row items-center">
                                    <div className="p-6 lg:w-1/4 w-full border-b lg:border-b-0 lg:border-r border-slate-100">
                                        <StatusBadge status={b.status} />
                                        <h3 className="font-black text-lg mt-2 text-slate-800">{b.serviceType}</h3>
                                        <div className="text-[10px] text-slate-400 font-mono mt-1 tracking-tighter">ID: {b._id.slice(-12)}</div>
                                    </div>

                                    <div className="lg:flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4 px-8 py-4 bg-slate-50/30">
                                        <div className="space-y-2">
                                            <div className="text-sm font-bold flex items-center gap-3 text-slate-600">
                                                <User size={16} className="text-indigo-500" /> {b.customer?.name}
                                            </div>
                                            <div className="text-xs flex items-center gap-3 text-slate-500 font-medium">
                                                <Phone size={14} /> {b.customer?.phone}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm font-bold flex items-center gap-3 text-slate-600">
                                                <Car size={16} className="text-indigo-500" /> {b.vehicle?.vehicleNumber}
                                            </div>
                                            <div className="text-xs flex items-center gap-3 text-slate-500 font-medium">
                                                <Calendar size={14} /> {new Date(b.appointmentDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 lg:w-1/4 w-full flex flex-col gap-3">
                                        {b.status === "Pending" ? (
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => { setSelectedBooking(b); setActiveModal('approve'); }}
                                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-black transition-colors"
                                                >
                                                    Assign & Approve
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedBooking(b); setActiveModal('reject'); }}
                                                    className="w-full flex items-center justify-center gap-2 py-3 border border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-black transition-colors"
                                                >
                                                    <XCircle size={14} /> Reject Request
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 py-4 px-4 bg-emerald-50 text-emerald-700 rounded-2xl text-[10px] font-black tracking-widest border border-emerald-100">
                                                <UserCheck size={16} /> ACTIVE ASSIGNMENT
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl z-10 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className={`p-6 text-white flex items-center gap-3 ${activeModal === 'approve' ? 'bg-indigo-600' : 'bg-rose-600'}`}>
                            {activeModal === 'approve' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                            <h2 className="font-black text-lg uppercase tracking-tight">
                                {activeModal === 'approve' ? 'Approve Assignment' : 'Reject Booking'}
                            </h2>
                        </div>
                        
                        <div className="p-8">
                            <p className="text-slate-500 text-sm mb-6 font-medium">
                                {activeModal === 'approve' 
                                    ? `Assign a technician for ${selectedBooking?.customer?.name}'s ${selectedBooking?.serviceType}.`
                                    : `Are you sure you want to reject this request? Please provide a reason below.`}
                            </p>

                            {activeModal === 'approve' ? (
                                <select 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none ring-indigo-500 focus:ring-2 font-bold text-sm"
                                    value={targetStaff}
                                    onChange={(e) => setTargetStaff(e.target.value)}
                                >
                                    <option value="">Select Technician</option>
                                    {staffList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                                </select>
                            ) : (
                                <textarea 
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none ring-rose-500 focus:ring-2 font-medium text-sm h-32"
                                    placeholder="Enter rejection reason..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            )}

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <button onClick={closeModal} className="py-4 rounded-2xl text-xs font-black text-slate-400 hover:bg-slate-50 transition-colors uppercase tracking-widest">
                                    Cancel
                                </button>
                                <button 
                                    onClick={activeModal === 'approve' ? handleApprove : handleReject}
                                    className={`py-4 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-lg ${activeModal === 'approve' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-rose-600 shadow-rose-200'}`}
                                >
                                    Confirm Action
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-amber-100 text-amber-700 border-amber-200",
        Approved: "bg-indigo-100 text-indigo-700 border-indigo-200",
        Delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
        Rejected: "bg-rose-100 text-rose-700 border-rose-200"
    };
    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.Pending}`}>
            {status}
        </span>
    );
};

export default JobAssignment;