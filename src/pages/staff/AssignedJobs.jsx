import React, { useEffect, useState } from "react";

function AssignedJobs() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/staff/jobs", {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`
            }
        })
        .then(res => res.json())
        .then(data => setJobs(data));

    }, []);

    return (

        <div className="p-6">

            <h1 className="text-2xl font-bold mb-6">
                My Assigned Jobs
            </h1>

            {jobs.map(job => (

                <div
                    key={job._id}
                    className="bg-white shadow rounded-lg p-4 mb-4"
                >

                    <h3 className="font-bold text-lg">
                        {job.booking.serviceType}
                    </h3>

                    <p>
                        Vehicle: {job.booking.vehicle.vehicleNumber}
                    </p>

                    <p>
                        Customer: {job.booking.customer.name}
                    </p>

                    <p>
                        Status: {job.jobStatus}
                    </p>

                </div>

            ))}

        </div>

    );

}

export default AssignedJobs;
