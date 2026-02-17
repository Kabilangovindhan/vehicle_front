import React, { useEffect, useState } from "react";
import {
    Calendar,
    User,
    Car,
    Loader2,
    CheckCircle,
    XCircle,
    Wrench,
    Package,
    Truck,
    Phone,
    Hash,
    UserCheck
} from "lucide-react";

function BookingManagement() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});

    useEffect(() => {
        fetchBookings();
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/adminBooking/staff", {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setStaffList(data);
        } catch (err) {
            console.error("Failed to fetch staff", err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/adminBooking/fetchbooking");
            const data = await res.json();
            console.log(data)
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
            const res = await fetch(`http://localhost:5000/api/adminBooking/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setBookings(prev =>
                    prev.map(b => b._id === id ? { ...b, status } : b)
                );
            }
        } catch (err) {
            alert("Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const approveBooking = async (bookingId) => {
        const mechanicId = selectedStaff[bookingId];

        if (!mechanicId) {
            alert("Please select staff");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/adminBooking/approvebooking/${bookingId}/approve`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ mechanicId })
                }
            );

            if (res.ok) {
                alert("Job assigned successfully");
                fetchBookings();
            } else {
                alert("Failed to assign job");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            Approved: "bg-blue-100 text-blue-700 border-blue-200",
            "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
            Completed: "bg-green-100 text-green-700 border-green-200",
            Delivered: "bg-purple-100 text-purple-700 border-purple-200",
            Rejected: "bg-red-100 text-red-700 border-red-200"
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || "bg-gray-100"}`}>
                {status}
            </span>
        );
    };

    if (loading)
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 mb-2" size={40} />
                <p className="text-slate-500 font-medium">Loading Bookings...</p>
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                        Booking Management
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base">Manage and track service requests</p>
                </header>

                <div className="grid gap-6">
                    {bookings.length === 0 ? (
                        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400">
                            No bookings found.
                        </div>
                    ) : (
                        bookings.map(b => (
                            <div
                                key={b._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Card Header */}
                                <div className="p-5 md:p-6 border-b border-slate-100 bg-white">
                                    <div className="flex flex-wrap justify-between items-start gap-4">
                                        <div className="flex gap-4">
                                            <div className="p-3 bg-indigo-50 rounded-lg hidden sm:block">
                                                <Wrench className="text-indigo-600" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg leading-tight">
                                                    {b.serviceType}
                                                </h3>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                                    <Calendar size={14} />
                                                    {new Date(b.appointmentDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={b.status} />
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 md:p-6 bg-slate-50/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer Details</p>
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <User size={18} className="text-slate-400" />
                                                <span className="font-medium">{b.customer?.name || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <Phone size={18} className="text-slate-400" />
                                                {b.customer?.phone || "No phone"}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vehicle Info</p>
                                            <div className="flex items-center gap-3 text-slate-700">
                                                <Car size={18} className="text-slate-400" />
                                                <span className="font-medium">{b.vehicle?.vehicleNumber || "N/A"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-600 text-sm">
                                                <Hash size={18} className="text-slate-400" />
                                                ID: {b._id.slice(-6).toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions - Responsive Grid */}
                                <div className="p-4 md:p-6 bg-white border-t border-slate-100">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 md:gap-3">

                                        {/* CONDITIONAL ASSIGNMENT LOGIC */}
                                        {b.status === "Pending" ? (
                                            <>
                                                <select
                                                    value={selectedStaff[b._id] || ""}
                                                    onChange={(e) =>
                                                        setSelectedStaff({
                                                            ...selectedStaff,
                                                            [b._id]: e.target.value
                                                        })
                                                    }
                                                    className="border border-slate-200 px-3 py-2 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                                >
                                                    <option value="">Select Staff</option>
                                                    {staffList.map(staff => (
                                                        <option key={staff._id} value={staff._id}>
                                                            {staff.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <button
                                                    onClick={() => approveBooking(b._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                                                >
                                                    Assign Job
                                                </button>
                                            </>
                                        ) : (
                                            /* Matches design in Image 3 */
                                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-bold border border-slate-200">
                                                <UserCheck size={16} /> Job Assigned
                                            </div>
                                        )}

                                        {/* Deliver Button - Disabled if status is NOT Pending */}
                                        <button
                                            disabled={updatingId === b._id || b.status !== "Pending"}
                                            onClick={() => updateStatus(b._id, "Delivered")}
                                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Truck size={16} /> Deliver
                                        </button>

                                        {/* Reject Button - Disabled if status is NOT Pending */}
                                        <button
                                            disabled={updatingId === b._id || b.status !== "Pending"}
                                            onClick={() => updateStatus(b._id, "Rejected")}
                                            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed col-span-2 sm:col-span-1"
                                        >
                                            <XCircle size={16} /> Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default BookingManagement;