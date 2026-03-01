import React, { useEffect, useState } from "react";
import { Star, MessageSquare, CheckCircle, XCircle, AlertCircle, Truck, Calendar } from "lucide-react";

function CustomerFeedback() {
    const customerId = sessionStorage.getItem("userId");
    
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [hoveredStar, setHoveredStar] = useState(0);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        if (customerId) {
            fetchDeliveredJobs();
        }
    }, [customerId]);

    const fetchDeliveredJobs = async () => {
        if (!customerId) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const res = await fetch(`http://localhost:5000/api/feedback/customer/${customerId}`);
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch jobs');
            }
            
            const data = await res.json();
            setJobs(data);
            
        } catch (err) {
            setError(err.message);
            console.error('Error fetching jobs:', err);
        } finally {
            setLoading(false);
        }
    };

    const submitFeedback = async () => {
        if (!selectedJob) {
            setError("Please select a job to provide feedback");
            return;
        }
        
        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const res = await fetch("http://localhost:5000/api/feedback/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId,
                    jobId: selectedJob._id,
                    rating,
                    comment: comment.trim()
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to submit feedback');
            }

            setSuccessMessage(data.message);
            
            // Update local state to show feedback was given
            setJobs(prevJobs => 
                prevJobs.map(job => 
                    job._id === selectedJob._id 
                        ? { ...job, hasFeedback: true, feedback: { rating, comment } }
                        : job
                )
            );
            
            // Reset form and close modal after success
            setTimeout(() => {
                setSelectedJob(null);
                setRating(0);
                setComment("");
                setSuccessMessage(null);
            }, 2000);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const formatVehicleInfo = (job) => {
        if (!job.booking?.vehicle) return 'Vehicle information not available';
        
        const vehicle = job.booking.vehicle;
        const parts = [];
        
        if (vehicle.vehicleNumber) parts.push(vehicle.vehicleNumber);
        if (vehicle.model) parts.push(vehicle.model);
        if (vehicle.make) parts.push(vehicle.make);
        if (vehicle.year) parts.push(vehicle.year);
        
        return parts.join(' • ') || 'Vehicle information not available';
    };

    if (!customerId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Please log in to access feedback section</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Customer Feedback</h1>
                    <p className="mt-2 text-gray-600">Share your experience with our service</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                        <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700">{error}</p>
                    </div>
                )}
                
                {successMessage && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-green-700">{successMessage}</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Loading your delivered jobs...</p>
                    </div>
                )}

                {/* Jobs List */}
                {!loading && jobs.length === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Delivered Jobs</h3>
                        <p className="text-gray-500">You don't have any completed jobs to review yet.</p>
                    </div>
                )}

                {!loading && jobs.length > 0 && (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div 
                                key={job._id} 
                                className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
                                    selectedJob?._id === job._id ? 'ring-2 ring-indigo-500' : ''
                                }`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        <div className="flex-1">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <span className="text-sm font-medium text-gray-500">
                                                    Job #{job._id.slice(-6)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    job.jobStatus === 'Delivered' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {job.jobStatus}
                                                </span>
                                                {job.hasFeedback && (
                                                    <span className="flex items-center text-sm text-green-600">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Feedback Given
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="flex items-start space-x-2">
                                                    <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Vehicle</p>
                                                        <p className="font-medium text-gray-900">
                                                            {formatVehicleInfo(job)}
                                                        </p>
                                                        {job.booking?.serviceType && (
                                                            <p className="text-sm text-gray-600">
                                                                Service: {job.booking.serviceType}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {job.booking?.serviceDate && (
                                                    <div className="flex items-start space-x-2">
                                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Service Date</p>
                                                            <p className="font-medium text-gray-900">
                                                                {formatDate(job.booking.serviceDate)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Existing Feedback Display */}
                                            {job.feedback && (
                                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                                        Your Feedback:
                                                    </p>
                                                    <div className="flex items-center mb-2">
                                                        {[1,2,3,4,5].map(star => (
                                                            <Star
                                                                key={star}
                                                                className={`w-4 h-4 ${
                                                                    star <= job.feedback.rating 
                                                                        ? 'text-yellow-500 fill-yellow-500' 
                                                                        : 'text-gray-300'
                                                                }`}
                                                            />
                                                        ))}
                                                        <span className="ml-2 text-sm text-gray-600">
                                                            {new Date(job.feedback.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    {job.feedback.comment && (
                                                        <p className="text-sm text-gray-600 italic">
                                                            "{job.feedback.comment}"
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Give Feedback Button */}
                                        {!job.hasFeedback && (
                                            <div className="mt-4 lg:mt-0 lg:ml-4">
                                                <button
                                                    onClick={() => {
                                                        setSelectedJob(job);
                                                        setRating(0);
                                                        setComment("");
                                                        setError(null);
                                                    }}
                                                    disabled={selectedJob !== null}
                                                    className={`w-full lg:w-auto px-6 py-2 rounded-lg font-medium transition-colors ${
                                                        selectedJob === null
                                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                    }`}
                                                >
                                                    Give Feedback
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Feedback Form Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Rate Your Service
                                    </h3>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">Vehicle</p>
                                    <p className="font-medium text-gray-900">
                                        {formatVehicleInfo(selectedJob)}
                                    </p>
                                    {selectedJob.booking?.serviceDate && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Service Date: {formatDate(selectedJob.booking.serviceDate)}
                                        </p>
                                    )}
                                    {selectedJob.booking?.serviceType && (
                                        <p className="text-sm text-gray-500">
                                            Service Type: {selectedJob.booking.serviceType}
                                        </p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Your Rating <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex justify-center gap-2">
                                        {[1,2,3,4,5].map(star => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                className="focus:outline-none transform hover:scale-110 transition-transform"
                                                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                                            >
                                                <Star
                                                    className={`w-8 h-8 ${
                                                        star <= (hoveredStar || rating)
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300 hover:text-yellow-200'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-center mt-2 text-sm text-gray-600">
                                        {rating === 1 && 'Poor'}
                                        {rating === 2 && 'Fair'}
                                        {rating === 3 && 'Good'}
                                        {rating === 4 && 'Very Good'}
                                        {rating === 5 && 'Excellent'}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label 
                                        htmlFor="comment" 
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Your Feedback (Optional)
                                    </label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us about your experience..."
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={submitFeedback}
                                        disabled={submitting || rating === 0}
                                        className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                                            submitting || rating === 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                        }`}
                                    >
                                        {submitting ? (
                                            <span className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit Feedback'
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomerFeedback;