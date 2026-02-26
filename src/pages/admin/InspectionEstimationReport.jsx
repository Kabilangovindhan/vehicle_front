import React, { useEffect, useState } from "react";

import {
    Car,
    User,
    ClipboardList,
    Wrench,
    IndianRupee,
    FileText,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock
} from "lucide-react";

function InspectionEstimateReport() {

    const phone = sessionStorage.getItem("phone");

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {

        try {

            const res = await fetch(
                `http://localhost:5000/api/customer-report/${phone}`
            );

            const result = await res.json();

            setData(result);

        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );

    return (
        <div className="p-6 space-y-6">

            <h1 className="text-3xl font-bold">
                Inspection & Estimate Report
            </h1>

            {data.length === 0 && (
                <div>No data found</div>
            )}

            {data.map((item, index) => {

                const est = item.estimate;
                const inspection = item.inspection;

                return (
                    <div
                        key={index}
                        className="bg-white shadow rounded-xl overflow-hidden border"
                    >

                        {/* HEADER */}

                        <div className="bg-gray-900 text-white p-4 flex justify-between">

                            <div className="flex gap-3">

                                <Car />

                                <div>

                                    <div className="font-bold">
                                        {est.job?.booking?.vehicle?.vehicleNumber}
                                    </div>

                                    <div className="text-sm">
                                        {est.job?.booking?.vehicle?.brand}
                                        {" "}
                                        {est.job?.booking?.vehicle?.model}
                                    </div>

                                </div>

                            </div>

                            <StatusBadge status={est.approvalStatus} />

                        </div>

                        <div className="p-4 grid md:grid-cols-2 gap-6">

                            {/* INSPECTION */}

                            <div>

                                <h2 className="font-bold mb-2 flex gap-2">
                                    <ClipboardList />
                                    Inspection
                                </h2>

                                {inspection?.issuesFound?.map(
                                    (issue, i) => (
                                        <div key={i} className="border p-2 rounded mb-2">
                                            {issue.title || issue}
                                        </div>
                                    )
                                )}

                                <div className="mt-2 text-sm italic">
                                    Remarks:
                                    {" "}
                                    {inspection?.remarks || "None"}
                                </div>

                            </div>

                            {/* ESTIMATE */}

                            <div>

                                <h2 className="font-bold mb-2 flex gap-2">
                                    <IndianRupee />
                                    Estimate
                                </h2>

                                <table className="w-full border">

                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th>Issue</th>
                                            <th>Labour</th>
                                            <th>Parts</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {est.items?.map((it, i) => (
                                            <tr key={i}>
                                                <td>{it.issueTitle}</td>
                                                <td>{it.labourCharge}</td>
                                                <td>{it.partsCost}</td>
                                                <td>{it.total}</td>
                                            </tr>
                                        ))}

                                    </tbody>

                                </table>

                                <div className="mt-3">

                                    <div>
                                        Tax: ₹{est.tax}
                                    </div>

                                    <div className="font-bold">
                                        Grand Total: ₹{est.grandTotal}
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
                );
            })}
        </div>
    );
}

function StatusBadge({ status }) {

    const config = {

        Pending: {
            icon: Clock,
            color: "text-yellow-500"
        },

        Approved: {
            icon: CheckCircle2,
            color: "text-green-500"
        },

        Rejected: {
            icon: XCircle,
            color: "text-red-500"
        }
    };

    const Icon = config[status]?.icon || Clock;

    return (
        <div className={`flex gap-1 ${config[status]?.color}`}>
            <Icon size={18} />
            {status}
        </div>
    );
}

export default InspectionEstimateReport;