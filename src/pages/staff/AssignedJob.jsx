import React, { useEffect, useState } from "react";
import {
    Briefcase,
    Car,
    User,
    Loader2,
    Wrench
} from "lucide-react";

function AssignedJob() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const phone = sessionStorage.getItem("phone");

    useEffect(() => {

        fetchJobs();

    }, []);

    const fetchJobs = async () => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/jobManagement/fetch/${phone}`
            );

            const data = await res.json();

            setJobs(data);

        }
        catch (err) {

            console.log(err);

        }
        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center">

                <Loader2 className="animate-spin text-indigo-600" size={40} />

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-50 p-8">

            <div className="flex items-center gap-3 mb-8">

                <div className="bg-indigo-600 p-2 rounded-xl text-white">

                    <Briefcase size={24} />

                </div>

                <h1 className="text-3xl font-black">

                    Assigned Jobs

                </h1>

            </div>


            {jobs.length === 0 ? (

                <p>No jobs assigned</p>

            ) : (

                <div className="grid gap-6 max-w-5xl">

                    {jobs.map(job => (

                        <div key={job._id}
                            className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

                            <div className="flex justify-between">

                                <div className="flex gap-4">

                                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">

                                        <Wrench size={20} />

                                    </div>

                                    <div>

                                        <h3 className="font-bold">

                                            {job.booking?.serviceType}

                                        </h3>

                                        <div className="text-sm text-slate-500 mt-2 flex gap-4">

                                            <span className="flex gap-1">

                                                <Car size={14} />

                                                {job.booking?.vehicle?.vehicleNumber}

                                            </span>

                                            <span className="flex gap-1">

                                                <User size={14} />

                                                {job.booking?.customer?.name}

                                            </span>

                                        </div>

                                    </div>

                                </div>


                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">

                                    {job.jobStatus}

                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default AssignedJob;