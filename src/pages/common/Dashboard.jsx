import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Car,
    Wrench,
    DollarSign,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Calendar,
    User,
    Briefcase,
    FileText,
    CreditCard,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    PieChart,
    BarChart3,
    Star,
    History
} from "lucide-react";

const SimpleBarChart = ({ data, dataKey, xKey, height = 200 }) => (
    <div className="h-48 flex items-end gap-2">
        {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                    className="w-full bg-indigo-600 rounded-t-lg transition-all hover:bg-indigo-700"
                    style={{ height: `${(item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 100}%` }}
                />
                <span className="text-xs text-gray-500">{item[xKey]}</span>
            </div>
        ))}
    </div>
);

const SimplePieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const colors = ['bg-indigo-600', 'bg-green-600', 'bg-yellow-600', 'bg-purple-600', 'bg-red-600'];
    return (
        <div className="space-y-2">
            {data.map((item, index) => (
                <div key={index}>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium text-gray-900">{item.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${colors[index % colors.length]} h-2 rounded-full`}
                            style={{ width: `${(item.value / total) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

function Dashboard() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState("week");

    // Get user info from session
    const userId = sessionStorage.getItem("userId");
    const userName = sessionStorage.getItem("name");
    const userRole = sessionStorage.getItem("role")?.toLowerCase();

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }
        fetchDashboardData();
    }, [userId, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/dashboard/${userId}`);
            const data = await response.json();

            if (data.success) {
                setDashboardData(data.dashboard);
            } else {
                alert("Failed to fetch dashboard data");
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
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
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            "Completed": "bg-green-100 text-green-700",
            "Delivered": "bg-emerald-100 text-emerald-700",
            "Working": "bg-blue-100 text-blue-700",
            "Inspection": "bg-yellow-100 text-yellow-700",
            "Waiting Approval": "bg-orange-100 text-orange-700",
            "Assigned": "bg-purple-100 text-purple-700",
            "Pending": "bg-gray-100 text-gray-700",
            "Approved": "bg-green-100 text-green-700",
            "Paid": "bg-green-100 text-green-700"
        };
        return colors[status] || "bg-gray-100 text-gray-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Failed to load dashboard</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full">
            {
                dashboardData.role === "admin" && (
                    <AdminDashboard
                        data={dashboardData}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                    />
                )
            }

            {
                dashboardData.role === "staff" && (
                    <StaffDashboard
                        data={dashboardData}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                    />
                )
            }

            {
                dashboardData.role === "customer" && (
                    <CustomerDashboard
                        data={dashboardData}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                    />
                )
            }
        </div >
    );
}

// Admin Dashboard Component
function AdminDashboard({ data, formatCurrency, formatDate, getStatusColor }) {

    const stats = data.stats;

    return (
        <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Customers"
                    value={stats.totalCustomers}
                    icon={Users}
                    bgColor="bg-blue-500"
                    iconColor="text-white"
                    trend={+12}
                />
                <StatCard
                    title="Total Staff"
                    value={stats.totalStaff}
                    icon={Briefcase}
                    bgColor="bg-purple-500"
                    iconColor="text-white"
                    trend={+2}
                />
                <StatCard
                    title="Total Vehicles"
                    value={stats.totalVehicles}
                    icon={Car}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                    trend={+8}
                />
                <StatCard
                    title="Today's Bookings"
                    value={stats.todayBookings}
                    icon={Calendar}
                    bgColor="bg-orange-500"
                    iconColor="text-white"
                    trend={stats.todayBookings > 5 ? +20 : -5}
                />
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RevenueCard
                    title="Today's Revenue"
                    amount={formatCurrency(stats.revenue.today)}
                    icon={DollarSign}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                />
                <RevenueCard
                    title="This Week"
                    amount={formatCurrency(stats.revenue.week)}
                    icon={TrendingUp}
                    bgColor="bg-blue-500"
                    iconColor="text-white"
                />
                <RevenueCard
                    title="This Month"
                    amount={formatCurrency(stats.revenue.month)}
                    icon={Activity}
                    bgColor="bg-purple-500"
                    iconColor="text-white"
                />
                <RevenueCard
                    title="This Year"
                    amount={formatCurrency(stats.revenue.year)}
                    icon={BarChart3}
                    bgColor="bg-indigo-500"
                    iconColor="text-white"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <SimpleBarChart
                        data={data.charts.revenueByDay}
                        dataKey="revenue"
                        xKey="day"
                    />
                </div>

                {/* Job Status Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h3>
                    <SimplePieChart
                        data={data.charts.jobStatusDistribution.map(item => ({
                            name: item.status,
                            value: item.count
                        }))}
                    />
                </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Popular Services */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
                    <div className="space-y-3">
                        {data.charts.popularServices.map((service, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{service.service}</span>
                                    <span className="font-medium text-gray-900">{service.count}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${(service.count / data.charts.popularServices[0].count) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Staff Performance */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
                    <div className="space-y-4">
                        {data.staffPerformance.map((staff, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{staff.name}</p>
                                        <p className="text-xs text-gray-500">{staff.completedJobs} completed</p>
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-green-600">{staff.completionRate}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {data.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="w-2 h-2 mt-2 rounded-full bg-indigo-600"></div>
                                <div>
                                    <p className="text-sm text-gray-900">
                                        {activity.customer} - {activity.vehicle}
                                    </p>
                                    <p className="text-xs text-gray-500">{activity.service}</p>
                                    <p className="text-xs text-gray-400 mt-1">{formatDate(activity.time)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Pending Jobs</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pendingJobs}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">In Progress</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.inProgressJobs}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completedJobs}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Staff Dashboard Component
function StaffDashboard({ data, formatCurrency, formatDate, getStatusColor }) {
    return (
        <div className="space-y-6">
            {/* Welcome & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Jobs"
                    value={data.stats.totalJobs}
                    icon={Briefcase}
                    bgColor="bg-indigo-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Today's Jobs"
                    value={data.stats.todayJobs}
                    icon={Calendar}
                    bgColor="bg-blue-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Completed"
                    value={data.stats.completedJobs}
                    icon={CheckCircle}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Urgent Jobs"
                    value={data.stats.urgentJobs}
                    icon={AlertCircle}
                    bgColor="bg-red-500"
                    iconColor="text-white"
                />
            </div>

            {/* Earnings & Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <RevenueCard
                    title="Today's Earnings"
                    amount={formatCurrency(data.stats.earnings.today)}
                    icon={DollarSign}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                />
                <RevenueCard
                    title="Week's Earnings"
                    amount={formatCurrency(data.stats.earnings.week)}
                    icon={TrendingUp}
                    bgColor="bg-blue-500"
                    iconColor="text-white"
                />
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Approval Rate</span>
                        <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.approvalRate}%</div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${data.stats.approvalRate}%` }}
                        />
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Avg Time</span>
                        <Clock className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{data.stats.avgCompletionTime || 0}h</div>
                    <p className="text-xs text-gray-500 mt-2">per job</p>
                </div>
            </div>

            {/* Current Tasks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tasks</h3>
                <div className="space-y-4">
                    {data.currentTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-lg ${getStatusColor(task.status).split(' ')[0]}`}>
                                    {task.status === "Working" ? <Wrench className="w-4 h-4" /> :
                                        task.status === "Inspection" ? <FileText className="w-4 h-4" /> :
                                            <Clock className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">Job #{task.jobId}</span>
                                        {task.priority === "Urgent" && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Urgent</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">{task.vehicle} - {task.vehicleNumber}</p>
                                    <p className="text-xs text-gray-500 mt-1">{task.serviceType}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">{formatDate(task.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Status</h3>
                    <SimplePieChart
                        data={[
                            { name: "Pending", value: data.performance.jobsByStatus.pending },
                            { name: "In Progress", value: data.performance.jobsByStatus.inProgress },
                            { name: "Completed", value: data.performance.jobsByStatus.completed }
                        ]}
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
                    <SimplePieChart
                        data={[
                            { name: "Normal", value: data.performance.priority.normal },
                            { name: "Urgent", value: data.performance.priority.urgent }
                        ]}
                    />
                </div>
            </div>

            {/* Recent Inspections */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Inspections</h3>
                <div className="space-y-3">
                    {data.recentInspections.map((inspection, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Vehicle: {inspection.vehicle}</p>
                                <p className="text-sm text-gray-600">{inspection.issues} issues found</p>
                            </div>
                            <p className="text-xs text-gray-500">{formatDate(inspection.time)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Customer Dashboard Component
function CustomerDashboard({ data, formatCurrency, formatDate, getStatusColor }) {
    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="My Vehicles"
                    value={data.stats.totalVehicles}
                    icon={Car}
                    bgColor="bg-indigo-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Total Services"
                    value={data.stats.totalServices}
                    icon={Wrench}
                    bgColor="bg-blue-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Active Services"
                    value={data.stats.activeServices}
                    icon={Activity}
                    bgColor="bg-yellow-500"
                    iconColor="text-white"
                />
                <StatCard
                    title="Completed"
                    value={data.stats.completedServices}
                    icon={CheckCircle}
                    bgColor="bg-green-500"
                    iconColor="text-white"
                />
            </div>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RevenueCard
                    title="Total Spent"
                    amount={formatCurrency(data.stats.totalSpent)}
                    icon={DollarSign}
                    bgColor="bg-purple-500"
                    iconColor="text-white"
                />
                <RevenueCard
                    title="Pending Payments"
                    amount={formatCurrency(data.stats.pendingPayments)}
                    icon={CreditCard}
                    bgColor="bg-orange-500"
                    iconColor="text-white"
                />
            </div>

            {/* My Vehicles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">My Vehicles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.vehicles.map((vehicle) => (
                        <div key={vehicle.id} className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <Car className="w-4 h-4 text-indigo-600" />
                                </div>
                                <span className="text-xs text-gray-500">{vehicle.fuelType}</span>
                            </div>
                            <h4 className="font-medium text-gray-900">{vehicle.brand} {vehicle.model}</h4>
                            <p className="text-sm text-indigo-600 mt-1">{vehicle.number}</p>
                            {vehicle.variant && (
                                <p className="text-xs text-gray-500 mt-2">{vehicle.variant}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Services */}
            {data.activeServices.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Services</h3>
                    <div className="space-y-4">
                        {data.activeServices.map((service) => (
                            <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${getStatusColor(service.status).split(' ')[0]}`}>
                                        <Wrench className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">Job #{service.jobId}</span>
                                        </div>
                                        <p className="text-sm text-gray-600">{service.vehicle} - {service.serviceType}</p>
                                        <p className="text-xs text-gray-500 mt-1">Staff: {service.assignedStaff || "Assigning..."}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(service.status)}`}>
                                        {service.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Upcoming Appointments */}
            {data.upcomingAppointments.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
                    <div className="space-y-3">
                        {data.upcomingAppointments.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{apt.vehicle}</p>
                                    <p className="text-sm text-gray-600">{apt.serviceType}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-900">{formatDate(apt.date)}</p>
                                    <span className={`text-xs ${getStatusColor(apt.status)}`}>{apt.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {data.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <div className={`w-2 h-2 mt-2 rounded-full ${activity.type === "booking" ? "bg-blue-500" : "bg-green-500"}`}></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-900">{activity.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(activity.status)}`}>
                                        {activity.status}
                                    </span>
                                    <span className="text-xs text-gray-500">{formatDate(activity.date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service History Chart */}
            {data.charts && data.charts.spendingByVehicle.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Vehicle</h3>
                    <div className="space-y-3">
                        {data.charts.spendingByVehicle.map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">{item.vehicle}</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(item.amount)}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-indigo-600 h-2 rounded-full"
                                        style={{ width: `${(item.amount / Math.max(...data.charts.spendingByVehicle.map(i => i.amount))) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Reusable Components
function StatCard({ title, value, icon: Icon, bgColor, iconColor, trend }) {
    const isPositive = trend >= 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${bgColor} bg-opacity-10 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    );
}

function RevenueCard({ title, amount, icon: Icon, bgColor, iconColor }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
                <div className={`p-3 ${bgColor} bg-opacity-10 rounded-xl`}>
                    <Icon className={`w-5 h-5 ${iconColor}`} />
                </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{amount}</p>
        </div>
    );
}

export default Dashboard;