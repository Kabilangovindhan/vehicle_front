import React, { useEffect, useState } from "react";
import {
    Wrench, Car, Loader2, Calendar, Briefcase, ArrowRight,
    AlertCircle, CheckCircle, Info, Clock, User, Phone,
    MapPin, FileText, Truck, CreditCard, Settings,
    XCircle, ChevronRight, AlertTriangle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ServiceTracking() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const phone = sessionStorage.getItem("phone");

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/serviceTracking/${phone}`);
            const data = await res.json();
            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status) => {
        return bookings.filter(b => b.displayStatus === status).length;
    };

    const filteredBookings = bookings.filter(booking =>
        filterStatus === "all" || booking.displayStatus === filterStatus
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-6 w-6 rounded-full bg-indigo-600/20 animate-pulse"></div>
                        </div>
                    </div>
                    <p className="text-slate-600 font-medium mt-4">Loading your service timeline...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans">
            {/* Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                                <Briefcase className="text-white" size={20} />
                            </div>
                            <span className="font-bold text-xl text-slate-900">
                                Auto<span className="text-indigo-600">Care</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
                                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                                    <Clock size={12} />
                                    Live Updates
                                </span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                <User size={16} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                            <Clock className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Service Timeline</h1>
                            <p className="text-slate-500 text-sm mt-1">Track the progress of your vehicle services</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title="Total Services"
                            value={bookings.length}
                            icon={<FileText size={18} />}
                            color="indigo"
                        />
                        <StatCard
                            title="In Progress"
                            value={getStatusCount("In Service") + getStatusCount("Checking Progress")}
                            icon={<Settings size={18} />}
                            color="blue"
                        />
                        <StatCard
                            title="Completed"
                            value={getStatusCount("Completed")}
                            icon={<CheckCircle size={18} />}
                            color="emerald"
                        />
                        <StatCard
                            title="Pending"
                            value={getStatusCount("Pending")}
                            icon={<Clock size={18} />}
                            color="amber"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <FilterTab
                            active={filterStatus === "all"}
                            onClick={() => setFilterStatus("all")}
                            label="All Services"
                        />
                        <FilterTab
                            active={filterStatus === "Pending"}
                            onClick={() => setFilterStatus("Pending")}
                            label="Pending"
                            color="amber"
                        />
                        <FilterTab
                            active={filterStatus === "Checking Progress"}
                            onClick={() => setFilterStatus("Checking Progress")}
                            label="Checking"
                            color="indigo"
                        />
                        <FilterTab
                            active={filterStatus === "In Service"}
                            onClick={() => setFilterStatus("In Service")}
                            label="In Service"
                            color="blue"
                        />
                        <FilterTab
                            active={filterStatus === "Completed"}
                            onClick={() => setFilterStatus("Completed")}
                            label="Completed"
                            color="emerald"
                        />
                        <FilterTab
                            active={filterStatus === "Rejected"}
                            onClick={() => setFilterStatus("Rejected")}
                            label="Rejected"
                            color="rose"
                        />
                    </div>
                </div>

                {/* Bookings Grid */}
                {filteredBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Car size={40} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No Services Found</h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {filterStatus !== 'all'
                                ? `No services with status "${filterStatus}" found.`
                                : "You haven't booked any services yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredBookings.map((booking, index) => (
                            <ServiceCard
                                key={booking._id}
                                booking={booking}
                                index={index}
                                onClick={() => setSelectedBooking(booking)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Details Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <BookingDetailsModal
                        booking={selectedBooking}
                        onClose={() => setSelectedBooking(null)}
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
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600"
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

// Filter Tab Component
function FilterTab({ active, onClick, label, color = "slate" }) {
    const colorClasses = {
        amber: "bg-amber-50 text-amber-700 border-amber-200",
        indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
        blue: "bg-blue-50 text-blue-700 border-blue-200",
        emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
        rose: "bg-rose-50 text-rose-700 border-rose-200",
        slate: "bg-slate-100 text-slate-700 border-slate-300"
    };

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${active
                ? colorClasses[color]
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
        >
            {label}
        </button>
    );
}

// Service Card Component
function ServiceCard({ booking, index, onClick }) {
    const getStatusConfig = (status) => {
        const config = {
            'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
            'Checking Progress': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: Loader2 },
            'In Service': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Wrench },
            'Completed': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
            'Rejected': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: XCircle }
        };
        return config[status] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Info };
    };

    const config = getStatusConfig(booking.displayStatus);
    const StatusIcon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -2 }}
            onClick={onClick}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden"
        >
            <div className="p-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-indigo-50 rounded-xl">
                            <Car className="text-indigo-600" size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-lg text-slate-900">
                                    {booking.vehicle?.vehicleNumber || 'N/A'}
                                </p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${config.bg} ${config.text} border ${config.border}`}>
                                    {booking.displayStatus}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">
                                {booking.serviceType} • WO-{booking._id.slice(-8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar size={16} />
                        <span>{new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}</span>
                    </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <QuickInfo
                        icon={<Car size={14} />}
                        label="Vehicle"
                        value={`${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}`.trim() || 'N/A'}
                    />
                    <QuickInfo
                        icon={<Calendar size={14} />}
                        label="Time Slot"
                        value={booking.timeSlot || 'N/A'}
                    />
                    <QuickInfo
                        icon={<StatusIcon size={14} className={config.text} />}
                        label="Status"
                        value={booking.displayStatus}
                        highlight
                    />
                </div>

                {/* Customer Message Preview */}
                {booking.customerMessage && (
                    <div className={`mt-4 p-3 rounded-lg ${config.bg} border ${config.border} flex items-start gap-2`}>
                        <Info size={16} className={config.text} />
                        <p className={`text-sm ${config.text}`}>{booking.customerMessage}</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Quick Info Component
function QuickInfo({ icon, label, value, highlight = false }) {
    return (
        <div className="flex items-center gap-2">
            <div className="text-slate-400">{icon}</div>
            <div>
                <p className="text-[10px] font-medium text-slate-400 uppercase">{label}</p>
                <p className={`text-sm font-medium ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}

// Booking Details Modal
function BookingDetailsModal({ booking, onClose }) {
    const getStatusConfig = (status) => {
        const config = {
            'Pending': { color: 'amber', icon: Clock, message: 'Your service request is pending approval.' },
            'Checking Progress': { color: 'indigo', icon: Loader2, message: 'We are reviewing your service requirements.' },
            'In Service': { color: 'blue', icon: Wrench, message: 'Your vehicle is currently being serviced.' },
            'Completed': { color: 'emerald', icon: CheckCircle, message: 'Service completed successfully.' },
            'Rejected': { color: 'rose', icon: XCircle, message: booking.customerMessage || 'Service request was rejected.' }
        };
        return config[status] || { color: 'slate', icon: Info, message: 'Processing your request.' };
    };

    const config = getStatusConfig(booking.displayStatus);
    const StatusIcon = config.icon;

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
                <div className={`px-6 py-4 bg-gradient-to-r from-${config.color}-600 to-${config.color}-700`}>
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                            <Briefcase size={24} />
                            <div>
                                <h2 className="text-xl font-bold">Service Details</h2>
                                <p className="text-sm opacity-90">WO-{booking._id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <XCircle size={20} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-xl bg-${config.color}-50 border border-${config.color}-200 flex items-start gap-3`}>
                            <StatusIcon className={`text-${config.color}-600 mt-0.5`} size={20} />
                            <div>
                                <p className={`font-semibold text-${config.color}-700`}>
                                    Status: {booking.displayStatus}
                                </p>
                                <p className={`text-sm text-${config.color}-600 mt-1`}>
                                    {config.message}
                                </p>
                            </div>
                        </div>

                        {/* Customer Message */}
                        {booking.customerMessage && booking.displayStatus !== 'Rejected' && (
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info size={16} className="text-slate-500" />
                                    <h3 className="font-semibold text-slate-900">Service Update</h3>
                                </div>
                                <p className="text-sm text-slate-700">{booking.customerMessage}</p>
                            </div>
                        )}

                        {/* Vehicle Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                title="Vehicle Details"
                                icon={<Truck size={18} />}
                                items={[
                                    { label: 'Number', value: booking.vehicle?.vehicleNumber },
                                    { label: 'Make/Model', value: `${booking.vehicle?.make || ''} ${booking.vehicle?.model || ''}`.trim() },
                                    { label: 'Year', value: booking.vehicle?.year }
                                ]}
                            />
                            <InfoCard
                                title="Service Details"
                                icon={<Wrench size={18} />}
                                items={[
                                    { label: 'Service Type', value: booking.serviceType },
                                    { label: 'Service Date', value: new Date(booking.appointmentDate).toLocaleDateString() },
                                    { label: 'Time Slot', value: booking.timeSlot }
                                ]}
                            />
                        </div>

                        {/* Additional Information */}
                        <InfoCard
                            title="Additional Information"
                            icon={<FileText size={18} />}
                            items={[
                                { label: 'Booking ID', value: booking._id },
                                { label: 'Created On', value: new Date(booking.createdAt).toLocaleDateString() },
                                { label: 'Last Updated', value: new Date(booking.updatedAt).toLocaleDateString() }
                            ]}
                        />

                        {/* Contact Information */}
                        <InfoCard
                            title="Contact Information"
                            icon={<Phone size={18} />}
                            items={[
                                { label: 'Customer Name', value: booking.customer?.name || 'N/A' },
                                { label: 'Phone', value: booking.customer?.phone || phone },
                                { label: 'Email', value: booking.customer?.email || 'N/A' }
                            ]}
                        />

                        {/* Service Timeline */}
                        <div className="bg-slate-50 rounded-xl p-4">
                            <h3 className="font-semibold text-slate-900 mb-3">Service Timeline</h3>
                            <div className="space-y-3">
                                <TimelineItem
                                    status="Booking Created"
                                    date={booking.createdAt}
                                    active={true}
                                    completed={true}
                                />
                                <TimelineItem
                                    status="Approval"
                                    date={booking.approvedAt}
                                    active={booking.status === 'Approved' || booking.displayStatus !== 'Pending'}
                                    completed={booking.status === 'Approved' || booking.displayStatus !== 'Pending'}
                                />
                                <TimelineItem
                                    status="Service Started"
                                    date={booking.startedAt}
                                    active={booking.displayStatus === 'In Service' || booking.displayStatus === 'Completed'}
                                    completed={booking.displayStatus === 'Completed'}
                                />
                                <TimelineItem
                                    status="Service Completed"
                                    date={booking.completedAt}
                                    active={booking.displayStatus === 'Completed'}
                                    completed={booking.displayStatus === 'Completed'}
                                />
                            </div>
                        </div>
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

// Info Card Component
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

// Timeline Item Component
function TimelineItem({ status, date, active, completed }) {
    return (
        <div className="flex items-start gap-3">
            <div className="relative">
                <div className={`w-2 h-2 mt-2 rounded-full ${completed ? 'bg-emerald-500' : active ? 'bg-indigo-500 animate-pulse' : 'bg-slate-300'
                    }`} />
                {!completed && active && (
                    <div className="absolute -inset-1 rounded-full bg-indigo-500/20 animate-ping" />
                )}
            </div>
            <div>
                <p className={`text-sm font-medium ${completed ? 'text-slate-900' : active ? 'text-indigo-600' : 'text-slate-400'
                    }`}>
                    {status}
                </p>
                {date && (
                    <p className="text-xs text-slate-500">
                        {new Date(date).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ServiceTracking;