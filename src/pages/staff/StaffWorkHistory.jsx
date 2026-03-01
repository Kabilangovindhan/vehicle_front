import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    FileText,
    Wrench,
    CreditCard,
    User,
    Car,
    Filter,
    Download,
    ChevronDown,
    ChevronUp,
    Search,
    Eye,
    Briefcase,
    TrendingUp,
    Award,
    BarChart3,
    Inbox
} from "lucide-react";

function StaffWorkHistory() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [workHistory, setWorkHistory] = useState(null);
    const [expandedJobs, setExpandedJobs] = useState({});
    const [activeTab, setActiveTab] = useState("overview");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Get staff ID from session storage
    const staffId = sessionStorage.getItem("userId");
    const staffName = sessionStorage.getItem("name");

    useEffect(() => {
        if (!staffId) {
            navigate("/");
            return;
        }
        fetchWorkHistory();
    }, [staffId]);

    const fetchWorkHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/staffWorkHistory/${staffId}`);
            const data = await response.json();
            
            if (data.success) {
                setWorkHistory(data);
            } else {
                alert("Failed to fetch work history");
            }
        } catch (error) {
            console.error("Error fetching work history:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    const fetchDateRangeHistory = async () => {
        if (!dateFilter.startDate || !dateFilter.endDate) {
            alert("Please select both start and end dates");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/staffWorkHistory/${staffId}/date-range?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
            );
            const data = await response.json();
            
            if (data.success) {
                // Transform date range data to match work history format
                const transformedData = {
                    ...workHistory,
                    workHistory: data.jobs.map(job => ({
                        jobId: job.jobId,
                        jobStatus: job.status,
                        priority: job.priority,
                        createdAt: job.createdAt,
                        endTime: job.completedAt,
                        booking: {
                            customer: { name: job.customerName },
                            vehicle: { vehicleNumber: job.vehicleNumber }
                        }
                    }))
                };
                setWorkHistory(transformedData);
            }
        } catch (error) {
            console.error("Error fetching date range:", error);
            alert("Failed to fetch data for selected range");
        } finally {
            setLoading(false);
        }
    };

    const toggleJobExpansion = (jobId) => {
        setExpandedJobs(prev => ({
            ...prev,
            [jobId]: !prev[jobId]
        }));
    };

    const getStatusColor = (status) => {
        const statusColors = {
            "Completed": "bg-green-100 text-green-700 border-green-200",
            "Delivered": "bg-emerald-100 text-emerald-700 border-emerald-200",
            "Working": "bg-blue-100 text-blue-700 border-blue-200",
            "Inspection": "bg-yellow-100 text-yellow-700 border-yellow-200",
            "Waiting Approval": "bg-orange-100 text-orange-700 border-orange-200",
            "Assigned": "bg-purple-100 text-purple-700 border-purple-200",
            "Pending Billing": "bg-red-100 text-red-700 border-red-200",
            "Billed": "bg-indigo-100 text-indigo-700 border-indigo-200",
            "Verified": "bg-cyan-100 text-cyan-700 border-cyan-200"
        };
        return statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    const getPriorityBadge = (priority) => {
        return priority === "Urgent" ? (
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200">
                🚨 Urgent
            </span>
        ) : (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200">
                Normal
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filterJobs = (jobs) => {
        if (!jobs) return [];
        
        return jobs.filter(job => {
            // Status filter
            if (statusFilter !== "all" && job.jobStatus !== statusFilter) {
                return false;
            }
            
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const customerName = job.booking?.customer?.name?.toLowerCase() || "";
                const vehicleNumber = job.booking?.vehicle?.vehicleNumber?.toLowerCase() || "";
                const jobId = job.jobId?.toString().toLowerCase() || "";
                
                return customerName.includes(searchLower) || 
                       vehicleNumber.includes(searchLower) || 
                       jobId.includes(searchLower);
            }
            
            return true;
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading work history...</p>
                </div>
            </div>
        );
    }

    if (!workHistory) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load work history</p>
                    <button
                        onClick={fetchWorkHistory}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const filteredJobs = filterJobs(workHistory.workHistory || []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Briefcase className="w-8 h-8 text-indigo-600" />
                        Work History
                        <span className="text-lg font-normal text-gray-500 ml-2">
                            {staffName}
                        </span>
                    </h1>
                    <p className="text-gray-500">Track your completed jobs and performance metrics</p>
                </div>

                {/* Statistics Cards */}
                {workHistory.statistics && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <Briefcase className="w-5 h-5 text-indigo-600" />
                                <span className="text-xs text-gray-500">Total Jobs</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {workHistory.statistics.totalJobs}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span className="text-xs text-gray-500">Completed</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {workHistory.statistics.completedJobs}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-5 h-5 text-yellow-600" />
                                <span className="text-xs text-gray-500">In Progress</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {workHistory.statistics.inProgressJobs}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <Award className="w-5 h-5 text-purple-600" />
                                <span className="text-xs text-gray-500">Inspections</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {workHistory.statistics.totalInspections}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {["overview", "filter", "stats"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize transition-all relative ${
                                activeTab === tab
                                    ? "text-indigo-600"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Filter Section */}
                {activeTab === "filter" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 font-semibold flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                Filter Jobs
                            </h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                {showFilters ? <ChevronUp /> : <ChevronDown />}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="space-y-4">
                                {/* Date Range Filter */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-gray-700 text-sm block mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={dateFilter.startDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-700 text-sm block mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={dateFilter.endDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={fetchDateRangeHistory}
                                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                                >
                                    Apply Date Filter
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Stats View */}
                {activeTab === "stats" && workHistory.groupedByStatus && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4" />
                            Job Status Distribution
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {Object.entries(workHistory.groupedByStatus).map(([status, count]) => (
                                <div key={status} className="bg-gray-50 rounded-xl p-3">
                                    <div className="text-xs text-gray-600 mb-1 capitalize">
                                        {status.replace(/([A-Z])/g, ' $1').trim()}
                                    </div>
                                    <div className="text-xl font-bold text-gray-900">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar (for overview tab) */}
                {activeTab === "overview" && (
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by customer, vehicle, or job ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="all">All Status</option>
                            <option value="Completed">Completed</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Working">Working</option>
                            <option value="Inspection">Inspection</option>
                            <option value="Waiting Approval">Waiting Approval</option>
                        </select>
                    </div>
                )}

                {/* Work History List */}
                <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                            <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">No work history found</p>
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <div
                                key={job.jobId}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-indigo-300 transition-all"
                            >
                                {/* Job Header */}
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => toggleJobExpansion(job.jobId)}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-xl ${getStatusColor(job.jobStatus)}`}>
                                                {job.jobStatus === "Completed" || job.jobStatus === "Delivered" ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : job.jobStatus === "Inspection" ? (
                                                    <FileText className="w-5 h-5" />
                                                ) : (
                                                    <Wrench className="w-5 h-5" />
                                                )}
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-gray-900 font-medium">
                                                        Job #{job.jobId.toString().slice(-6)}
                                                    </span>
                                                    {getPriorityBadge(job.priority)}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <User className="w-3 h-3" />
                                                        {job.booking?.customer?.name || "N/A"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <Car className="w-3 h-3" />
                                                        {job.booking?.vehicle?.vehicleNumber || "N/A"}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDate(job.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.jobStatus)}`}>
                                                {job.jobStatus}
                                            </span>
                                            {expandedJobs[job.jobId] ? (
                                                <ChevronUp className="w-5 h-5 text-gray-500" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedJobs[job.jobId] && (
                                    <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                            {/* Booking Details */}
                                            {job.booking && (
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <h4 className="text-gray-700 text-xs uppercase tracking-wider mb-3">
                                                        Booking Details
                                                    </h4>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="flex justify-between">
                                                            <span className="text-gray-600">Service:</span>
                                                            <span className="text-gray-900 font-medium">{job.booking.serviceType}</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="text-gray-600">Customer:</span>
                                                            <span className="text-gray-900">{job.booking.customer?.name}</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="text-gray-600">Phone:</span>
                                                            <span className="text-gray-900">{job.booking.customer?.phone}</span>
                                                        </p>
                                                        <p className="flex justify-between">
                                                            <span className="text-gray-600">Vehicle:</span>
                                                            <span className="text-gray-900">{job.booking.vehicle?.brand} {job.booking.vehicle?.model}</span>
                                                        </p>
                                                        {job.booking.problemDescription && (
                                                            <p className="mt-2 text-gray-600 text-xs">
                                                                <span className="font-medium">Issue:</span> {job.booking.problemDescription}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Inspection Details */}
                                            {job.inspections && job.inspections.length > 0 && (
                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <h4 className="text-gray-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-1">
                                                        <FileText className="w-3 h-3" />
                                                        Inspections ({job.inspections.length})
                                                    </h4>
                                                    <div className="space-y-3">
                                                        {job.inspections.map((inspection, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <p className="text-gray-700 font-medium mb-1">Issues Found:</p>
                                                                {inspection.issuesFound.map((issue, i) => (
                                                                    <div key={i} className="text-gray-600 text-xs ml-2 mb-1">
                                                                        • {issue.title}: {issue.description}
                                                                    </div>
                                                                ))}
                                                                {inspection.remarks && (
                                                                    <p className="text-gray-600 text-xs mt-1">
                                                                        <span className="font-medium">Remarks:</span> {inspection.remarks}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Estimate & Invoice Details */}
                                            <div className="space-y-3">
                                                {job.estimates && job.estimates.length > 0 && (
                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                        <h4 className="text-gray-700 text-xs uppercase tracking-wider mb-3 flex items-center gap-1">
                                                            <CreditCard className="w-3 h-3" />
                                                            Estimates
                                                        </h4>
                                                        {job.estimates.map((estimate, idx) => (
                                                            <div key={idx} className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">Total:</span>
                                                                    <span className="text-gray-900 font-medium">₹{estimate.grandTotal}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">Status:</span>
                                                                    <span className={`font-medium ${
                                                                        estimate.approvalStatus === "Approved" ? "text-green-600" :
                                                                        estimate.approvalStatus === "Rejected" ? "text-red-600" : "text-yellow-600"
                                                                    }`}>
                                                                        {estimate.approvalStatus}
                                                                    </span>
                                                                </div>
                                                                {estimate.items && estimate.items.length > 0 && (
                                                                    <div className="mt-2">
                                                                        <p className="text-gray-600 text-xs mb-1">Items:</p>
                                                                        {estimate.items.map((item, i) => (
                                                                            <div key={i} className="text-gray-600 text-xs ml-2">
                                                                                • {item.issueTitle}: ₹{item.total}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {job.invoices && job.invoices.length > 0 && (
                                                    <div className="bg-gray-50 rounded-xl p-4">
                                                        <h4 className="text-gray-700 text-xs uppercase tracking-wider mb-3">
                                                            Invoice
                                                        </h4>
                                                        {job.invoices.map((invoice, idx) => (
                                                            <div key={idx} className="space-y-2">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">Amount:</span>
                                                                    <span className="text-gray-900 font-medium">₹{invoice.grandTotal}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-gray-600">Payment:</span>
                                                                    <span className={`font-medium ${
                                                                        invoice.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                                                                    }`}>
                                                                        {invoice.paymentStatus}
                                                                    </span>
                                                                </div>
                                                                {invoice.paymentMethod && (
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">Method:</span>
                                                                        <span className="text-gray-900">{invoice.paymentMethod}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
                                            <span>Started: {formatDate(job.startTime)}</span>
                                            {job.endTime && (
                                                <>
                                                    <span>•</span>
                                                    <span>Completed: {formatDate(job.endTime)}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default StaffWorkHistory;