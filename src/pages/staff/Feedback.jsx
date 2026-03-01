import React, { useEffect, useState } from "react";
import { Star, MessageCircle, Calendar, Truck, User, AlertCircle, Filter, ChevronDown } from "lucide-react";

const StaffFeedback = () => {
  const staffId = sessionStorage.getItem("userId");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterRating, setFilterRating] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });

  useEffect(() => {
    if (!staffId) {
      setError("Staff ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `http://localhost:5000/api/feedbackStaff/staff/${staffId}`,
          {
            headers: {
              'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch feedback: ${response.status}`);
        }

        const data = await response.json();
        setFeedbacks(data);
        calculateStats(data);
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "Failed to load feedback. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [staffId]);

  const calculateStats = (data) => {
    if (!data.length) return;

    const total = data.length;
    const sum = data.reduce((acc, fb) => acc + fb.rating, 0);
    const average = (sum / total).toFixed(1);
    
    const distribution = data.reduce((acc, fb) => {
      acc[fb.rating] = (acc[fb.rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    setStats({ total, average, distribution });
  };

  const getFilteredAndSortedFeedbacks = () => {
    let filtered = [...feedbacks];

    // Apply rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter(fb => fb.rating === parseInt(filterRating));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === "highest") {
        return b.rating - a.rating;
      } else if (sortOrder === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    return filtered;
  };

  const renderRatingStars = (rating, size = 20) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`transition-colors ${
              rating >= star
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300 fill-gray-300"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const maxCount = Math.max(...Object.values(stats.distribution));
    
    return [5, 4, 3, 2, 1].map(rating => (
      <div key={rating} className="flex items-center gap-2 text-sm">
        <span className="w-3 font-medium">{rating}</span>
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-yellow-400 rounded-full transition-all duration-300"
            style={{ 
              width: `${maxCount ? (stats.distribution[rating] / maxCount) * 100 : 0}%` 
            }}
          />
        </div>
        <span className="w-8 text-gray-600">{stats.distribution[rating]}</span>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading your feedback...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Feedback</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Try Again
          </button>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Service Feedback
          </h1>
          <p className="text-gray-600">
            View and analyze feedback from your completed services
          </p>
        </div>

        {/* Stats Overview */}
        {feedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-2">Average Rating</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-gray-900">{stats.average}</p>
                <Star size={24} className="text-yellow-400 fill-yellow-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 md:col-span-2">
              <p className="text-sm font-medium text-gray-600 mb-3">Rating Distribution</p>
              <div className="space-y-2">
                {renderRatingDistribution()}
              </div>
            </div>
          </div>
        )}

        {/* Filters and Sort */}
        {feedbacks.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center gap-2 text-gray-700">
                <Filter size={18} />
                <span className="font-medium">Filter:</span>
              </div>
              
              <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  aria-label="Filter by rating"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="flex-1 sm:flex-none px-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  aria-label="Sort by"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Feedback List */}
        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Feedback Yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't received any feedback for your completed services. 
              Feedback will appear here once customers review your work.
            </p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <Filter size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Matching Feedback
            </h3>
            <p className="text-gray-600 mb-4">
              No feedback matches your current filter criteria.
            </p>
            <button
              onClick={() => setFilterRating("all")}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback, index) => (
              <div
                key={feedback._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden"
              >
                {/* Feedback Header */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      {renderRatingStars(feedback.rating, 20)}
                      <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        {feedback.rating}.0
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <time dateTime={feedback.createdAt}>
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                  </div>

                  {/* Customer Comment */}
                  {feedback.comment && (
                    <div className="mb-4 pl-4 border-l-4 border-yellow-400">
                      <p className="text-gray-700 italic leading-relaxed">
                        "{feedback.comment}"
                      </p>
                    </div>
                  )}

                  {/* Service Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium">Customer:</span>
                      <span className="text-gray-900">{feedback.customer?.name || "N/A"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck size={16} className="text-gray-400" />
                      <span className="font-medium">Vehicle:</span>
                      <span className="text-gray-900 font-mono">
                        {feedback.job?.booking?.vehicle?.vehicleNumber || "N/A"}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-600">
                      <MessageCircle size={16} className="text-gray-400" />
                      <span className="font-medium">Job ID:</span>
                      <span className="text-gray-900 font-mono text-xs truncate">
                        {feedback.job?._id?.slice(-8) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback Footer */}
                {feedback.job?.booking?.vehicle && (
                  <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Service completed for {feedback.job.booking.vehicle.make} {feedback.job.booking.vehicle.model} 
                      {feedback.job.booking.vehicle.year && ` (${feedback.job.booking.vehicle.year})`}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Results Count */}
            <div className="text-sm text-gray-500 text-center pt-4">
              Showing {filteredFeedbacks.length} of {feedbacks.length} feedback entries
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffFeedback;