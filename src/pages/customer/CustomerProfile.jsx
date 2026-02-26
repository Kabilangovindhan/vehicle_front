import React, { useEffect, useState } from "react";
import { 
    UserCircle, Mail, Phone, ShieldCheck, 
    Edit3, Save, X, Loader2, User, Lock,
    CheckCircle2
} from "lucide-react";

function CustomerProfile() {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const userId = sessionStorage.getItem("userId");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "" // Added password field
    });

    useEffect(() => {
        if (!userId || userId === "undefined") {
            setLoading(false);
            return;
        }
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/CustomerProfile/user/${userId}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setProfile(data);
            setFormData({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                password: "" // Keep empty for security
            });
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Only send password if the user actually typed a new one
            const updatePayload = { ...formData };
            if (!updatePayload.password) delete updatePayload.password;

            const res = await fetch(`http://localhost:5000/api/CustomerProfile/users/${userId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatePayload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setProfile(data);
            setEditMode(false);
            setSuccessMsg(true);
            setFormData(prev => ({ ...prev, password: "" })); // Clear password field
            setTimeout(() => setSuccessMsg(false), 3000);
        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <User className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
            </div>
            <p className="text-slate-500 font-medium tracking-wide">Securing your session...</p>
        </div>
    );

    if (!profile) return (
        <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
            <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
                <X className="text-orange-500 -rotate-12" size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">Session Expired</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">Please log in again.</p>
            <button onClick={() => window.location.href='/'} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg">
                Return to Login
            </button>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-8 font-sans">
            {successMsg && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl animate-bounce">
                    <CheckCircle2 size={20} />
                    <span className="font-bold">Profile updated successfully!</span>
                </div>
            )}

            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-widest mb-2">
                        <ShieldCheck size={16} /> Secure Account
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
                </div>

                <button 
                    onClick={() => setEditMode(true)} 
                    className="group flex items-center gap-2 bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl font-bold text-slate-700 transition-all hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md"
                >
                    <Edit3 size={18} className="group-hover:rotate-12 transition-transform" /> 
                    Edit Profile
                </button>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-10"></div>
                        <div className="relative mx-auto w-32 h-32 mb-6">
                            <div className="w-full h-full bg-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-inner border-4 border-white overflow-hidden">
                                <User size={64} className="text-slate-300" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">{profile.name}</h2>
                        <p className="text-slate-400 font-medium mb-6 italic">{profile.email}</p>
                        <div className="inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest">
                            {profile.role || "Customer"}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-10 space-y-6">
                        <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                            <Phone className="text-indigo-600" />
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase">Phone Number</p>
                                <p className="font-bold text-slate-700">{profile.phone || "Not provided"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Mail className="text-indigo-600" />
                            <div>
                                <p className="text-xs font-black text-slate-400 uppercase">Email Address</p>
                                <p className="font-bold text-slate-700">{profile.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL POP-UP */}
            {editMode && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditMode(false)}></div>

                    <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black text-slate-800">Edit Profile</h3>
                            <button onClick={() => setEditMode(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>

                        <div className="space-y-5">
                            {/* Name Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
                                    <input 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-semibold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Phone Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
                                    <input 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-semibold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
                                    <input 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-semibold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Password (Leave blank to keep current)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={18} />
                                    <input 
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl font-semibold transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setEditMode(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-[2] flex items-center justify-center gap-2 bg-indigo-600 py-4 rounded-2xl font-bold text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                                >
                                    {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerProfile;