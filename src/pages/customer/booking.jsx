import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Car, Wrench, ClipboardList, CheckCircle } from "lucide-react";

function Booking() {
    const [vehicles, setVehicles] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Retrieve the phone from session storage to identify the user
    const phone = sessionStorage.getItem("phone") || "9000000004"; // Example: Customer Arun

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch only vehicles belonging to this specific phone number
            const vRes = await fetch("http://localhost:5000/api/vehicle/user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone })
            });
            const vData = await vRes.json();
            setVehicles(vData);

            // Fetch existing booking history for this user
            const bRes = await fetch(`http://localhost:5000/api/booking/customer/${phone}`);
            const bData = await bRes.json();
            setBookings(bData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [phone]);

    useEffect(() => { fetchData(); }, [fetchData]);
    // Corrected handleSubmit to match your DB schema fields

    // Corrected handleSubmit for your Booking component
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = new FormData(e.target);

        // Dynamically get the phone from sessionStorage to match the logged-in user
        const currentPhone = sessionStorage.getItem("phone") || "9025626140";

        const bookingPayload = {
            customerPhone: currentPhone,
            vehicle: form.get("vehicleId"), // This will now correctly send the ObjectId
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
                fetchData();
            } else {
                // Updated to handle both 'error' and 'message' fields from your backend
                alert("Booking Failed: " + (data.error || data.message || "Unknown Error"));
            }
        } catch (err) {
            alert("Server Connection Error");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

                <div className="lg:col-span-12 mb-4">
                    <h1 className="text-3xl font-bold text-slate-800">AutoCare Service Portal</h1>
                    <p className="text-slate-500">Book your appointment and track status in real-time.</p>
                </div>

                {/* Left Side: Booking Form */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-6">
                            <ClipboardList className="text-indigo-600" />
                            <h2 className="text-xl font-semibold">Schedule Service</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
                                <select
                                    name="vehicleId"
                                    className="..."
                                    required
                                >
                                    <option value="">Choose your registered vehicle</option>
                                    {vehicles.map(v => (
                                        // Use v._id.$oid or v._id depending on how your API returns the data
                                        <option key={v._id.$oid || v._id} value={v._id.$oid || v._id}>
                                            {v.brand} {v.model} — {v.vehicleNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
                                <select name="serviceType" className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required>
                                    <option value="">Choose Service</option>
                                    <option value="General Service">General Service</option>
                                    <option value="Oil Change">Oil Change</option>
                                    <option value="Water Wash">Water Wash</option>
                                    <option value="Repair">Repair</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                                <input type="date" name="appointmentDate" className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Problem Description</label>
                                <textarea name="problemDescription" placeholder="Describe the issue..." className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none h-28" />
                            </div>

                            <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50">
                                {isSubmitting ? "Processing..." : "Book Appointment"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Booking List */}
                <div className="lg:col-span-7">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CheckCircle className="text-green-500 w-5 h-5" /> Booking History
                    </h3>

                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>)}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-200 p-12 text-center rounded-2xl">
                            <Car className="mx-auto w-12 h-12 text-slate-300 mb-2" />
                            <p className="text-slate-500 font-medium">No services scheduled yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map(b => (
                                <div key={b._id} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-50 rounded-full"><Wrench className="text-slate-400 w-5 h-5" /></div>
                                        <div>
                                            <p className="font-bold text-slate-900">{b.serviceType}</p>
                                            <p className="text-sm text-slate-500">Vehicle: <span className="text-slate-700">{b.vehicle?.vehicleNumber}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-slate-800">{new Date(b.appointmentDate).toLocaleDateString()}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${b.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Booking;