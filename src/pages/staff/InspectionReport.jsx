import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Save, X, ChevronLeft } from "lucide-react";

function InspectionReport() {
    const { jobId } = useParams();
    const navigate = useNavigate();

    const [issueInput, setIssueInput] = useState("");
    const [issues, setIssues] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addIssue = () => {
        if (issueInput.trim()) {
            setIssues([...issues, issueInput.trim()]);
            setIssueInput("");
        }
    };

    const removeIssue = (index) => {
        setIssues(issues.filter((_, i) => i !== index));
    };

    const saveInspection = async () => {
        if (issues.length === 0) {
            alert("Please add at least one issue.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/inspectionReport/save/${jobId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        issuesFound: issues,
                        remarks
                    })
                }
            );

            if (res.ok) {
                alert("Inspection Saved Successfully");
                navigate(`/layout/estimate/${jobId}`);
            }
        } catch (error) {
            alert("Failed to save inspection.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
                {/* Navigation & Header */}
                <div className="flex items-center justify-between mb-6">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors font-semibold"
                    >
                        <ChevronLeft size={20} /> Back
                    </button>
                    <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-sm">
                        Step 1: Inspection
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <ClipboardList className="text-indigo-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">Vehicle Inspection</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Issues Section */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Identified Issues
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        value={issueInput}
                                        onChange={(e) => setIssueInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addIssue()}
                                        placeholder="e.g., Brake pads worn out"
                                        className="flex-1 border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                                    />
                                    <button
                                        onClick={addIssue}
                                        className="bg-slate-900 text-white px-4 py-3 rounded-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                {/* Issue Badges */}
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {issues.map((issue, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg text-sm font-bold border border-indigo-100 animate-in fade-in zoom-in duration-200"
                                        >
                                            {issue}
                                            <button onClick={() => removeIssue(index)} className="hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {issues.length === 0 && (
                                        <p className="text-slate-400 text-sm italic">No issues added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Remarks Section */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    Technician Remarks
                                </label>
                                <textarea
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    placeholder="Add any additional notes here..."
                                    rows="4"
                                    className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={saveInspection}
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : <><Save size={20} /> Save & Continue</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InspectionReport;