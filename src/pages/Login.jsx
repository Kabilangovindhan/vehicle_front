import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Phone, Mail, Lock, User, MapPin, ArrowRight, Loader2 } from "lucide-react";

function Auth() {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        altPhone: "",
        address: "",
        password: ""
    });

    const bgImage = "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2000&auto=format&fit=crop";

    const formatIndianPhone = (value) => {
        const digits = value.replace(/\D/g, "");
        const mainDigits = digits.startsWith("91") ? digits.slice(2) : digits;
        const truncated = mainDigits.slice(0, 10);
        
        if (truncated.length > 5) {
            return `+91 ${truncated.slice(0, 5)}-${truncated.slice(5)}`;
        } else if (truncated.length > 0) {
            return `+91 ${truncated}`;
        }
        return truncated;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "phone" || name === "altPhone") {
            setFormData({ ...formData, [name]: formatIndianPhone(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            if (!isRegistering) navigate("/layout");
            else alert("Account Created for Auto Care!");
        }, 1500);
    };

    return (
        <div className="relative min-h-[100dvh] w-full flex items-center justify-center font-sans selection:bg-emerald-500/30 overflow-x-hidden">
            
            {/* BACKGROUND: Low Opacity for Clear Engine View */}
            <div 
                className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(2, 6, 23, 0.4), rgba(2, 6, 23, 0.7)), url('${bgImage}')`,
                }}
            >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            </div>

            <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                
                {/* Branding Side */}
                <div className="w-full lg:w-1/2 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Premium Auto Services</span>
                    </div>
                    
                    <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-lg">
                        AUTO <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">CARE</span>
                    </h1>
                    
                    <p className="text-white/80 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                        {isRegistering 
                            ? "Register your vehicle for world-class maintenance and real-time tracking."
                            : "Welcome back. Log in to access your garage and service history."}
                    </p>
                </div>

                {/* CARD: Clean Glass-morphism */}
                <div className="w-full lg:w-[480px]">
                    <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden transition-all duration-500">
                        
                        <div className="p-8 sm:p-10">
                            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                                {isRegistering ? "Create Profile" : "Secure Login"}
                                {isLoading && <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isRegistering ? (
                                    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/50" />
                                            <input name="fullName" required placeholder="Full Name" className="professional-input" onChange={handleChange} />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/50" />
                                                <input name="phone" required placeholder="Mobile" value={formData.phone} className="professional-input text-xs" onChange={handleChange} />
                                            </div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-100/50" />
                                                <input name="email" type="email" required placeholder="Email" className="professional-input text-xs" onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-4 w-5 h-5 text-emerald-100/50" />
                                            <textarea name="address" rows="2" placeholder="Primary Address" className="professional-input pl-12 pt-4 resize-none" onChange={handleChange} />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/50" />
                                            <input name="password" type="password" required placeholder="Create Password" className="professional-input" onChange={handleChange} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/50" />
                                            <input type="email" required placeholder="Email Address" className="professional-input" />
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/50" />
                                            <input type="password" required placeholder="Password" className="professional-input" />
                                        </div>
                                    </div>
                                )}

                                <button 
                                    disabled={isLoading}
                                    className="w-full bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] mt-6 shadow-xl shadow-emerald-500/10"
                                >
                                    {/* UPDATED LABEL */}
                                    <span>{isRegistering ? "Register Now" : "Login"}</span>
                                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                                </button>
                            </form>

                            <div className="mt-8 text-center border-t border-white/10 pt-6">
                                <button 
                                    onClick={() => setIsRegistering(!isRegistering)}
                                    className="text-sm font-bold text-white/60 hover:text-emerald-400 transition-colors"
                                >
                                    {/* UPDATED TOGGLE LABELS */}
                                    {isRegistering ? "Already a member? Sign In" : "New to Auto Care? Register"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .professional-input {
                    width: 100%;
                    padding: 1rem 1rem 1rem 3.5rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 1.25rem;
                    color: white;
                    outline: none;
                    transition: all 0.3s ease;
                    font-size: 0.875rem;
                }
                .professional-input:focus {
                    background: rgba(255, 255, 255, 0.12);
                    border-color: rgba(16, 185, 129, 0.5);
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
                }
                .professional-input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }
            `}</style>
        </div>
    );
}

export default Auth;