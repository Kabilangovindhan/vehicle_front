import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	Menu, X, Users, Car, LayoutDashboard, FileText, CreditCard,
	LogOut, Settings, Bell, Search, Calendar, ClipboardCheck,
	Package, Activity, MessageSquare, UserCircle, Briefcase,
	ShieldCheck, History, Camera
} from "lucide-react";

function Layout() {

	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	const userRole = sessionStorage.getItem("role")?.toUpperCase() || "CUSTOMER";

	const handleLogout = () => {
		sessionStorage.clear();
		localStorage.clear();
		navigate("/");
	};

	const menuConfigs = {
		CUSTOMER: [
			{ path: "/layout/dashboard", label: "Dashboard", icon: LayoutDashboard },
			{ path: "/layout/my-vehicles", label: "My Vehicles", icon: Car },
			{ path: "/layout/service-booking", label: "Service Booking", icon: Calendar },
			{ path: "/layout/service-tracking", label: "Service Tracking", icon: Activity },
			{ path: "/layout/estimates", label: "Estimates & Approval", icon: ClipboardCheck },
			{ path: "/layout/billing", label: "Billing & Invoice", icon: CreditCard },
			{ path: "/layout/history", label: "Service History", icon: History },
			{ path: "/layout/feedback", label: "Feedback & Support", icon: MessageSquare },
			{ path: "/layout/notifications", label: "Notifications", icon: Bell },
			{ path: "/layout/profile", label: "Profile", icon: UserCircle },
		],
		STAFF: [
			{ path: "/layout/dashboard", label: "Dashboard", icon: LayoutDashboard },
			{ path: "/layout/assigned-jobs", label: "Assigned Jobs", icon: Briefcase },
			{ path: "/layout/inspection", label: "Inspection Report", icon: FileText },
			{ path: "/layout/spare-parts", label: "Spare Parts Usage", icon: Package },
			{ path: "/layout/service-update", label: "Service Update", icon: ClipboardCheck },
			{ path: "/layout/media-upload", label: "Media Upload", icon: Camera },
			{ path: "/layout/work-history", label: "Work History", icon: History },
			{ path: "/layout/notifications", label: "Notifications", icon: Bell },
			{ path: "/layout/profile", label: "Profile", icon: UserCircle },
		],
		ADMIN: [
			{ path: "/layout/dashboard", label: "Dashboard", icon: LayoutDashboard },
			{ path: "/layout/customer-management	", label: "Customer Management", icon: Users },
			{ path: "/layout/job-assignment", label: "Job Assignment", icon: Calendar },
			{ path: "/layout/job-control", label: "Job Control Center", icon: ShieldCheck },
			{ path: "/layout/inspection-estimation", label: "Inspection & Estimation", icon: FileText },
			{ path: "/layout/inventory", label: "Spare Parts Inventory", icon: Package },
			{ path: "/layout/billing-admin", label: "Billing & Invoice", icon: CreditCard },
			{ path: "/layout/records", label: "Service Records", icon: History },
			{ path: "/layout/reports", label: "Reports & Analytics", icon: Activity },
			{ path: "/layout/notif-center", label: "Notification Center", icon: Bell },
			{ path: "/layout/settings", label: "System Settings", icon: Settings },
			{ path: "/layout/profile", label: "Profile", icon: UserCircle },
		]
	};

	const navItems = menuConfigs[userRole] || menuConfigs.CUSTOMER;

	const navClass = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
			? "bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg shadow-indigo-900/30"
			: "text-indigo-200/70 hover:bg-indigo-800/50 hover:text-white"
		}`;

	return (
		<div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

			{/* SIDEBAR */}
			<aside
				className={`
					fixed md:relative z-50
					top-0 left-0 h-full
					w-72 bg-indigo-950 text-white flex flex-col
					transform transition-transform duration-300 ease-in-out
					${open ? "translate-x-0" : "-translate-x-full"}
					md:translate-x-0 border-r border-indigo-900/50
				`}
			>
				<div className="p-8 mb-2">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
							<Car size={24} className="text-white" />
						</div>
						<div>
							<h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
								AutoCare
							</h1>
							<p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">{userRole} PORTAL</p>
						</div>
					</div>
				</div>

				<nav className="flex-1 px-6 space-y-3 overflow-y-auto sidebar-scroll">
					<p className="px-2 text-[11px] font-bold text-indigo-400/60 uppercase mb-4 tracking-[0.2em]">
						Management
					</p>
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							className={navClass}
							onClick={() => setOpen(false)}
						>
							<item.icon size={20} />
							<span className="font-medium text-sm">{item.label}</span>
						</NavLink>
					))}
					<button
						onClick={handleLogout}
						className="flex w-full text-[13px] items-center gap-3 px-4 py-2 text-xs text-indigo-300 hover:text-red-300 transition-colors"
					>
						<LogOut size={18} />
						<span className="font-medium">Sign Out</span>
					</button>
				</nav>

				<div className="p-6 mt-auto">
					
				</div>
			</aside>

			<div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F7FF]">
				<main className="flex-1 p-6 md:p-10 overflow-y-auto">
					<div className="max-w-7xl mx-auto">
						<div className="md:hidden h-14" />
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}

export default Layout;