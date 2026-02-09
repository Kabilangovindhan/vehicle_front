import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff
} from "lucide-react";

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

  const bgImage =
    "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=2000&auto=format&fit=crop";

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
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">

      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 sm:scale-105 lg:scale-100"
          style={{
            backgroundImage: `
              linear-gradient(rgba(2,6,23,.65), rgba(2,6,23,.85)),
              url(${bgImage})
            `
          }}
        />
      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 sm:gap-10 lg:gap-16 py-8 sm:py-10">

        {/* BRAND */}
        <div className="w-full lg:w-1/2 text-white text-center lg:text-left">
          <ShieldCheck className="text-emerald-400 mb-3 mx-auto lg:mx-0" size={36} />

          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black mb-3">
            AUTO CARE
          </h1>

          <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
            {isForgotPassword
              ? "Reset your password securely."
              : isRegistering
              ? "Create your service account."
              : "Welcome back. Access your dashboard."}
          </p>
        </div>

        {/* CARD */}
        <div className="w-full max-w-md lg:max-w-[450px] bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">
            {isForgotPassword
              ? "Forgot Password"
              : isRegistering
              ? "Create Account"
              : "Secure Login"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* ===== FORGOT PASSWORD ===== */}
            {isForgotPassword && (
              <div className="border-b border-white/30 focus-within:border-emerald-400 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your registered Email"
                  className="w-full bg-transparent outline-none text-white placeholder-white/40 text-sm sm:text-base"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* ===== LOGIN ===== */}
            {!isRegistering && !isForgotPassword && (
              <>
                <div className="border-b border-white/30 focus-within:border-emerald-400 pb-2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    className="w-full bg-transparent outline-none text-white placeholder-white/40"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="border-b border-white/30 focus-within:border-emerald-400 pb-2 flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-white placeholder-white/40"
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-white/60 hover:text-emerald-400"
                  >
                    Forgot Password?
                  </button>
                </div>
              </>
            )}

            {/* ===== REGISTER ===== */}
            {isRegistering && !isForgotPassword && (
              <div className="space-y-4">
                <input name="fullName" placeholder="Full Name" className="register-input" onChange={handleChange} required />
                <input name="phone" placeholder="Phone Number" className="register-input" onChange={handleChange} required />
                <input name="email" placeholder="Email" className="register-input" onChange={handleChange} required />

                <textarea name="address" placeholder="Address" className="register-input h-24" onChange={handleChange} />

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create Password"
                    className="register-input pr-12"
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 sm:py-4 rounded-xl flex justify-center items-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* FOOTER TOGGLES */}
          {!isForgotPassword && (
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-white/60 hover:text-emerald-400 text-sm mt-6 sm:mt-8"
            >
              {isRegistering ? "Already have account? Login" : "New User? Register"}
            </button>
          )}

          {isForgotPassword && (
            <button
              onClick={() => setIsForgotPassword(false)}
              className="text-white/60 hover:text-emerald-400 text-sm mt-6"
            >
              Back to Login
            </button>
          )}

        </div>
      </div>

      <style>{`
        .register-input {
          width:100%;
          padding:14px;
          border-radius:14px;
          background: rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.15);
          color:white;
          outline:none;
          font-size:14px;
        }

        .register-input:focus{
          border-color:#10b981;
          background:rgba(255,255,255,.15);
        }
      `}</style>

    </div>
  );
}

export default Auth;





