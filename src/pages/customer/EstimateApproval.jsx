import React, { useEffect, useState } from "react";

function EstimateReport() {

    const [estimates, setEstimates] = useState([]);

    const phone = sessionStorage.getItem("phone");


    useEffect(() => {

        fetchEstimate();

    }, []);


    const fetchEstimate = async () => {

        const res = await fetch(
            `http://localhost:5000/api/customer/estimate/${phone}`
        );

        const data = await res.json();

        setEstimates(data);

    };


    const approveEstimate = async (id) => {

        await fetch(
            `http://localhost:5000/api/customer/estimate/approve/${id}`,
            {
                method: "PUT"
            }
        );

        fetchEstimate();

    };


    const rejectEstimate = async (id) => {

        await fetch(
            `http://localhost:5000/api/customer/estimate/reject/${id}`,
            {
                method: "PUT"
            }
        );

        fetchEstimate();

    };


    return (

        <div className="p-8">

            <h1 className="text-2xl font-bold mb-6">
                Service Estimate Report
            </h1>


            {

                estimates.length === 0 ?

                <p>No estimate available</p>

                :

                estimates.map(est => (

                    <div
                        key={est._id}
                        className="bg-white shadow p-6 mb-4 rounded"
                    >

                        <h3 className="font-bold">

                            Vehicle:
                            {
                                est.job.booking.vehicle.vehicleNumber
                            }

                        </h3>

                        <p>
                            Labour Charge:
                            ₹{est.labourCharge}
                        </p>

                        <p>
                            Parts Cost:
                            ₹{est.partsCost}
                        </p>

                        <p>
                            Tax:
                            ₹{est.tax}
                        </p>

                        <h3 className="font-bold">

                            Total Amount:
                            ₹{est.totalAmount}

                        </h3>


                        <p>

                            Status:
                            <span className="font-bold ml-2">

                                {est.approvalStatus}

                            </span>

                        </p>


                        {

                            est.approvalStatus === "Pending" &&

                            <div className="mt-4">

                                <button
                                    onClick={() =>
                                        approveEstimate(est._id)
                                    }
                                    className="bg-green-600 text-white px-4 py-2 mr-2"
                                >
                                    Approve
                                </button>


                                <button
                                    onClick={() =>
                                        rejectEstimate(est._id)
                                    }
                                    className="bg-red-600 text-white px-4 py-2"
                                >
                                    Reject
                                </button>

                            </div>

                        }

                    </div>

                ))

            }

        </div>

    );

}

export default EstimateReport;
