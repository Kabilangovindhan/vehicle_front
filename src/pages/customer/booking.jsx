// import React, { useEffect, useState, useCallback } from "react";
// import { Calendar, Car, Wrench, ClipboardList, CheckCircle } from "lucide-react";

// function Booking() {
//     const [vehicles, setVehicles] = useState([]);
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Retrieve the phone from session storage to identify the user
//     const phone = sessionStorage.getItem("phone") || "9000000004"; // Example: Customer Arun

//     const fetchData = useCallback(async () => {
//         setLoading(true);
//         try {
//             // Fetch only vehicles belonging to this specific phone number
//             const vRes = await fetch("http://localhost:5000/api/vehicle/user", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ phone })
//             });
//             const vData = await vRes.json();
//             setVehicles(vData);

//             // Fetch existing booking history for this user
//             const bRes = await fetch(`http://localhost:5000/api/booking/customer/${phone}`);
//             const bData = await bRes.json();
//             setBookings(bData);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     }, [phone]);

//     useEffect(() => { fetchData(); }, [fetchData]);
//     // Corrected handleSubmit to match your DB schema fields

//     // Corrected handleSubmit for your Booking component
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setIsSubmitting(true);

//         const form = new FormData(e.target);

//         // Dynamically get the phone from sessionStorage to match the logged-in user
//         const currentPhone = sessionStorage.getItem("phone") || "9025626140";

//         const bookingPayload = {
//             customerPhone: currentPhone,
//             vehicle: form.get("vehicleId"), // This will now correctly send the ObjectId
//             serviceType: form.get("serviceType"),
//             appointmentDate: form.get("appointmentDate"),
//             problemDescription: form.get("problemDescription")
//         };

//         try {
//             const res = await fetch("http://localhost:5000/api/booking", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(bookingPayload)
//             });

//             const data = await res.json();

//             if (res.ok) {
//                 alert("Appointment Booked Successfully!");
//                 e.target.reset();
//                 fetchData();
//             } else {
//                 // Updated to handle both 'error' and 'message' fields from your backend
//                 alert("Booking Failed: " + (data.error || data.message || "Unknown Error"));
//             }
//         } catch (err) {
//             alert("Server Connection Error");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };


//     return (
//         <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
//             <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

//                 <div className="lg:col-span-12 mb-4">
//                     <h1 className="text-3xl font-bold text-slate-800">AutoCare Service Portal</h1>
//                     <p className="text-slate-500">Book your appointment and track status in real-time.</p>
//                 </div>

//                 {/* Left Side: Booking Form */}
//                 <div className="lg:col-span-5">
//                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
//                         <div className="flex items-center gap-2 mb-6">
//                             <ClipboardList className="text-indigo-600" />
//                             <h2 className="text-xl font-semibold">Schedule Service</h2>
//                         </div>

//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Select Vehicle</label>
//                                 <select
//                                     name="vehicleId"
//                                     className="..."
//                                     required
//                                 >
//                                     <option value="">Choose your registered vehicle</option>
//                                     {vehicles.map(v => (
//                                         // Use v._id.$oid or v._id depending on how your API returns the data
//                                         <option key={v._id.$oid || v._id} value={v._id.$oid || v._id}>
//                                             {v.brand} {v.model} — {v.vehicleNumber}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
//                                 <select name="serviceType" className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required>
//                                     <option value="">Choose Service</option>
//                                     <option value="General Service">General Service</option>
//                                     <option value="Oil Change">Oil Change</option>
//                                     <option value="Water Wash">Water Wash</option>
//                                     <option value="Repair">Repair</option>
//                                 </select>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
//                                 <input type="date" name="appointmentDate" className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none" required />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-slate-700 mb-1">Problem Description</label>
//                                 <textarea name="problemDescription" placeholder="Describe the issue..." className="w-full border-slate-300 rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none h-28" />
//                             </div>

//                             <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg disabled:opacity-50">
//                                 {isSubmitting ? "Processing..." : "Book Appointment"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>

//                 {/* Right Side: Booking List */}
//                 {/* Right Side Empty (Moved to Service Tracking Page) */}
// <div className="lg:col-span-7 flex items-center justify-center">
//     <div className="text-center text-slate-400">
//         <Car className="mx-auto mb-3" size={40} />
//         <p className="font-medium">Track your bookings in Service Tracking</p>
//     </div>
// </div>

//             </div>
//         </div>
//     );
// }

// export default Booking;




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