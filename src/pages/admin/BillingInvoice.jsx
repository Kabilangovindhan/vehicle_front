import React, { useEffect, useState } from "react";
import {
    Car,
    IndianRupee,
    FileText,
    Printer,
    CheckCircle2
} from "lucide-react";

function BillingInvoice() {

    const phone = sessionStorage.getItem("phone");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBilling();
    }, []);

    const fetchBilling = async () => {

        try {
            const res = await fetch(
                `http://localhost:5000/api/billingInvoice/${phone}`
            );

            const result = await res.json();

            setData(Array.isArray(result) ? result : []);
        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    const printInvoice = () => {
        window.print();
    };

    if (loading)
        return <div className="flex justify-center p-20">Loading...</div>;

    return (
        <div className="p-8 bg-slate-50 min-h-screen">

            <h1 className="text-3xl font-black mb-8">
                Billing & Invoice
            </h1>

            {data.length === 0 && (
                <div>No Ready Delivery Jobs</div>
            )}

            {data.map((item, index) => {

                const job = item.job;
                const estimate = item.estimate;

                if (!estimate) return null;

                return (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow border mb-10 p-8"
                    >

                        {/* HEADER */}
                        <div className="flex justify-between items-center border-b pb-4 mb-6">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Invoice
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Invoice No: {job._id.slice(-6)}
                                </p>
                            </div>

                            <button
                                onClick={printInvoice}
                                className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
                            >
                                <Printer size={16} />
                                Print
                            </button>
                        </div>

                        {/* VEHICLE INFO */}
                        <div className="flex items-center gap-4 mb-6">
                            <Car className="text-indigo-600" />
                            <div>
                                <div className="font-bold">
                                    {job.booking?.vehicle?.vehicleNumber}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {job.booking?.vehicle?.brand} {" "}
                                    {job.booking?.vehicle?.model}
                                </div>
                            </div>
                        </div>

                        {/* TABLE */}
                        <table className="w-full border mb-6">
                            <thead>
                                <tr className="bg-gray-100 text-sm">
                                    <th className="p-2">Issue</th>
                                    <th>Labour</th>
                                    <th>Parts</th>
                                    <th>Total</th>
                                </tr>
                            </thead>

                            <tbody>
                                {estimate.items?.map((it, i) => (
                                    <tr key={i} className="text-center">
                                        <td className="p-2">
                                            {it.issueTitle}
                                        </td>
                                        <td>₹{it.labourCharge}</td>
                                        <td>₹{it.partsCost}</td>
                                        <td className="font-bold">
                                            ₹{it.total}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* SUMMARY */}
                        <div className="text-right space-y-2">
                            <div>
                                Tax: ₹{estimate.tax}
                            </div>
                            <div className="text-xl font-bold text-indigo-600">
                                Grand Total: ₹{estimate.grandTotal}
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-8 text-green-600 flex items-center gap-2 font-bold">
                            <CheckCircle2 size={18} />
                            Ready for Delivery
                        </div>

                    </div>
                );
            })}
        </div>
    );
}

export default BillingInvoice;