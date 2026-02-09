import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Eye, EyeOff, Car } from "lucide-react";

function Auth() {

	const navigate = useNavigate();

	const [isRegistering, setIsRegistering] = useState(false);
	const [isForgotPassword, setIsForgotPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [formData, setFormData] = useState({
		fullName: "",
		email: "",
		phone: "",
		address: "",
		password: ""
	});

	const bgImage = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2000&auto=format&fit=crop";

	const regInputClasses = `
        w-full px-[18px] py-[14px] rounded-[16px] 
        bg-white/5 border border-white/10 text-white text-sm outline-none
        transition-all duration-300 
        focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/15
        placeholder-white/30
    `;

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = (e) => {
		e.preventDefault();
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			if (isForgotPassword) {
				alert("Password reset link sent to email!");
				setIsForgotPassword(false);
				return;
			}
			if (!isRegistering) navigate("/layout/dashboard");
			else alert("Account Created!");
		}, 1200);
	};

	return (
		<div className="relative min-h-screen flex items-center justify-center px-4 font-sans selection:bg-indigo-500/30">

			{/* BACKGROUND */}
			<div className="fixed inset-0 -z-10 overflow-hidden">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
					style={{
						backgroundImage: `
                        linear-gradient(to right, rgba(15, 12, 41, 0.85), rgba(48, 43, 99, 0.7), rgba(36, 36, 62, 0.85)),
                        url(${bgImage})
                    `
					}}
				/>
				<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full" />
			</div>

			{/* MAIN CONTENT */}
			<div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24 py-10">

				{/* BRAND SECTION */}
				<div className="w-full lg:w-1/2 text-white text-center lg:text-left space-y-6">
					<div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-400/20 rounded-full backdrop-blur-md">
						<Car size={18} className="text-indigo-400" />
						<span className="text-xs font-bold tracking-widest uppercase text-indigo-200">Workshop Management v2.0</span>
					</div>

					<h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
						AUTO
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-300">
							CARE
						</span>
					</h1>

					<p className="text-indigo-100/60 text-base sm:text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
						{isForgotPassword
							? "Don't worry, it happens to the best of us. Let's get you back in."
							: isRegistering
								? "Join the elite network of automotive service management."
								: "Streamline your workshop operations with our advanced dashboard."}
					</p>
				</div>

				{/* AUTH CARD */}
				<div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

					<div className="mb-10 text-center lg:text-left">
						<h2 className="text-2xl font-bold text-white mb-2">
							{isForgotPassword ? "Reset Password" : isRegistering ? "Register Workshop" : "System Access"}
						</h2>
						<div className="h-1 w-12 bg-indigo-500 rounded-full lg:mx-0 mx-auto" />
					</div>

					<form onSubmit={handleSubmit} className="space-y-5">

						{/* INPUTS FOR LOGIN/FORGOT */}
						{!isRegistering && (
							<div className="space-y-4">
								<div className="group border-b border-white/10 focus-within:border-indigo-500 py-3 transition-all duration-300">
									<input
										type="email"
										name="email"
										placeholder="Email Address"
										className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
										onChange={handleChange}
										required
									/>
								</div>

								{!isForgotPassword && (
									<div className="group border-b border-white/10 focus-within:border-indigo-500 py-3 transition-all duration-300 flex items-center">
										<input
											type={showPassword ? "text" : "password"}
											name="password"
											placeholder="Password"
											className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm"
											onChange={handleChange}
											required
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="text-white/30 hover:text-indigo-400"
										>
											{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								)}
							</div>
						)}

						{/* REGISTER SPECIFIC FIELDS */}
						{isRegistering && !isForgotPassword && (
							<div className="space-y-4">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-16">
									<div className="space-y-4">
										<div>
											<label className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold ml-2 mb-2.5 block">Full Name</label>
											<input name="fullName" placeholder="John Doe" className={regInputClasses} onChange={handleChange} required />
										</div>
										<div>
											<label className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold ml-2 mb-2.5 block">Phone Number</label>
											<input name="phone" placeholder="+1 (555) 000-0000" className={regInputClasses} onChange={handleChange} required />
										</div>
									</div>

									<div className="space-y-4">
										<div>
											<label className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold ml-2 mb-2.5 block">Email Address</label>
											<input name="email" placeholder="john@example.com" className={regInputClasses} onChange={handleChange} required />
										</div>
										<div>
											<label className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold ml-2 mb-2.5 block">Secure Password</label>
											<div className="relative">
												<input
													type={showPassword ? "text" : "password"}
													name="password"
													placeholder="••••••••"
													className={`${regInputClasses} pr-12`}
													onChange={handleChange}
													required
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-indigo-400 transition-colors"
												>
													{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
												</button>
											</div>
										</div>
									</div>
								</div>

								<div>
									<label className="text-[10px] uppercase tracking-widest text-indigo-500 font-bold ml-2 mb-2.5 block">Workshop Address</label>
									<textarea
										name="address"
										placeholder="Enter your full business address..."
										className={`${regInputClasses} h-24 resize-none scrollbar-thin scrollbar-thumb-white/10`}
										onChange={handleChange}
									/>
								</div>
							</div>
						)}

						{/* MAIN ACTION BUTTON */}
						<button className="group relative w-full overflow-hidden mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-indigo-900/40 active:scale-[0.98]">
							<div className="relative z-10 flex justify-center items-center gap-2">
								{isLoading ? <Loader2 className="animate-spin" /> : <span>{isForgotPassword ? "Send Link" : "Continue"}</span>}
								{!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
							</div>
						</button>
					</form>

					{/* FOOTER TOGGLES */}
					<div className="mt-8 text-center">
						{!isForgotPassword ? (
							<p className="text-white/40 text-sm">
								{isRegistering ? "Already managed by us?" : "Ready to join?"}{" "}
								<button
									onClick={() => setIsRegistering(!isRegistering)}
									className="text-indigo-400 font-bold hover:underline ml-1"
								>
									{isRegistering ? "Login" : "Create Account"}
								</button>
							</p>
						) : (
							<button
								onClick={() => setIsForgotPassword(false)}
								className="text-indigo-400 font-bold text-sm hover:underline"
							>
								Return to Login
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Auth;