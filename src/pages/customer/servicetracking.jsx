import React, { useEffect, useState } from "react";
import {
    Wrench,
    Car,
    Loader2,
    Calendar,
    Briefcase,
    ArrowRight,
    AlertCircle
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

            const res = await fetch(
                `http://localhost:5000/api/serviceTracking/${phone}`
            );

            const data = await res.json();

            setBookings(Array.isArray(data) ? data : []);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">

            {/* NAVBAR */}

            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">

                <div className="mx-auto h-16 flex items-center justify-between">

                    <div className="flex items-center gap-2 font-black text-xl">

                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <Briefcase size={20} />
                        </div>

                        Auto<span className="text-indigo-600">Care</span>

                    </div>

                    <div className="px-4 py-2 bg-emerald-50 rounded-xl text-emerald-700 text-[10px] font-black uppercase border border-emerald-100">

                        Live Status

                    </div>

                </div>

            </nav>


            <div className="mx-auto p-8">

                <h1 className="text-3xl font-black mb-8">
                    Service Timeline
                </h1>


                {loading ? (

                    <div className="flex justify-center py-20">

                        <Loader2
                            className="animate-spin text-indigo-600"
                            size={40}
                        />

                    </div>

                ) : (

                    <div className="grid gap-6">

                        {bookings.map((b) => (

                            <div
                                key={b._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm"
                            >

                                <div className="flex flex-col md:flex-row">

                                    {/* LEFT */}

                                    <div className="p-6 md:w-1/3 border-r border-slate-100">

                                        <StatusBadge
                                            status={b.displayStatus}
                                        />

                                        <h3 className="font-bold text-lg mt-2">
                                            {b.serviceType}
                                        </h3>

                                        <div className="text-xs text-slate-400">
                                            W/O: {b._id.slice(-8)}
                                        </div>

                                    </div>


                                    {/* CENTER */}

                                    <div className="flex-1 p-6 grid grid-cols-2 gap-4">

                                        <div>

                                            <div className="text-xs text-slate-400 uppercase">
                                                Vehicle
                                            </div>

                                            <div className="font-bold">
                                                {b.vehicle?.vehicleNumber}
                                            </div>

                                        </div>


                                        <div>

                                            <div className="text-xs text-slate-400 uppercase">
                                                Scheduled
                                            </div>

                                            <div className="font-bold">

                                                {new Date(
                                                    b.appointmentDate
                                                ).toLocaleDateString()}

                                            </div>

                                        </div>

                                    </div>


                                    {/* RIGHT */}

                                    <div className="p-6 flex items-center">

                                        <ArrowRight />

                                    </div>

                                </div>


                                {/* MESSAGE SECTION */}

                                {b.customerMessage && (

                                    <div className="px-6 pb-6">

                                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3">

                                            <AlertCircle
                                                className="text-rose-500"
                                                size={18}
                                            />

                                            <div>

                                                <div className="text-xs font-bold text-rose-600 uppercase">

                                                    Manager's Remark

                                                </div>

                                                <div className="text-sm text-rose-700">

                                                    {b.customerMessage}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )}

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

        Pending: "bg-yellow-50 text-yellow-700",
        "Checking Progress": "bg-indigo-50 text-indigo-700",
        "In Service": "bg-blue-50 text-blue-700",
        Completed: "bg-green-50 text-green-700",
        Rejected: "bg-red-50 text-red-700"

    };

    return (

        <span className={`px-2 py-1 text-xs font-bold rounded ${styles[status]}`}>

            {status}

        </span>

    );

};


export default ServiceTracking;