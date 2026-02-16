import React, { useEffect, useState } from "react";
import { Wrench, CheckCircle, Car } from "lucide-react";

function ServiceTracking() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const phone = sessionStorage.getItem("phone");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/customerServiceTrack/fetchbookings/${phone}`);
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
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">

            <div className="max-w-6xl mx-auto">

                <h1 className="text-3xl font-bold text-slate-800 mb-2">
                    Service Tracking
                </h1>

                <p className="text-slate-500 mb-8">
                    Track all your service bookings and status here.
                </p>

                {loading ? (
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (

                    <div className="bg-white border-2 border-dashed border-slate-200 p-12 text-center rounded-2xl">
                        <Car className="mx-auto w-12 h-12 text-slate-300 mb-2" />
                        <p className="text-slate-500 font-medium">
                            No bookings found.
                        </p>
                    </div>

                ) : (

                    <div className="space-y-4">

                        {bookings.map(b => (

                            <div
                                key={b._id}
                                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center"
                            >

                                <div className="flex items-center gap-4">

                                    <div className="p-3 bg-slate-50 rounded-full">
                                        <Wrench className="text-slate-400 w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {b.serviceType}
                                        </p>

                                        <p className="text-sm text-slate-500">
                                            Vehicle:
                                            <span className="text-slate-700 ml-1">
                                                {b.vehicle?.vehicleNumber}
                                            </span>
                                        </p>
                                    </div>

                                </div>

                                <div className="text-right">

                                    <p className="text-sm font-medium text-slate-800">
                                        {new Date(b.appointmentDate).toLocaleDateString()}
                                    </p>

                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase
                                        ${b.status === "Pending"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-green-100 text-green-700"
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
    );
}

export default ServiceTracking;
