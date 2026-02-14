import React, { useEffect, useState } from "react";
import {
    Wrench, Car, User, ClipboardList, CheckCircle2,
    Clock, ChevronRight, X, Loader2, Save
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function AssignedJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = () => {
        setLoading(true);
        fetch("http://localhost:5000/api/staff/jobs", {
            headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` }
        })
            .then(res => res.json())
            .then(data => {
                setJobs(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    };

    const handleUpdateClick = (job) => {
        setSelectedJob(job);
        setNewStatus(job.jobStatus); // Pre-fill with current status
        setIsModalOpen(true);
    };

    const submitStatusUpdate = async () => {
        if (!selectedJob) return;
        setIsUpdating(true);

        try {
            const res = await fetch(`http://localhost:5000/api/booking/${selectedJob.booking._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local state to reflect change immediately
                setJobs(prev => prev.map(j =>
                    j._id === selectedJob._id ? { ...j, jobStatus: newStatus } : j
                ));
                setIsModalOpen(false);
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-12 relative">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10 p-6">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <ClipboardList className="text-indigo-600" /> My Work Queue
                        </h1>
                        <p className="text-slate-500 text-sm">You have {jobs.length} assignments</p>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 mt-6 space-y-4">

                {jobs.map(job => (

                    <div key={job._id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row gap-6">

                        {/* LEFT SIDE */}
                        <div className="flex-1">

                            <div className="flex items-center gap-3 mb-4">

                                <Wrench className="text-indigo-600" size={20} />

                                <h3 className="font-bold text-lg">
                                    {job.booking.serviceType}
                                </h3>

                                <span className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                                    {job.jobStatus}
                                </span>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Car size={16} />
                                    {job.booking.vehicle.vehicleNumber}
                                </div>

                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <User size={16} />
                                    {job.booking.customer.name}
                                </div>

                            </div>

                        </div>

                        {/* RIGHT SIDE BUTTONS */}
                        <div className="flex flex-col gap-2">

                            {/* Inspection Button */}
                            <button
                                onClick={() => navigate(`/layout/inspection/${job._id}`)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Inspection
                            </button>

                            {/* Estimate Button */}
                            <button
                                onClick={() => navigate(`/layout/create-estimate/${job._id}`)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                Create Estimate
                            </button>

                            {/* Update Progress Button */}
                            <button
                                onClick={() => handleUpdateClick(job)}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                            >
                                Update Progress
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {/* --- UPDATE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUpdating && setIsModalOpen(false)} />

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-bold text-slate-900 text-lg">Update Job Status</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-4">
                                Changing status for <span className="font-bold text-slate-700">{selectedJob?.booking.serviceType}</span> ({selectedJob?.booking.vehicle.vehicleNumber})
                            </p>

                            <div className="space-y-3">
                                {["Pending", "In Progress", "Completed"].map((status) => (
                                    <label
                                        key={status}
                                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${newStatus === status
                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                            : "border-slate-100 hover:border-slate-200 text-slate-600"
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            className="hidden"
                                            name="status"
                                            value={status}
                                            checked={newStatus === status}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        />
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${newStatus === status ? "border-indigo-600" : "border-slate-300"}`}>
                                            {newStatus === status && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                        </div>
                                        <span className="font-bold text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                                disabled={isUpdating}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={submitStatusUpdate}
                                disabled={isUpdating || newStatus === selectedJob?.jobStatus}
                                className="flex-1 py-2.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none"
                            >
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignedJobs;