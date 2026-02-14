import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

function EstimateApproval() {

    const { jobId } = useParams();

    const [estimate, setEstimate] = useState(null);

    useEffect(() => {

        fetch(
            `http://localhost:5000/api/customer/estimate/${jobId}`,
            {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        )
        .then(res => res.json())
        .then(setEstimate);

    }, []);

    const approve = async () => {

        await fetch(
            `http://localhost:5000/api/customer/estimate/${estimate._id}/approve`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        );

        alert("Approved");

    };

    const reject = async () => {

        await fetch(
            `http://localhost:5000/api/customer/estimate/${estimate._id}/reject`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
            }
        );

        alert("Rejected");

    };

    if (!estimate) return <p>Loading...</p>;

    return (

        <div>

            <h2>SERVICE ESTIMATE</h2>

            <p>Labour: ₹{estimate.labourCost}</p>

            <p>Parts: ₹{estimate.partsCost}</p>

            <p>Tax: ₹{estimate.tax}</p>

            <h3>Total: ₹{estimate.totalCost}</h3>

            <button onClick={approve}>
                Approve Work
            </button>

            <button onClick={reject}>
                Reject Work
            </button>

        </div>

    );

}

export default EstimateApproval;
