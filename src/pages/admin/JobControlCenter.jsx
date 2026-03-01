import React, { useEffect, useState } from "react";
import {
    Loader2, Car, User, Phone, Wrench, AlertCircle,
    ShieldCheck, Clock, RefreshCw, Filter, Search,
    Calendar, Users, Briefcase, CheckCircle2, XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function JobControlCenter() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedJob, setSelectedJob] = useState(null);

    useEffect(() => {
        fetchJobs();
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/jobControlCenter/fetch");
            const data = await res.json();
            setJobs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status) => {
        return jobs.filter(job => job.jobStatus === status).length;
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.booking?.vehicle?.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.booking?.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.assignedStaff?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || job.jobStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) return <LoadingState />;

    return (
        <div className="min-h-screenfont-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                            <Briefcase className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Job Control Center</h1>
                            <p className="text-slate-500 text-sm mt-1">Monitor and manage active service jobs</p>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by vehicle, customer, or technician..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Inspection">Inspection</option>
                                <option value="Waiting Approval">Waiting Approval</option>
                                <option value="Working">Working</option>
                                <option value="Completed">Completed</option>
                                <option value="Ready Delivery">Ready Delivery</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                <AnimatePresence mode="wait">
                    {filteredJobs.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <EmptyState />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {filteredJobs.map((job, index) => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    index={index}
                                    onClick={() => setSelectedJob(job)}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Job Details Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <JobDetailsModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Stat Card Component
function StatCard({ title, value, icon, color }) {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600"
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">{title}</span>
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );
}

// Job Card Component
function JobCard({ job, index, onClick }) {
    const getTimeElapsed = (createdAt) => {
        const diff = Date.now() - new Date(createdAt).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        >
            {/* Card Header */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                            <Car className="text-indigo-600" size={22} />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-slate-900">
                                {job.booking?.vehicle?.vehicleNumber || "N/A"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {job.booking?.vehicle?.model || "Vehicle Model"}
                            </p>
                        </div>
                    </div>
                    <StatusBadge status={job.jobStatus} />
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-4">
                    <DetailRow
                        icon={<User size={16} />}
                        label="Customer"
                        value={job.booking?.customer?.name}
                    />
                    <DetailRow
                        icon={<Wrench size={16} />}
                        label="Service"
                        value={job.booking?.serviceType}
                    />
                    <DetailRow
                        icon={<Phone size={16} />}
                        label="Contact"
                        value={job.assignedStaff?.phone || "Not assigned"}
                    />
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                {job.assignedStaff?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase">Technician</p>
                                <p className="text-sm font-semibold text-slate-700">
                                    {job.assignedStaff?.name || "Unassigned"}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-medium text-slate-400">Started</p>
                            <p className="text-xs font-semibold text-slate-600">
                                {getTimeElapsed(job.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Detail Row Component
function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-slate-400">{icon}</div>
            <div className="flex-1">
                <p className="text-[10px] font-medium text-slate-400 uppercase">{label}</p>
                <p className="text-sm font-medium text-slate-700 truncate">{value || "---"}</p>
            </div>
        </div>
    );
}

// Status Badge Component
function StatusBadge({ status }) {
    const statusConfig = {
        Assigned: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
        Inspection: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
        "Waiting Approval": { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
        Working: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "ring-indigo-200" },
        Completed: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
        "Ready Delivery": { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-200" }
    };

    const config = statusConfig[status] || {
        bg: "bg-slate-50",
        text: "text-slate-700",
        ring: "ring-slate-200"
    };

    return (
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-lg ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}>
            {status}
        </span>
    );
}

// Job Details Modal
function JobDetailsModal({ job, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <Briefcase size={24} />
                            <div>
                                <h2 className="text-xl font-bold">Job Details</h2>
                                <p className="text-sm text-indigo-100">Job #{job._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-indigo-500 rounded-lg transition-colors"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Status Timeline */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-semibold text-slate-900 mb-3">Job Status</h3>
                            <div className="flex items-center gap-2">
                                <StatusBadge status={job.jobStatus} />
                                <span className="text-sm text-slate-500">
                                    Updated {new Date(job.updatedAt).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <InfoCard
                                title="Customer Details"
                                icon={<User size={18} />}
                                items={[
                                    { label: "Name", value: job.booking?.customer?.name },
                                    { label: "Phone", value: job.booking?.customer?.phone },
                                    { label: "Email", value: job.booking?.customer?.email }
                                ]}
                            />
                            <InfoCard
                                title="Vehicle Details"
                                icon={<Car size={18} />}
                                items={[
                                    { label: "Number", value: job.booking?.vehicle?.vehicleNumber },
                                    { label: "Model", value: job.booking?.vehicle?.model },
                                    { label: "Year", value: job.booking?.vehicle?.year }
                                ]}
                            />
                        </div>

                        {/* Service Information */}
                        <InfoCard
                            title="Service Information"
                            icon={<Wrench size={18} />}
                            items={[
                                { label: "Service Type", value: job.booking?.serviceType },
                                { label: "Service Date", value: new Date(job.booking?.serviceDate).toLocaleDateString() },
                                { label: "Time Slot", value: job.booking?.timeSlot }
                            ]}
                        />

                        {/* Staff Assignment */}
                        <InfoCard
                            title="Staff Assignment"
                            icon={<Users size={18} />}
                            items={[
                                { label: "Technician", value: job.assignedStaff?.name || "Unassigned" },
                                { label: "Phone", value: job.assignedStaff?.phone || "N/A" },
                                { label: "Specialization", value: job.assignedStaff?.specialization || "General" }
                            ]}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// Info Card Component for Modal
function InfoCard({ title, icon, items }) {
    return (
        <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-white rounded-lg text-indigo-600">
                    {icon}
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
            </div>
            <div className="space-y-2">
                {items.map((item, index) => (
                    item.value && (
                        <div key={index} className="text-sm">
                            <span className="text-slate-500">{item.label}: </span>
                            <span className="font-medium text-slate-900">{item.value}</span>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}

// Loading State
function LoadingState() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <div className="text-center">
                <div className="relative">
                    <Loader2 className="animate-spin text-indigo-600 mx-auto mb-4" size={48} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-indigo-600/20 animate-pulse"></div>
                    </div>
                </div>
                <p className="text-slate-600 font-medium">Loading Control Center...</p>
                <p className="text-sm text-slate-400 mt-1">Please wait</p>
            </div>
        </div>
    );
}

// Empty State
function EmptyState() {
    return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
            <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Jobs</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
                There are currently no active jobs in the system. New jobs will appear here when assigned.
            </p>
        </div>
    );
}

export default JobControlCenter;