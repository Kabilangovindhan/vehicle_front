import React from "react";
import { motion } from "framer-motion";

function Login() {
  // Professional High-Resolution Vehicle Service Image
  const bgImage = "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-slate-900">
      {/* Background Layer with Responsive Blur/Shade */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.4)), url('${bgImage}')`,
          backgroundAttachment: 'fixed'
        }}
      />

      <div className="relative z-10 w-full max-w-6xl px-4 py-8 sm:px-10 flex items-center justify-center lg:justify-between">
        
        {/* Left Side: Branding (Hidden on small mobile, visible on tablet/desktop) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:flex flex-col text-white max-w-lg"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tighter">Auto<span className="text-blue-500">Fleet</span></h1>
          </div>
          <h2 className="text-5xl font-bold leading-tight mb-4">Master Your <br/>Service Operations.</h2>
          <p className="text-slate-400 text-lg">The all-in-one portal for technicians and fleet managers. Track, diagnose, and deliver excellence.</p>
        </motion.div>

        {/* Right Side: The Login Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden border border-white/20">
            
            {/* Mobile-Only Header */}
            <div className="lg:hidden bg-slate-900 p-6 text-center">
              <h1 className="text-white text-2xl font-bold tracking-tight">AutoFleet <span className="text-blue-500">v2.0</span></h1>
            </div>

            <div className="p-8 sm:p-12">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Sign In</h3>
                <p className="text-slate-500 text-sm">Welcome back! Please enter your details.</p>
              </div>

              <form className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Staff ID / Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-4 bg-slate-100 border-2 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400"
                    placeholder="name@company.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
                  </div>
                  <input
                    type="password"
                    className="w-full px-4 py-4 bg-slate-100 border-2 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all placeholder-slate-400"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-xl transition-all active:scale-[0.98] mt-2"
                >
                  Access Dashboard
                </button>
              </form>
              
              <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <p className="text-sm text-slate-500 italic">"Efficiency drives performance."</p>
              </div>
            </div>
          </div>

          {/* Device-specific footer */}
          <div className="mt-6 flex justify-between items-center px-4">
             <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">Secure Access Point</p>
             <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">V2.4.0</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;