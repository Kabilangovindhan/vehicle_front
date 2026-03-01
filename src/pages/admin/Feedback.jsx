import React, { useEffect, useState } from "react";
import { Star, MessageSquare, User, Calendar, Car, Wrench, ChevronDown, ChevronUp } from "lucide-react";

function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [average, setAverage] = useState(0);
    const [expandedId, setExpandedId] = useState(null);
    const [filterRating, setFilterRating] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');
    const [stats, setStats] = useState({
        total: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0
    });

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/adminfeedback/admin/all");
            const data = await response.json();
            setFeedbacks(data);
            calculateStats(data);
            calculateAverage(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const stats = {
            total: data.length,
            fiveStar: data.filter(fb => fb.rating === 5).length,
            fourStar: data.filter(fb => fb.rating === 4).length,
            threeStar: data.filter(fb => fb.rating === 3).length,
            twoStar: data.filter(fb => fb.rating === 2).length,
            oneStar: data.filter(fb => fb.rating === 1).length
        };
        setStats(stats);
    };

    const calculateAverage = (data) => {
        if (data.length === 0) return;
        const total = data.reduce((sum, fb) => sum + fb.rating, 0);
        const avg = (total / data.length).toFixed(1);
        setAverage(avg);
    };

    const getFilteredAndSortedFeedbacks = () => {
        let filtered = [...feedbacks];
        
        // Filter by rating
        if (filterRating !== 'all') {
            filtered = filtered.filter(fb => fb.rating === parseInt(filterRating));
        }
        
        // Sort
        filtered.sort((a, b) => {
            if (sortOrder === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortOrder === 'oldest') {
                return new Date(a.createdAt) - new Date(b.createdAt);
            } else if (sortOrder === 'highest') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });
        
        return filtered;
    };

    const getRatingPercentage = (count) => {
        if (stats.total === 0) return 0;
        return ((count / stats.total) * 100).toFixed(1);
    };

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading feedback...</p>
                </div>
            </div>
        );
    }

    const filteredFeedbacks = getFilteredAndSortedFeedbacks();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Customer Feedback</h1>
                    <p className="mt-2 text-gray-600">Manage and analyze all customer reviews and ratings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Average Rating Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Star className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-gray-900">{average}</span>
                            <span className="text-gray-500">/ 5.0</span>
                        </div>
                        <div className="flex gap-1 mt-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${
                                        average >= star
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Total Feedback Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Total Feedback</h3>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <span className="text-4xl font-bold text-gray-900">{stats.total}</span>
                        <p className="text-gray-500 mt-2">Total reviews received</p>
                    </div>

                    {/* Response Rate Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <MessageSquare className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <span className="text-4xl font-bold text-gray-900">
                            {feedbacks.filter(fb => fb.comment).length}
                        </span>
                        <p className="text-gray-500 mt-2">Reviews with comments</p>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center gap-4">
                                <div className="flex items-center gap-1 w-16">
                                    <span className="text-sm font-medium text-gray-700">{rating}</span>
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-yellow-400 rounded-full"
                                        style={{ width: `${getRatingPercentage(stats[`${rating}Star`])}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-20">
                                    {stats[`${rating}Star`]} ({getRatingPercentage(stats[`${rating}Star`])}%)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filters and Sort */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Rating</label>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Rating</option>
                            <option value="lowest">Lowest Rating</option>
                        </select>
                    </div>
                </div>

                {/* Feedback List */}
                {filteredFeedbacks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
                        <p className="text-gray-500">No feedback matches your current filters.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredFeedbacks.map(fb => (
                            <div
                                key={fb._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Header */}
                                <div 
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleExpand(fb._id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            size={18}
                                                            className={`${
                                                                fb.rating >= star
                                                                    ? "text-yellow-500 fill-yellow-500"
                                                                    : "text-gray-300"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(fb.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-700 line-clamp-2">
                                                {fb.comment || "No comment provided"}
                                            </p>
                                        </div>
                                        <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg">
                                            {expandedId === fb._id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Quick Info Tags */}
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                            <User className="w-4 h-4" />
                                            {fb.customer?.name || "Unknown"}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                            <Car className="w-4 h-4" />
                                            {fb.job?.booking?.vehicle?.vehicleNumber || "N/A"}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                                            <Wrench className="w-4 h-4" />
                                            {fb.job?.assignedStaff?.name || "No staff"}
                                        </span>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedId === fb._id && (
                                    <div className="border-t border-gray-200 bg-gray-50 p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Detailed Information</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Customer Details</p>
                                                <p className="font-medium">{fb.customer?.name}</p>
                                                <p className="text-sm text-gray-600">{fb.customer?.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Staff Member</p>
                                                <p className="font-medium">{fb.job?.assignedStaff?.name || "N/A"}</p>
                                                <p className="text-sm text-gray-600">{fb.job?.assignedStaff?.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Vehicle Information</p>
                                                <p className="font-medium">{fb.job?.booking?.vehicle?.vehicleNumber}</p>
                                                <p className="text-sm text-gray-600">
                                                    {fb.job?.booking?.vehicle?.brand} {fb.job?.booking?.vehicle?.model}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 mb-1">Job Details</p>
                                                <p className="font-medium">Job ID: {fb.job?._id?.slice(-6)}</p>
                                                <p className="text-sm text-gray-600">
                                                    <Calendar className="w-4 h-4 inline mr-1" />
                                                    {new Date(fb.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminFeedback;