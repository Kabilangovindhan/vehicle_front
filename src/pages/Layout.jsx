import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu, Users, Car, LayoutDashboard, Book, Calendar } from "lucide-react";

function Dashboard() {
	const [open, setOpen] = useState(false);

	// Common nav style
	const navClass = ({ isActive }) =>
		`flex gap-2 items-center p-2 rounded-md transition
     ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:text-blue-400 hover:bg-slate-800"}`;

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<aside
				className={`bg-slate-900 text-white w-64 p-5 ${open ? "block" : "hidden"
					} md:block`}
			>
				<h1 className="text-xl font-bold mb-6">AutoCare</h1>

				<nav className="space-y-2">
					<NavLink to="/layout/dashboard" end className={navClass}>
						<LayoutDashboard size={18} /> Dashboard
					</NavLink>


					<NavLink to="/layout/customers" className={navClass}>
						<Users size={18} /> Customers
					</NavLink>


					<NavLink to="/layout/vehicleDetails" className={navClass}>
						<Car size={18} /> Vehicles
					</NavLink>


					<NavLink to="/layout/users" className={navClass}>
						<Users size={18} /> Users&Admin
					</NavLink>


					<NavLink to="/layout/service-update" className={navClass}>
						<Book size={18} />Service Update
					</NavLink>


					<NavLink to="/layout/payment" className={navClass}>
						<Book size={18} />Payment
					</NavLink>

					
					<NavLink to="/layout/reports" className={navClass}>
						<Calendar size={18} /> Reports
					</NavLink>






				</nav>
			</aside>

			{/* Main */}
			<div className="flex-1 flex flex-col">

				{/* Page Content */}
				<main className="flex-1 p-6 bg-slate-100 overflow-y-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default Dashboard;
