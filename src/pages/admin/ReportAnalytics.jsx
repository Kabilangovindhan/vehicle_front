import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase,
    DollarSign,
    Calendar,
    Download,
    Filter,
    ChevronDown,
    ChevronUp,
    Loader2,
    User,
    Star,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    PieChart,
    Activity,
    Award,
    Target,
    FileText
} from "lucide-react";

function ReportAnalytics() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: ""
    });
    const [period, setPeriod] = useState("month");
    const [reportType, setReportType] = useState("staff");
    const [showFilters, setShowFilters] = useState(false);
    
    // Data states
    const [overviewData, setOverviewData] = useState(null);
    const [staffPerformance, setStaffPerformance] = useState(null);
    const [financialData, setFinancialData] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffDetails, setStaffDetails] = useState(null);

    // Check admin authentication
    useEffect(() => {
        const role = sessionStorage.getItem("role");
       
        fetchOverviewData();
    }, []);

    const fetchOverviewData = async (periodValue = period) => {
        try {
            setLoading(true);
            const response = await fetch(
                `http://localhost:5000/api/reportAnalytics/workshop-overview?period=${periodValue}`
            );
            const data = await response.json();
            
            if (data.success) {
                setOverviewData(data);
            }
        } catch (error) {
            console.error("Error fetching overview:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffPerformance = async () => {
        try {
            setLoading(true);
            const url = dateRange.startDate && dateRange.endDate
                ? `http://localhost:5000/api/reportAnalytics/staff-performance?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
                : `http://localhost:5000/api/reportAnalytics/staff-performance`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setStaffPerformance(data);
            }
        } catch (error) {
            console.error("Error fetching staff performance:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFinancialData = async () => {
        try {
            setLoading(true);
            const url = dateRange.startDate && dateRange.endDate
                ? `http://localhost:5000/api/reportAnalytics/financial-report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
                : `http://localhost:5000/api/reportAnalytics/financial-report`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setFinancialData(data);
            }
        } catch (error) {
            console.error("Error fetching financial data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffDetails = async (staffId) => {
        try {
            setLoading(true);
            const url = dateRange.startDate && dateRange.endDate
                ? `http://localhost:5000/api/reportAnalytics/staff/${staffId}/detailed?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
                : `http://localhost:5000/api/reportAnalytics/staff/${staffId}/detailed`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                setStaffDetails(data.report);
            }
        } catch (error) {
            console.error("Error fetching staff details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === "staff" && !staffPerformance) {
            fetchStaffPerformance();
        } else if (tab === "financial" && !financialData) {
            fetchFinancialData();
        } else if (tab === "overview") {
            fetchOverviewData(period);
        }
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        fetchOverviewData(newPeriod);
    };

    const handleExport = async () => {
        try {
            const url = `http://localhost:5000/api/reportAnalytics/export?type=${reportType}${dateRange.startDate ? `&startDate=${dateRange.startDate}` : ''}${dateRange.endDate ? `&endDate=${dateRange.endDate}` : ''}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.success) {
                // Create downloadable file
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const downloadUrl = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `report-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && !overviewData && !staffPerformance && !financialData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-600" />
                        Report & Analytics
                    </h1>
                    <p className="text-gray-500">Comprehensive workshop performance metrics and insights</p>
                </div>

                {/* Control Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Tabs */}
                        <div className="flex gap-2">
                            {[
                                { id: "overview", label: "Overview", icon: Activity },
                                { id: "staff", label: "Staff Performance", icon: Users },
                                { id: "financial", label: "Financial", icon: DollarSign }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                                            activeTab === tab.id
                                                ? "bg-indigo-600 text-white"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Export & Filter */}
                        <div className="flex items-center gap-3">
                            <select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-indigo-500"
                            >
                                <option value="staff">Staff Report</option>
                                <option value="jobs">Jobs Report</option>
                                <option value="financial">Financial Report</option>
                                <option value="complete">Complete Report</option>
                            </select>
                            
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Export
                            </button>
                            
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.startDate}
                                        onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={dateRange.endDate}
                                        onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            if (activeTab === "staff") fetchStaffPerformance();
                                            else if (activeTab === "financial") fetchFinancialData();
                                        }}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 text-sm"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && overviewData && (
                    <div className="space-y-6">
                        {/* Period Selector */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center gap-2">
                                {["day", "week", "month", "year"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePeriodChange(p)}
                                        className={`px-4 py-2 rounded-xl text-sm font-medium capitalize ${
                                            period === p
                                                ? "bg-indigo-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Key Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <Briefcase className="w-5 h-5 text-indigo-600" />
                                    <span className="text-xs text-gray-500">Total Jobs</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {overviewData.metrics.totalJobs}
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <span className="text-green-600">{overviewData.metrics.completedJobs} completed</span>
                                    <span className="text-gray-300">•</span>
                                    <span className="text-yellow-600">{overviewData.metrics.pendingJobs} pending</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="text-xs text-gray-500">Revenue</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {formatCurrency(overviewData.metrics.totalRevenue)}
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    {formatCurrency(overviewData.metrics.pendingRevenue)} pending
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <span className="text-xs text-gray-500">Invoices</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {overviewData.metrics.totalInvoices}
                                </div>
                                <div className="mt-2 text-sm text-green-600">
                                    {overviewData.metrics.paidInvoices} paid
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <CheckCircle className="w-5 h-5 text-purple-600" />
                                    <span className="text-xs text-gray-500">Approval Rate</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">
                                    {overviewData.metrics.totalEstimates > 0 
                                        ? Math.round((overviewData.metrics.approvedEstimates / overviewData.metrics.totalEstimates) * 100)
                                        : 0}%
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    {overviewData.metrics.approvedEstimates} of {overviewData.metrics.totalEstimates} estimates
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Service Type Distribution */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-indigo-600" />
                                    Service Type Distribution
                                </h3>
                                <div className="space-y-3">
                                    {overviewData.charts.serviceTypeDistribution.map((service, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{service.name}</span>
                                                <span className="text-gray-900 font-medium">{service.value}</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(service.value / overviewData.metrics.totalBookings) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Staff Workload */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                    Staff Workload Distribution
                                </h3>
                                <div className="space-y-3">
                                    {overviewData.charts.staffWorkload.map((staff, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-700">{staff.name}</span>
                                                <span className="text-gray-900 font-medium">{staff.jobs} jobs</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-green-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(staff.jobs / overviewData.metrics.totalJobs) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Trend Chart (simplified) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                                    Activity Trend
                                </h3>
                                <div className="h-48 flex items-end gap-2">
                                    {overviewData.charts.trendData.slice(-7).map((day, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                            <div 
                                                className="w-full bg-indigo-600 rounded-t-lg"
                                                style={{ height: `${(day.jobs / Math.max(...overviewData.charts.trendData.map(d => d.jobs))) * 100}%` }}
                                            />
                                            <span className="text-xs text-gray-500 rotate-45">
                                                {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Staff Performance Tab */}
                {activeTab === "staff" && staffPerformance && (
                    <div className="space-y-6">
                        {/* Overall Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="text-sm text-gray-600">Total Staff</div>
                                <div className="text-2xl font-bold text-gray-900">{staffPerformance.overallStats.totalStaff}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="text-sm text-gray-600">Total Jobs</div>
                                <div className="text-2xl font-bold text-gray-900">{staffPerformance.overallStats.totalJobs}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="text-sm text-gray-600">Total Earnings</div>
                                <div className="text-2xl font-bold text-gray-900">{formatCurrency(staffPerformance.overallStats.totalEarnings)}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <div className="text-sm text-gray-600">Avg Satisfaction</div>
                                <div className="text-2xl font-bold text-gray-900">{Math.round(staffPerformance.overallStats.avgSatisfactionRate)}%</div>
                            </div>
                        </div>

                        {/* Top Performers */}
                        {staffPerformance.topPerformers.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-yellow-500" />
                                    Top Performers
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {staffPerformance.topPerformers.map((staff, index) => (
                                        <div key={staff.staffId} className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{staff.staffName}</div>
                                                    <div className="text-xs text-gray-500">{staff.staffEmail}</div>
                                                </div>
                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                                    #{index + 1}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                <div>
                                                    <div className="text-xs text-gray-500">Jobs</div>
                                                    <div className="font-bold text-gray-900">{staff.metrics.completedJobs}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Earnings</div>
                                                    <div className="font-bold text-gray-900">{formatCurrency(staff.metrics.totalEarnings)}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Satisfaction</div>
                                                    <div className="font-bold text-green-600">{staff.metrics.satisfactionRate}%</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500">Avg Time</div>
                                                    <div className="font-bold text-gray-900">{staff.metrics.avgCompletionTime || 0}h</div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedStaff(staff.staffId);
                                                    fetchStaffDetails(staff.staffId);
                                                }}
                                                className="mt-3 w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Staff List */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-900">All Staff Performance</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspections</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satisfaction</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Urgent %</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {staffPerformance.staffPerformance.map((staff) => (
                                            <tr key={staff.staffId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{staff.staffName}</div>
                                                    <div className="text-sm text-gray-500">{staff.staffPhone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{staff.metrics.totalJobs}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-green-600 font-medium">{staff.metrics.completedJobs}</span>
                                                    <span className="text-gray-500 text-sm ml-1">
                                                        ({Math.round((staff.metrics.completedJobs / staff.metrics.totalJobs) * 100) || 0}%)
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{staff.metrics.totalInspections}</td>
                                                <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(staff.metrics.totalEarnings)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        staff.metrics.satisfactionRate >= 80 ? 'bg-green-100 text-green-700' :
                                                        staff.metrics.satisfactionRate >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                        {staff.metrics.satisfactionRate}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-900">{staff.metrics.urgentJobRatio}%</td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedStaff(staff.staffId);
                                                            fetchStaffDetails(staff.staffId);
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Staff Details Modal */}
                        {selectedStaff && staffDetails && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                                <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-gray-900">Staff Details: {staffDetails.staffInfo.name}</h2>
                                        <button
                                            onClick={() => {
                                                setSelectedStaff(null);
                                                setStaffDetails(null);
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <XCircle className="w-6 h-6" />
                                        </button>
                                    </div>
                                    
                                    <div className="p-6 space-y-6">
                                        {/* Staff Info */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <div className="text-sm text-gray-500">Email</div>
                                                <div className="font-medium text-gray-900">{staffDetails.staffInfo.email}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Phone</div>
                                                <div className="font-medium text-gray-900">{staffDetails.staffInfo.phone}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Joined</div>
                                                <div className="font-medium text-gray-900">{formatDate(staffDetails.staffInfo.joinedDate)}</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500">Total Earnings</div>
                                                <div className="font-medium text-green-600">{formatCurrency(staffDetails.earnings.totalLabour)}</div>
                                            </div>
                                        </div>

                                        {/* Summary Cards */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="text-sm text-gray-600">Total Jobs</div>
                                                <div className="text-2xl font-bold text-gray-900">{staffDetails.summary.totalJobs}</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="text-sm text-gray-600">Completed</div>
                                                <div className="text-2xl font-bold text-green-600">{staffDetails.summary.completedJobs}</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="text-sm text-gray-600">Inspections</div>
                                                <div className="text-2xl font-bold text-gray-900">{staffDetails.summary.totalInspections}</div>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="text-sm text-gray-600">Estimates</div>
                                                <div className="text-2xl font-bold text-gray-900">{staffDetails.summary.totalEstimates}</div>
                                            </div>
                                        </div>

                                        {/* Jobs by Status */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Jobs by Status</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                {Object.entries(staffDetails.jobsByStatus).map(([status, count]) => (
                                                    <div key={status} className="bg-gray-50 rounded-lg p-3">
                                                        <div className="text-xs text-gray-500 mb-1">{status}</div>
                                                        <div className="text-lg font-bold text-gray-900">{count}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent Jobs */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-3">Recent Jobs</h3>
                                            <div className="space-y-3">
                                                {staffDetails.detailedJobs.slice(0, 5).map((job) => (
                                                    <div key={job.jobId} className="bg-gray-50 rounded-lg p-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="font-medium text-gray-900">
                                                                    {job.vehicle?.model || "N/A"} - {job.vehicle?.number || "N/A"}
                                                                </div>
                                                                <div className="text-sm text-gray-600">{job.customer?.name}</div>
                                                            </div>
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                job.status === "Completed" ? "bg-green-100 text-green-700" :
                                                                job.status === "Delivered" ? "bg-blue-100 text-blue-700" :
                                                                "bg-yellow-100 text-yellow-700"
                                                            }`}>
                                                                {job.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            {formatDate(job.createdAt)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Financial Tab */}
                {activeTab === "financial" && financialData && (
                    <div className="space-y-6">
                        {/* Financial Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                                <div className="text-3xl font-bold text-gray-900">{formatCurrency(financialData.financialData.totalRevenue)}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="text-sm text-gray-600 mb-1">Paid Revenue</div>
                                <div className="text-3xl font-bold text-green-600">{formatCurrency(financialData.financialData.paidRevenue)}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="text-sm text-gray-600 mb-1">Pending Revenue</div>
                                <div className="text-3xl font-bold text-yellow-600">{formatCurrency(financialData.financialData.pendingRevenue)}</div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="text-sm text-gray-600 mb-1">Total GST</div>
                                <div className="text-3xl font-bold text-gray-900">{formatCurrency(financialData.financialData.totalGST)}</div>
                            </div>
                        </div>

                        {/* Revenue Breakdown */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Labour Charges</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(financialData.financialData.labourRevenue)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(financialData.financialData.labourRevenue / financialData.financialData.totalRevenue) * 100 || 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Parts/Spares</span>
                                            <span className="font-medium text-gray-900">{formatCurrency(financialData.financialData.partsRevenue)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(financialData.financialData.partsRevenue / financialData.financialData.totalRevenue) * 100 || 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="text-2xl font-bold text-gray-900">{financialData.financialData.paymentMethodBreakdown.Cash}</div>
                                        <div className="text-sm text-gray-600">Cash</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="text-2xl font-bold text-gray-900">{financialData.financialData.paymentMethodBreakdown.Card}</div>
                                        <div className="text-sm text-gray-600">Card</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="text-2xl font-bold text-gray-900">{financialData.financialData.paymentMethodBreakdown.UPI}</div>
                                        <div className="text-sm text-gray-600">UPI</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                                        <div className="text-2xl font-bold text-gray-900">{financialData.financialData.paymentMethodBreakdown.Pending}</div>
                                        <div className="text-sm text-gray-600">Pending</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Monthly Breakdown */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Breakdown</h3>
                            <div className="space-y-3">
                                {Object.entries(financialData.financialData.monthlyBreakdown).map(([month, data]) => (
                                    <div key={month}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-700">{month}</span>
                                            <span className="text-gray-900 font-medium">{formatCurrency(data.revenue)}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(data.revenue / financialData.financialData.totalRevenue) * 100 || 0}%`
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>{data.count} invoices</span>
                                            <span>{data.paid} paid</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportAnalytics;