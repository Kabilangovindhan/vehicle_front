import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterVehicleService() {
    // 1. Hook must be inside the component
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        altPhone: "",
        address: "",
        password: ""
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/customer/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();

            if (response.ok) {
                alert("Account Created Successfully!");
                // 2. Navigate to login/home after successful registration
                navigate("/"); 
            } else {
                alert("Error: " + (data.message || "Registration failed"));
            }
        } catch (error) {
            alert("System Offline: Check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-svh w-full flex items-center justify-center bg-slate-50 p-0 sm:p-6 md:p-12">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white sm:rounded-[2.5rem] shadow-[0_22px_70px_4px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100">

                {/* Left Professional Visual Panel */}
                <div className="hidden lg:flex lg:w-1/2 bg-[#1e293b] relative overflow-hidden flex-col">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent z-10 opacity-80" />
                    <div className="absolute inset-0 scale-110 hover:scale-100 transition-transform duration-[5000ms]">
                        <img
                            src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=1200"
                            alt="Luxury vehicle in service"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="relative z-20 p-16 h-full flex flex-col justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-white font-bold tracking-widest text-lg uppercase">AutoFlow Pro</span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter">
                                Precision Care <br />
                                <span className="text-blue-500">Every Mile.</span>
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed max-w-md font-medium">
                                The world's most advanced vehicle maintenance platform. Track history, schedule repairs, and optimize performance from one dashboard.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-4">
                                {["24/7 Support", "Expert Mechanics", "Real-time Tracking"].map((tag) => (
                                    <span key={tag} className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                            Trusted by 50,000+ Drivers
                        </div>
                    </div>
                </div>

                {/* Right Form Section */}
                <div className="flex-1 p-8 sm:p-14 md:p-20 bg-white">
                    <header className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Get Started</h2>
                        <p className="text-slate-500 font-medium">Create your professional vehicle service account.</p>
                    </header>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block transition-colors group-focus-within:text-blue-600">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                placeholder="e.g. Alexander Pierce"
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:ring-0 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-800 placeholder:text-slate-300 font-medium"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-blue-600">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                placeholder="+1 234..."
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-blue-600">Alternative</label>
                            <input
                                type="tel"
                                name="altPhone"
                                value={formData.altPhone}
                                placeholder="Optional"
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                                onChange={handleChange}
                            />
                        </div>

                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-blue-600">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="alex@example.com"
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-blue-600">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                rows="2"
                                placeholder="Primary location for service"
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none resize-none"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="md:col-span-2 group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 mb-2 block group-focus-within:text-blue-600">Secure Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="••••••••"
                                className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="md:col-span-2 pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-5 rounded-2xl font-black text-white text-sm tracking-widest uppercase transition-all shadow-2xl active:scale-[0.98] ${isLoading ? "bg-slate-400" : "bg-blue-600 hover:bg-slate-900 hover:shadow-blue-200"}`}
                            >
                                {isLoading ? "Validating..." : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <footer className="mt-12 text-center">
                        <p className="text-slate-400 font-bold text-sm">
                            Already a partner?
                            <button 
                                onClick={() => navigate("/")} 
                                className="ml-2 text-blue-600 hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900"
                            >
                                Sign In
                            </button>
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}

export default RegisterVehicleService;



