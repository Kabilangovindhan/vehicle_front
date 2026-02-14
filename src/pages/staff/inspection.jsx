import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ClipboardCheck, 
    AlertCircle, 
    PlusCircle, 
    X, 
    ChevronLeft, 
    Loader2,
    FileText
} from "lucide-react";

function InspectionPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    
    const [issues, setIssues] = useState([]);
    const [remarks, setRemarks] = useState("");
    const [currentIssue, setCurrentIssue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addIssue = () => {
        if (currentIssue.trim()) {
            setIssues([...issues, currentIssue.trim()]);
            setCurrentIssue("");
        }
    };

    const removeIssue = (index) => {
        setIssues(issues.filter((_, i) => i !== index));
    };

    const submitInspection = async () => {
        if (issues.length === 0) {
            alert("Please add at least one issue found during inspection.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch(
                `http://localhost:5000/api/staff/inspection/${jobId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ issues, remarks })
                }
            );

            if (res.ok) {
                alert("Inspection report submitted successfully!");
                navigate(-1); // Go back to assigned jobs
            } else {
                throw new Error("Submission failed");
            }
        } catch (err) {
            alert("Error: Could not submit inspection. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header & Back Navigation */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Work Queue</span>
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Title Section */}
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-50 rounded-xl">
                                <ClipboardCheck className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Vehicle Inspection</h2>
                                <p className="text-sm text-slate-500 font-mono">JOB ID: {jobId?.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Issues Section */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                                <AlertCircle size={16} className="text-amber-500" />
                                Issues Identified
                            </label>
                            
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                    placeholder="Type an issue (e.g. Brake pads worn)"
                                    value={currentIssue}
                                    onChange={(e) => setCurrentIssue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIssue())}
                                />
                                <button 
                                    onClick={addIssue}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-colors"
                                >
                                    <PlusCircle size={22} />
                                </button>
                            </div>

                            {/* Issue List/Chips */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {issues.length === 0 ? (
                                    <p className="text-slate-400 text-sm italic">No issues added yet...</p>
                                ) : (
                                    issues.map((issue, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-200 animate-in fade-in zoom-in duration-200"
                                        >
                                            {issue}
                                            <button 
                                                onClick={() => removeIssue(index)}
                                                className="text-slate-400 hover:text-red-500 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Remarks Section */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 uppercase tracking-wider">
                                <FileText size={16} className="text-slate-400" />
                                Additional Remarks
                            </label>
                            <textarea
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                                placeholder="Describe the overall condition of the vehicle..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>

                        {/* Submit Action */}
                        <div className="pt-4">
                            <button 
                                onClick={submitInspection}
                                disabled={isSubmitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Submitting Report...
                                    </>
                                ) : (
                                    "Submit Inspection Report"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InspectionPage;