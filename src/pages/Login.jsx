

import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const bgImage = "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2000&auto=format&fit=crop";

	const handleLogin = (e) => {
		e.preventDefault();
		// Logic for authentication goes here
		console.log("Authenticating...");
		navigate("/layout");
	};

	return (
		<div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-slate-900 font-sans">

			{/* Background Layer */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('${bgImage}')`,
					backgroundAttachment: 'fixed'
				}}
			/>

			<div className="relative z-10 w-full max-w-6xl px-4 py-6 sm:px-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-12">

				{/* Left Side: Branding */}
				<div className="flex flex-col text-center lg:text-left text-white max-w-lg">
					<div className="flex items-center justify-center lg:justify-start gap-3 mb-4 sm:mb-6">
						<div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
							<svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011-1v5m-4 0h4" />
							</svg>
						</div>
						<h1 className="text-3xl sm:text-4xl font-black tracking-tighter">Auto<span className="text-blue-500">Care</span></h1>
					</div>
					<h2 className="text-3xl sm:text-5xl font-bold leading-tight mb-4 tracking-tight">
						Master Your <br className="hidden sm:block" />Service Operations.
					</h2>
					<p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
						The professional portal for vehicle technicians. Track, diagnose, and manage with precision.
					</p>
				</div>

				{/* Right Side: The Login Card */}
				<div className="w-full max-w-md transition-all duration-500">
					<div className="bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-white/10">

						{/* Header section of the card */}
						<div className="bg-slate-50 p-8 text-center lg:text-left border-b border-slate-100">
							<h3 className="text-2xl font-black text-slate-900">Sign In</h3>
							<p className="text-slate-500 text-sm font-medium mt-1">Enterprise Authentication Required</p>
						</div>

						<div className="p-8 sm:p-10">
							<form className="space-y-5" onSubmit={handleLogin}>
								<div>
									<label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Email or Username</label>
									<input
										type="email"
										required
										className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder-slate-300 text-slate-900 font-medium"
										placeholder="technician@autocare.com"
									/>
								</div>

								<div>
									<div className="flex justify-between mb-2 ml-1">
										<label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Password</label>
										<button type="button" className="text-[10px] font-bold text-blue-600 uppercase hover:underline">Forgot?</button>
									</div>
									<input
										type="password"
										required
										className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all placeholder-slate-300 text-slate-900 font-medium"
										placeholder="••••••••"
									/>
								</div>

								<button
									type="submit"
									className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4"
								>
									Access Terminal
								</button>
							</form>

							<div className="mt-8 text-center pt-6 border-t border-slate-50">
								<p className="text-sm text-slate-500">
									Don’t have an account?{" "}
									<button
										className="text-blue-600 font-bold hover:underline"
										onClick={() => navigate("/register")}
									>
										Register
									</button>
								</p>
								<p className="text-[10px] text-slate-300 font-medium tracking-widest mt-4 uppercase">System Secured by AutoCare Core</p>
							</div>
						</div>
					</div>

					{/* Minimalist Footer */}
					<div className="mt-6 flex justify-between items-center px-4 opacity-50">
						<p className="text-white text-[9px] font-bold uppercase tracking-widest">Global Fleet v2.4</p>
						<div className="flex gap-2">
							<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<p className="text-white text-[9px] font-bold uppercase tracking-widest">Server Online</p>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}

export default Login;