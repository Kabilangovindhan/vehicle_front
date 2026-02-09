import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
	Menu,
	X,
	Users,
	Car,
	LayoutDashboard,
	Book,
	Calendar
} from "lucide-react";

function Dashboard() {
	const [open, setOpen] = useState(false);

	// Common nav style (UNCHANGED DESIGN)
	const navClass = ({ isActive }) =>
		`flex gap-2 items-center p-2 rounded-md transition
    ${isActive
			? "bg-blue-600 text-white"
			: "text-slate-300 hover:text-blue-400 hover:bg-slate-800"
		}`;

	return (
		<div className="flex h-screen overflow-hidden">

			{/* ================= MOBILE TOP BAR ================= */}
			<div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white flex items-center justify-between px-4 py-3 shadow-lg">
				<h1 className="font-bold text-lg">AutoCare</h1>

				<button onClick={() => setOpen(!open)}>
					{open ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* ================= SIDEBAR ================= */}
			<aside
				className={`
          fixed md:relative z-50
          top-0 left-0 h-full
          w-64 bg-slate-900 text-white p-5
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
			>
				{/* Close button mobile */}
				<div className="flex justify-between items-center mb-6 md:hidden">
					<h1 className="text-xl font-bold">AutoCare</h1>
					<button onClick={() => setOpen(false)}>
						<X size={22} />
					</button>
				</div>

				{/* Desktop title */}
				<h1 className="text-xl font-bold mb-6 hidden md:block">
					AutoCare
				</h1>

				<nav className="space-y-2">

					<NavLink to="/layout/dashboard" end className={navClass}
						onClick={() => setOpen(false)}>
						<LayoutDashboard size={18} /> Dashboard
					</NavLink>


					<NavLink to="/layout/users" className={navClass} onClick={() => setOpen(false)}>
						<Users size={18} /> Users & Admin
					</NavLink>

					
					<NavLink to="/layout/customers" className={navClass} onClick={() => setOpen(false)}>
						<Users size={18} /> Customers
					</NavLink>


					<NavLink
						to="/layout/vehicleDetails" className={navClass} onClick={() => setOpen(false)}>
						<Car size={18} /> Vehicles
					</NavLink>


					<NavLink to="/layout/service-update" className={navClass} onClick={() => setOpen(false)}>
						<Book size={18} /> Service Update
					</NavLink>

					<NavLink to="/layout/payment" className={navClass} onClick={() => setOpen(false)}>
						<Book size={18} /> Payment
					</NavLink>

					<NavLink to="/layout/reports" className={navClass} onClick={() => setOpen(false)}>
						<Calendar size={18} /> Reports
					</NavLink>

				</nav>
			</aside>

			{/* ================= OVERLAY MOBILE ================= */}
			{
				open && (
					<div
						className="fixed inset-0 bg-black/40 z-40 md:hidden"
						onClick={() => setOpen(false)}
					/>
				)
			}

			{/* ================= MAIN CONTENT ================= */}
			<div className="flex-1 flex flex-col w-full">

				{/* Spacer for mobile header */}
				<div className="h-14 md:hidden" />

				{/* Page Content */}
				<main className="flex-1 p-4 sm:p-6 bg-slate-100 overflow-y-auto">
					<Outlet />
				</main>

			</div>
		</div >
	);
}

export default Dashboard;
