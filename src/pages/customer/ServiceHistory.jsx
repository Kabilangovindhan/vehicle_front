import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Car,
    Calendar,
    Clock,
    DollarSign,
    FileText,
    Wrench,
    CheckCircle,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    Filter,
    Download,
    Search,
    TrendingUp,
    PieChart,
    Activity,
    User,
    Phone,
    Mail,
    MapPin,
    History,
    CreditCard,
    Award
} from "lucide-react";

function ServiceHistory() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [serviceHistory, setServiceHistory] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [expandedBookings, setExpandedBookings] = useState({});
    const [activeTab, setActiveTab] = useState("overview");
    const [dateFilter, setDateFilter] = useState({
        startDate: "",
        endDate: ""
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [analytics, setAnalytics] = useState(null);

    // Get customer ID from session storage
    const customerId = sessionStorage.getItem("userId");
    const customerName = sessionStorage.getItem("name");

    useEffect(() => {
        if (!customerId) {
            navigate("/");
            return;
        }
        fetchServiceHistory();
        fetchAnalytics();
    }, [customerId]);

    const fetchServiceHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/serviceHistory/${customerId}`);
            const data = await response.json();

            if (data.success) {
                setServiceHistory(data);
            } else {
                alert("Failed to fetch service history");
            }
        } catch (error) {
            console.error("Error fetching service history:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/serviceHistory/${customerId}/analytics`);
            const data = await response.json();

            if (data.success) {
                setAnalytics(data.analytics);
            }
        } catch (error) {
            console.error("Error fetching analytics:", error);
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
                `http://localhost:5000/api/serviceHistory/${customerId}/date-range?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
            );
            const data = await response.json();

            if (data.success) {
                // Show date range results in a modal or new view
                alert(`Found ${data.summary.totalServices} services in this period. Total spent: ₹${data.summary.totalSpent}`);
            }
        } catch (error) {
            console.error("Error fetching date range:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicleHistory = async (vehicleId) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/serviceHistory/${customerId}/vehicle/${vehicleId}`
            );
            const data = await response.json();

            if (data.success) {
                setSelectedVehicle(data);
            }
        } catch (error) {
            console.error("Error fetching vehicle history:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBookingExpansion = (bookingId) => {
        setExpandedBookings(prev => ({
            ...prev,
            [bookingId]: !prev[bookingId]
        }));
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const getStatusColor = (status) => {
        const statusColors = {
            "Completed": "bg-green-100 text-green-700 border-green-200",
            "Delivered": "bg-emerald-100 text-emerald-700 border-emerald-200",
            "Working": "bg-blue-100 text-blue-700 border-blue-200",
            "Inspection": "bg-yellow-100 text-yellow-700 border-yellow-200",
            "Waiting Approval": "bg-orange-100 text-orange-700 border-orange-200",
            "Assigned": "bg-purple-100 text-purple-700 border-purple-200",
            "Pending": "bg-gray-100 text-gray-700 border-gray-200",
            "Approved": "bg-green-100 text-green-700 border-green-200",
            "Paid": "bg-green-100 text-green-700 border-green-200",
            "Pending Billing": "bg-red-100 text-red-700 border-red-200"
        };
        return statusColors[status] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    if (loading && !serviceHistory) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading service history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <History className="w-8 h-8 text-indigo-600" />
                        Service History
                        <span className="text-lg font-normal text-gray-500 ml-2">
                            {customerName}
                        </span>
                    </h1>
                    <p className="text-gray-500">Track all your vehicle service records and history</p>
                </div>

                {/* Customer Info Card */}
                {serviceHistory?.customer && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 mb-2">Customer Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span>{serviceHistory.customer.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Mail className="w-4 h-4" />
                                        <span>{serviceHistory.customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Phone className="w-4 h-4" />
                                        <span>{serviceHistory.customer.phone}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-500">Member Since</div>
                                <div className="font-medium text-gray-900">{formatDate(serviceHistory.customer.joinedDate)}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Summary Cards */}
                {serviceHistory?.summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Car className="w-5 h-5 text-indigo-600" />
                                <span className="text-xs text-gray-500">Total Vehicles</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {serviceHistory.summary.totalVehicles}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <Wrench className="w-5 h-5 text-blue-600" />
                                <span className="text-xs text-gray-500">Total Services</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {serviceHistory.summary.totalBookings}
                            </div>
                            <div className="mt-2 text-sm text-green-600">
                                {serviceHistory.summary.completedJobs} completed
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <DollarSign className="w-5 h-5 text-green-600" />
                                <span className="text-xs text-gray-500">Total Spent</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {formatCurrency(serviceHistory.summary.totalSpent)}
                            </div>
                            <div className="mt-2 text-sm text-yellow-600">
                                {formatCurrency(serviceHistory.summary.pendingPayments)} pending
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                                <span className="text-xs text-gray-500">Approval Rate</span>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                {serviceHistory.summary.totalEstimates > 0
                                    ? Math.round((serviceHistory.summary.approvedEstimates / serviceHistory.summary.totalEstimates) * 100)
                                    : 0}%
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200">
                    {["overview", "vehicles", "analytics", "timeline"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium capitalize transition-all relative ${activeTab === tab
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

                {/* Filter Bar */}
                {activeTab === "overview" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by vehicle number or service type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>

                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={dateFilter.startDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={dateFilter.endDate}
                                            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={fetchDateRangeHistory}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                                        >
                                            Apply Filter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Vehicles Overview */}
                {activeTab === "overview" && serviceHistory?.vehicles && (
                    <div className="space-y-6">
                        {serviceHistory.vehicles
                            .filter(vehicle =>
                                vehicle.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((vehicle) => (
                                <div key={vehicle.vehicleId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Vehicle Header */}
                                    <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-indigo-100 rounded-xl">
                                                    <Car className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">
                                                        {vehicle.brand} {vehicle.model}
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                                        <span className="text-lg font-semibold text-indigo-600">
                                                            {vehicle.vehicleNumber}
                                                        </span>
                                                        <span className="text-sm text-gray-500">•</span>
                                                        <span className="text-sm text-gray-600">{vehicle.fuelType}</span>
                                                        <span className="text-sm text-gray-500">•</span>
                                                        <span className="text-sm text-gray-600">{vehicle.transmission}</span>
                                                        {vehicle.color && (
                                                            <>
                                                                <span className="text-sm text-gray-500">•</span>
                                                                <span className="text-sm text-gray-600">{vehicle.color}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-4 md:mt-0 flex gap-3">
                                                <button
                                                    onClick={() => fetchVehicleHistory(vehicle.vehicleId)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm"
                                                >
                                                    View Details
                                                </button>
                                            </div>
                                        </div>

                                        {/* Vehicle Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Total Services</div>
                                                <div className="text-lg font-semibold text-gray-900">{vehicle.stats.totalBookings}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Completed</div>
                                                <div className="text-lg font-semibold text-green-600">{vehicle.stats.completedJobs}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Total Spent</div>
                                                <div className="text-lg font-semibold text-gray-900">{formatCurrency(vehicle.stats.totalSpent)}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Last Service</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {vehicle.stats.lastService ? formatDate(vehicle.stats.lastService) : "No service yet"}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service History List */}
                                    <div className="divide-y divide-gray-200">
                                        {vehicle.serviceHistory.map((booking) => (
                                            <div key={booking.bookingId} className="p-4">
                                                <div
                                                    className="flex items-start justify-between cursor-pointer"
                                                    onClick={() => toggleBookingExpansion(booking.bookingId)}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`p-2 rounded-lg ${getStatusColor(booking.bookingStatus)}`}>
                                                            {booking.bookingStatus === "Approved" ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : booking.bookingStatus === "Pending" ? (
                                                                <Clock className="w-4 h-4" />
                                                            ) : (
                                                                <AlertCircle className="w-4 h-4" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {booking.serviceType}
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(booking.bookingStatus)}`}>
                                                                    {booking.bookingStatus}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatDate(booking.bookingDate)}
                                                                </span>
                                                                {booking.appointmentDate && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="w-3 h-3" />
                                                                            Appt: {formatDate(booking.appointmentDate)}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {booking.jobs.length} job{booking.jobs.length !== 1 ? 's' : ''}
                                                        </span>
                                                        {expandedBookings[booking.bookingId] ? (
                                                            <ChevronUp className="w-4 h-4 text-gray-500" />
                                                        ) : (
                                                            <ChevronDown className="w-4 h-4 text-gray-500" />
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Expanded Booking Details */}
                                                {expandedBookings[booking.bookingId] && (
                                                    <div className="mt-4 pl-11 space-y-4">
                                                        {booking.problemDescription && (
                                                            <div className="bg-gray-50 rounded-lg p-3">
                                                                <p className="text-sm text-gray-600">
                                                                    <span className="font-medium">Issue:</span> {booking.problemDescription}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {booking.jobs.map((job) => (
                                                            <div key={job.jobId} className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium text-gray-900">Job #{job.jobId.toString().slice(-6)}</span>
                                                                            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(job.jobStatus)}`}>
                                                                                {job.jobStatus}
                                                                            </span>
                                                                            {job.priority === "Urgent" && (
                                                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                                                                                    Urgent
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="mt-2 text-sm text-gray-600">
                                                                            <span>Staff: {job.assignedStaff}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Inspections */}
                                                                {job.inspections.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Inspections:</p>
                                                                        {job.inspections.map((inspection, idx) => (
                                                                            <div key={idx} className="text-sm">
                                                                                {inspection.issuesFound.map((issue, i) => (
                                                                                    <div key={i} className="text-gray-600 text-xs ml-2">
                                                                                        • {issue.title}: {issue.description}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Estimates */}
                                                                {job.estimates.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Estimates:</p>
                                                                        {job.estimates.map((estimate, idx) => (
                                                                            <div key={idx} className="bg-white rounded p-2">
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Total:</span>
                                                                                    <span className="font-medium">{formatCurrency(estimate.grandTotal)}</span>
                                                                                </div>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Status:</span>
                                                                                    <span className={`font-medium ${estimate.approvalStatus === "Approved" ? "text-green-600" :
                                                                                            estimate.approvalStatus === "Rejected" ? "text-red-600" : "text-yellow-600"
                                                                                        }`}>
                                                                                        {estimate.approvalStatus}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Invoices */}
                                                                {job.invoices.length > 0 && (
                                                                    <div className="mt-3">
                                                                        <p className="text-xs font-medium text-gray-500 mb-1">Invoice:</p>
                                                                        {job.invoices.map((invoice, idx) => (
                                                                            <div key={idx} className="bg-white rounded p-2">
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Amount:</span>
                                                                                    <span className="font-medium">{formatCurrency(invoice.grandTotal)}</span>
                                                                                </div>
                                                                                <div className="flex justify-between text-sm">
                                                                                    <span className="text-gray-600">Payment:</span>
                                                                                    <span className={`font-medium ${invoice.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                                                                                        }`}>
                                                                                        {invoice.paymentStatus}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Timeline */}
                                                                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                                                                    <span>Started: {formatDate(job.startTime)}</span>
                                                                    {job.endTime && (
                                                                        <>
                                                                            <span>•</span>
                                                                            <span>Completed: {formatDate(job.endTime)}</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Vehicles Tab */}
                {activeTab === "vehicles" && serviceHistory?.vehicles && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {serviceHistory.vehicles.map((vehicle) => (
                            <div key={vehicle.vehicleId} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-indigo-100 rounded-xl">
                                        <Car className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <button
                                        onClick={() => fetchVehicleHistory(vehicle.vehicleId)}
                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                    >
                                        View Details →
                                    </button>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                    {vehicle.brand} {vehicle.model}
                                </h3>
                                <p className="text-indigo-600 font-medium mb-3">{vehicle.vehicleNumber}</p>

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div>
                                        <div className="text-xs text-gray-500">Year</div>
                                        <div className="text-sm font-medium text-gray-900">{vehicle.year || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Fuel</div>
                                        <div className="text-sm font-medium text-gray-900">{vehicle.fuelType || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Transmission</div>
                                        <div className="text-sm font-medium text-gray-900">{vehicle.transmission || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">Color</div>
                                        <div className="text-sm font-medium text-gray-900">{vehicle.color || "N/A"}</div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Total Services</span>
                                        <span className="font-medium text-gray-900">{vehicle.stats.totalBookings}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Completed</span>
                                        <span className="font-medium text-green-600">{vehicle.stats.completedJobs}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Total Spent</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(vehicle.stats.totalSpent)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === "analytics" && analytics && (
                    <div className="space-y-6">
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-gray-900">Service Frequency</h3>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(analytics.serviceFrequency).map(([vehicle, count]) => (
                                        <div key={vehicle} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{vehicle}</span>
                                            <span className="font-medium text-gray-900">{count} services</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <PieChart className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-gray-900">Service Preferences</h3>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(analytics.serviceTypePreferences).map(([type, count]) => (
                                        <div key={type} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{type}</span>
                                            <span className="font-medium text-gray-900">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <DollarSign className="w-5 h-5 text-indigo-600" />
                                    <h3 className="font-semibold text-gray-900">Average Costs</h3>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(analytics.avgCostByVehicle).map(([vehicle, cost]) => (
                                        <div key={vehicle} className="flex justify-between text-sm">
                                            <span className="text-gray-600">{vehicle}</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(cost)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Spending Trends */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-indigo-600" />
                                Spending Trends
                            </h3>
                            <div className="space-y-3">
                                {Object.entries(analytics.spendingTrends).map(([month, amount]) => (
                                    <div key={month}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">{month}</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(amount)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(amount / Math.max(...Object.values(analytics.spendingTrends))) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Timeline Tab */}
                {activeTab === "timeline" && serviceHistory?.recentActivity && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                            <div className="space-y-6">
                                {serviceHistory.recentActivity.map((activity, index) => (
                                    <div key={index} className="relative pl-10">
                                        <div className={`absolute left-2 w-4 h-4 rounded-full border-2 border-white ${activity.jobStatus === "Completed" ? "bg-green-500" :
                                                activity.jobStatus === "Delivered" ? "bg-blue-500" :
                                                    "bg-yellow-500"
                                            }`} />
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-medium text-gray-900">
                                                        {activity.vehicleNumber}
                                                    </span>
                                                    <span className="text-sm text-gray-500 ml-2">
                                                        {activity.serviceType}
                                                    </span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(activity.jobStatus)}`}>
                                                    {activity.jobStatus}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                <p>Staff: {activity.staffName || "Unassigned"}</p>
                                                <p className="mt-1 text-xs text-gray-500">{formatDate(activity.date)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vehicle Details Modal */}
                {selectedVehicle && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {selectedVehicle.vehicle.brand} {selectedVehicle.vehicle.model}
                                </h2>
                                <button
                                    onClick={() => setSelectedVehicle(null)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Vehicle Info */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-500">Vehicle Number</div>
                                        <div className="font-medium text-indigo-600">{selectedVehicle.vehicle.number}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Year</div>
                                        <div className="font-medium text-gray-900">{selectedVehicle.vehicle.year || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Fuel Type</div>
                                        <div className="font-medium text-gray-900">{selectedVehicle.vehicle.fuelType || "N/A"}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500">Transmission</div>
                                        <div className="font-medium text-gray-900">{selectedVehicle.vehicle.transmission || "N/A"}</div>
                                    </div>
                                </div>

                                {/* Vehicle Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600">Total Services</div>
                                        <div className="text-2xl font-bold text-gray-900">{selectedVehicle.stats.totalServices}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600">Completed</div>
                                        <div className="text-2xl font-bold text-green-600">{selectedVehicle.stats.completedServices}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600">Total Spent</div>
                                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedVehicle.stats.totalSpent)}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-600">Avg per Service</div>
                                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(selectedVehicle.stats.averageServiceCost)}</div>
                                    </div>
                                </div>

                                {/* Service Timeline */}
                                <h3 className="font-semibold text-gray-900">Service Timeline</h3>
                                <div className="space-y-4">
                                    {selectedVehicle.serviceTimeline.map((service, index) => (
                                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <span className="font-medium text-gray-900">{service.serviceType}</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(service.status)}`}>
                                                        {service.status}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">{formatDate(service.date)}</span>
                                            </div>

                                            {service.problemDescription && (
                                                <p className="text-sm text-gray-600 mb-3">
                                                    <span className="font-medium">Issue:</span> {service.problemDescription}
                                                </p>
                                            )}

                                            <div className="grid grid-cols-2 gap-3 mb-3">
                                                <div>
                                                    <div className="text-xs text-gray-500">Jobs</div>
                                                    <div className="font-medium text-gray-900">{service.jobs.length}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Total Cost</div>
                                                    <div className="font-medium text-gray-900">{formatCurrency(service.totalCost)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Payment</div>
                                                    <div className={`font-medium ${service.paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                                                        }`}>
                                                        {service.paymentStatus}
                                                    </div>
                                                </div>
                                            </div>

                                            {service.jobs.map((job, jobIndex) => (
                                                <div key={jobIndex} className="mt-2 pt-2 border-t border-gray-200">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Job Status:</span>
                                                        <span className={`font-medium ${getStatusColor(job.status)}`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">Staff:</span>
                                                        <span className="font-medium text-gray-900">{job.staff || "Unassigned"}</span>
                                                    </div>
                                                    {job.completedAt && (
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Completed:</span>
                                                            <span className="font-medium text-gray-900">{formatDate(job.completedAt)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServiceHistory;