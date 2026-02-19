import React, { useEffect, useState } from "react";
import {
    Calendar, User, Car, Loader2, XCircle, Wrench,
    Truck, Phone, UserCheck, Search, Briefcase
} from "lucide-react";

function JobAssignment() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBookings();
        fetchStaff();
    }, []);

    // Fetch staff list
    const fetchStaff = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobAssignment/staff", {
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

    // Fetch bookings
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

    // Update booking status
    const updateStatus = async (id, status) => {

        setUpdatingId(id);

        try {

            const res = await fetch(`http://localhost:5000/api/jobAssignment/update/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {

                setBookings(prev =>
                    prev.map(b =>
                        b._id === id ? { ...b, status } : b
                    )
                );

            }

        } catch (err) {

            alert("Status update failed");

        } finally {

            setUpdatingId(null);

        }

    };

    // Assign mechanic first time
    const approveBooking = async (bookingId) => {

        const mechanicId = selectedStaff[bookingId];

        if (!mechanicId) {

            alert("Please select staff");
            return;

        }

        try {

            const res = await fetch(
                `http://localhost:5000/api/jobAssignment/approvebooking/${bookingId}/approve`,
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

                fetchBookings();

            }

        } catch (err) {

            console.error(err);

        }

    };

    // Update mechanic (Edit Assignment)
    const updateMechanic = async (bookingId) => {

        const mechanicId = selectedStaff[bookingId];

        if (!mechanicId) {

            alert("Please select staff");
            return;

        }

        try {

            const res = await fetch(
                `http://localhost:5000/api/jobAssignment/updateMechanic/${bookingId}`,
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

                fetchBookings();
                setEditingId(null);

            }

        } catch (err) {

            console.error(err);

        }

    };

    // Search filter
    const filteredBookings = bookings.filter(b =>
        b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div className="min-h-screen text-slate-900 pb-12">

            {/* NAV BAR */}

            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">

                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">

                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">

                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Briefcase size={20} />
                        </div>

                        Job<span className="text-indigo-600">Assignment</span>

                    </div>

                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-[10px] font-black uppercase tracking-widest border border-indigo-100">

                        Live Fleet Sync

                    </div>

                </div>

            </nav>


            <div className="mt-8">

                {/* SEARCH */}

                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">

                    <div className="relative w-full md:w-96 group">

                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            size={20}
                        />

                        <input
                            type="text"
                            placeholder="Search by customer or service..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                    </div>

                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">

                        Total Requests: {bookings.length}

                    </div>

                </div>


                {/* LOADING */}

                {loading ? (

                    <div className="flex flex-col items-center justify-center h-64 gap-4">

                        <Loader2 className="animate-spin text-indigo-600" size={32} />

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-8">

                        {filteredBookings.map((b) => (

                            <div key={b._id} className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm">

                                <div className="flex flex-col lg:flex-row items-center p-2">

                                    {/* LEFT */}

                                    <div className="p-6 lg:w-1/4 w-full">

                                        <StatusBadge status={b.status} />

                                        <h3 className="font-black text-lg">

                                            {b.serviceType}

                                        </h3>

                                        <div className="text-[10px] text-slate-400 font-mono">

                                            ID: {b._id.slice(-8)}

                                        </div>

                                    </div>


                                    {/* CENTER */}

                                    <div className="lg:flex-1 w-full grid grid-cols-2 gap-4 px-6 py-4">

                                        <div>

                                            <span className="text-sm font-bold flex items-center gap-2">

                                                <User size={14} />

                                                {b.customer?.name}

                                            </span>

                                            <span className="text-xs flex items-center gap-2">

                                                <Phone size={14} />

                                                {b.customer?.phone}

                                            </span>

                                        </div>

                                        <div>

                                            <span className="text-sm font-bold flex items-center gap-2">

                                                <Car size={14} />

                                                {b.vehicle?.vehicleNumber}

                                            </span>

                                            <span className="text-xs flex items-center gap-2">

                                                <Calendar size={14} />

                                                {new Date(b.appointmentDate).toLocaleDateString()}

                                            </span>

                                        </div>

                                    </div>


                                    {/* RIGHT ACTION */}

                                    <div className="p-6 lg:w-1/4 w-full flex flex-col gap-3">

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
                                                    className="w-full border px-4 py-2 rounded-xl text-xs font-bold"
                                                >
                                                    <option value="">Select Staff</option>

                                                    {staffList.map(s => (
                                                        <option key={s._id} value={s._id}>
                                                            {s.name}
                                                        </option>
                                                    ))}

                                                </select>

                                                <button
                                                    onClick={() => approveBooking(b._id)}
                                                    className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-black"
                                                >
                                                    Assign Job
                                                </button>
                                            </>

                                        ) : (

                                            <>
                                                {editingId === b._id ? (

                                                    <>
                                                        <select
                                                            value={selectedStaff[b._id] || ""}
                                                            onChange={(e) =>
                                                                setSelectedStaff({
                                                                    ...selectedStaff,
                                                                    [b._id]: e.target.value
                                                                })
                                                            }
                                                            className="w-full border px-4 py-2 rounded-xl text-xs font-bold"
                                                        >
                                                            <option value="">Select Staff</option>

                                                            {staffList.map(s => (
                                                                <option key={s._id} value={s._id}>
                                                                    {s.name}
                                                                </option>
                                                            ))}

                                                        </select>

                                                        <button
                                                            onClick={() => updateMechanic(b._id)}
                                                            className="w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-black"
                                                        >
                                                            Save
                                                        </button>

                                                        <button
                                                            onClick={() => setEditingId(null)}
                                                            className="w-full border py-2 rounded-xl text-xs font-bold"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </>

                                                ) : (

                                                    <>
                                                        <div className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black">

                                                            <UserCheck size={14} />

                                                            ACTIVE ASSIGNMENT

                                                        </div>

                                                        <button
                                                            onClick={() => setEditingId(b._id)}
                                                            className="w-full border border-indigo-200 hover:bg-indigo-50 text-indigo-600 py-2 rounded-xl text-xs font-black"
                                                        >
                                                            Edit Assignment
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        )}

                                        {/* STATUS BUTTONS */}

                                        <div className="flex gap-2">

                                            <button
                                                onClick={() => updateStatus(b._id, "Delivered")}
                                                className="flex-1 p-2 border rounded-lg"
                                            >
                                                <Truck size={16} className="mx-auto" />
                                            </button>

                                            <button
                                                onClick={() => updateStatus(b._id, "Rejected")}
                                                className="flex-1 p-2 border rounded-lg"
                                            >
                                                <XCircle size={16} className="mx-auto" />
                                            </button>

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


// STATUS BADGE

const StatusBadge = ({ status }) => {

    const styles = {

        Pending: "bg-yellow-50 text-yellow-700",
        Approved: "bg-blue-50 text-blue-700",
        Delivered: "bg-purple-50 text-purple-700",
        Rejected: "bg-red-50 text-red-700"

    };

    return (

        <span className={`px-2 py-1 rounded text-xs font-bold ${styles[status]}`}>

            {status}

        </span>

    );

};

export default JobAssignment;
