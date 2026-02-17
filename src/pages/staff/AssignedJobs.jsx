import React, { useState } from "react";
import { Wrench, Car, User, ClipboardList, X, Loader2, Save } from "lucide-react";

function AssignedJobs() {

    const [modal, setModal] = useState(false);

    const jobs = [
        {
            _id: "1",
            jobStatus: "Pending",
            booking: {
                serviceType: "General Service",
                vehicle: { vehicleNumber: "TN01AB1234" },
                customer: { name: "Rahul" }
            }
        }
    ];

    const selectedJob = jobs[0];
    const newStatus = "Pending";
    const isUpdating = false;

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
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Wrench className="text-indigo-600" size={20} />
                                <h3 className="font-bold text-lg">{job.booking.serviceType}</h3>
                                <span className="ml-auto px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                                    {job.jobStatus}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <Car size={16} /> {job.booking.vehicle.vehicleNumber}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600 text-sm">
                                    <User size={16} /> {job.booking.customer.name}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Inspection</button>
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Create Estimate</button>
                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Update Progress</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Static Modal UI */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="font-bold text-slate-900 text-lg">Update Job Status</h2>
                            <button className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>

                        <div className="p-6">
                            <p className="text-sm text-slate-500 mb-4">
                                Changing status for <span className="font-bold text-slate-700">{selectedJob.booking.serviceType}</span> ({selectedJob.booking.vehicle.vehicleNumber})
                            </p>

                            <div className="space-y-3">
                                {["Pending", "In Progress", "Completed"].map((status) => (
                                    <label key={status} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${newStatus === status ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-100 hover:border-slate-200 text-slate-600"}`}>
                                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${newStatus === status ? "border-indigo-600" : "border-slate-300"}`}>
                                            {newStatus === status && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                        </div>
                                        <span className="font-bold text-sm">{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 flex gap-3">
                            <button className="flex-1 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors">Cancel</button>
                            <button className="flex-1 py-2.5 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                                {isUpdating ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Confirm Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignedJobs;