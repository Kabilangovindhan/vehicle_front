import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";

function StaffFeedback() {

    const staffId = sessionStorage.getItem("userId");
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (!staffId) return;

        fetch(`http://localhost:5000/api/feedbackStaff/staff/${staffId}`) // ✅ corrected URL
            .then(res => res.json())
            .then(data => {
                setFeedbacks(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                setLoading(false);
            });

    }, [staffId]);

    if (loading) {
        return <div className="p-8 text-gray-500">Loading feedback...</div>;
    }

    return (
        <div className="p-8">

            <h2 className="text-2xl font-bold mb-6">
                My Service Feedback
            </h2>

            {feedbacks.length === 0 && (
                <p className="text-gray-500">
                    No feedback received yet.
                </p>
            )}

            {feedbacks.map(fb => (
                <div
                    key={fb._id}
                    className="bg-white shadow-md border rounded-lg p-6 mb-6"
                >

                    {/* Vehicle Info */}
                    <div className="mb-3">
                        <p><strong>Vehicle:</strong> {fb.job?.booking?.vehicle?.vehicleNumber || "N/A"}</p>
                        <p><strong>Customer:</strong> {fb.customer?.name || "N/A"}</p>
                        <p><strong>Date:</strong> {new Date(fb.createdAt).toLocaleDateString()}</p>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-3">
                        {[1,2,3,4,5].map(star => (
                            <Star
                                key={star}
                                size={20}
                                className={`${
                                    fb.rating >= star
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 italic">
                        "{fb.comment || "No comment provided"}"
                    </p>

                </div>
            ))}
        </div>
    );
}

export default StaffFeedback;