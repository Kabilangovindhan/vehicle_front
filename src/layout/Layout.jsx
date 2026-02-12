import React, { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Users, Car, LayoutDashboard, FileText, CreditCard, LogOut, Settings, Bell, Search } from "lucide-react";

function Layout() {

	const [open, setOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const handleLogout = () => {
		sessionStorage.clear();   // remove name, phone, role, token
		localStorage.clear();     // optional if you stored anything there
		navigate("/");            // or "/login" (your login route)
	};


	const navClass = ({ isActive }) =>
		`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
			? "bg-gradient-to-r from-indigo-600 to-indigo-600 text-white shadow-lg shadow-indigo-900/30"
			: "text-indigo-200/70 hover:bg-indigo-800/50 hover:text-white"
		}`;

	const navItems = [
		{ path: "/layout/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
		{ path: "/layout/customers", label: "Customer Info", icon: Users },
		{ path: "/layout/vechicleMaster", label: "Vehicle Master", icon: Car },
		{ path: "/layout/service-update", label: "Service Update", icon: FileText },
		{ path: "/layout/payment", label: "Payments", icon: CreditCard },
		{ path: "/layout/reports", label: "Reports", icon: Bell },
	];

	return (
		<div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

			{/* ================= MOBILE TOP BAR ================= */}
			<header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-indigo-950 border-b border-indigo-800 text-white flex items-center justify-between px-5 py-4">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
						<Car size={18} className="text-white" />
					</div>
					<span className="font-bold tracking-tight text-xl">AutoCare</span>
				</div>
				<button onClick={() => setOpen(!open)} className="p-1 hover:bg-indigo-800 rounded-md">
					{open ? <X size={24} /> : <Menu size={24} />}
				</button>
			</header>

			{/* ================= SIDEBAR ================= */}
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
				{/* Brand Identity */}
				<div className="p-8 mb-2">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
							<Car size={24} className="text-white" />
						</div>
						<div>
							<h1 className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
								AutoCare
							</h1>
							<p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Premium Service</p>
						</div>
					</div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 px-6 space-y-2 overflow-y-auto">
					<p className="px-2 text-[11px] font-bold text-indigo-400/60 uppercase mb-4 tracking-[0.2em]">Management</p>
					{navItems.map((item) => (
						<NavLink
							key={item.path}
							to={item.path}
							end={item.end}
							className={navClass}
							onClick={() => setOpen(false)}
						>
							<item.icon size={20} />
							<span className="font-medium text-sm">{item.label}</span>
						</NavLink>
					))}
				</nav>

				{/* User Profile */}
				<div className="p-6 mt-auto border-t border-indigo-900/50">
					<div className="flex items-center gap-3 p-3 rounded-2xl bg-indigo-900/40 border border-indigo-800/50">
						<div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-inner">
							AD
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-semibold text-white truncate">Admin User</p>
							<p className="text-[11px] text-indigo-300/70 truncate leading-none">Workshop Manager</p>
						</div>
					</div>
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 px-4 py-4 text-sm text-indigo-300 hover:text-red-300 transition-colors mt-2"
					>

						<LogOut size={18} />
						<span className="font-medium">Sign Out</span>
					</button>
				</div>
			</aside>

			{open && (
				<div
					className="fixed inset-0 bg-indigo-950/40 backdrop-blur-md z-40 md:hidden transition-opacity"
					onClick={() => setOpen(false)}
				/>
			)}

			<div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8F7FF]">

				{/* Top Header */}
				<header className="hidden md:flex h-20 bg-white border-b border-indigo-100 items-center justify-between px-10 shrink-0">
					<div className="relative w-96">
						<span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
							<Search size={18} />
						</span>
						<input
							type="text"
							placeholder="Quick search..."
							className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
						/>
					</div>

					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<button className="p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all relative">
								<Bell size={20} />
								<span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
							</button>
							<button className="p-2.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all">
								<Settings size={20} />
							</button>
						</div>
						<div className="h-8 w-[1px] bg-slate-200" />
						<div className="text-right">
							<p className="text-sm font-bold text-slate-700">Workshop One</p>
							<p className="text-[11px] text-green-500 font-bold uppercase tracking-tighter">System Online</p>
						</div>
					</div>
				</header>

				{/* Content Area */}
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