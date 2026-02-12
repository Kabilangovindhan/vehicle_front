import React, { useEffect, useState } from "react";
import {
    Phone, Trash2, Edit3, Search, Plus, X,
    User, Loader2, Save, Mail, Shield, 
    Fingerprint, Lock
} from "lucide-react";

function UserMaster() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/user");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            password: formData.get("password"),
            role: formData.get("role"),
        };

        try {
            let res;
            if (currentUser) {
                res = await fetch(`http://localhost:5000/api/user/${currentUser._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`http://localhost:5000/api/user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                fetchUsers();
                setIsDrawerOpen(false);
            }
        } catch {
            alert("Save failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete user permanently?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/user/${id}`, { method: "DELETE" });
            if (res.ok) setUsers(users.filter(u => u._id !== id));
        } catch {
            alert("Delete failed");
        }
    };

    const openDrawer = (user = null) => {
        setCurrentUser(user);
        setIsDrawerOpen(true);
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12">
            {/* --- NAV BAR --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><User size={20} /></div>
                        user<span className="text-indigo-600">Admin</span>
                    </div>
                    <button onClick={() => openDrawer()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                        <Plus size={18} /> Add New User
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 mt-8">
                {/* --- SEARCH & COUNTER --- */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {users.length} Users Registered
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">Syncing Database</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* --- DESKTOP TABLE --- */}
                        <div className="hidden lg:block bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <th className="px-8 py-4">User Identity</th>
                                        <th className="px-8 py-4">Contact Details</th>
                                        <th className="px-8 py-4">Security Role</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-slate-900">{u.name}</div>
                                                <div className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-tighter">UID: {u._id.slice(-8)}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-1"><Mail size={12} className="text-slate-400" /> {u.email || 'No Email'}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1.5"><Phone size={12} className="text-slate-400" /> {u.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <RoleBadge role={u.role} />
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openDrawer(u)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200 transition-all"><Edit3 size={16} /></button>
                                                    <button onClick={() => handleDelete(u._id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 shadow-sm border border-transparent hover:border-slate-200 transition-all"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- MOBILE VIEW --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                            {filteredUsers.map(u => (
                                <div key={u._id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                    <div className="flex justify-between items-start mb-4">
                                        <RoleBadge role={u.role} />
                                        <div className="flex gap-1">
                                            <button onClick={() => openDrawer(u)} className="p-2 text-slate-400"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(u._id)} className="p-2 text-slate-400"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg">{u.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-2"><Mail size={14}/> {u.email}</p>
                                    <div className="pt-4 border-t border-slate-50">
                                        <p className="text-[10px] font-black text-slate-300 uppercase">Contact</p>
                                        <p className="text-xs font-bold">{u.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- SLIDE-OVER DRAWER --- */}
            {isDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                            <div>
                                <h2 className="text-xl font-black tracking-tight">{currentUser ? "Update User Profile" : "Create New Account"}</h2>
                                <p className="text-xs text-slate-400 font-medium">{currentUser ? `Editing User: ${currentUser.name}` : 'Setup access for a new member'}</p>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-100"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 overflow-y-auto flex-1 space-y-8 bg-white">
                            {/* IDENTITY SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Fingerprint size={16} />} title="Personal Identity" />
                                <div className="grid grid-cols-1 gap-4">
                                    <Input name="name" label="Full Name" defaultValue={currentUser?.name} required placeholder="John Doe" />
                                </div>
                            </div>

                            {/* CONTACT SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Phone size={16} />} title="Contact Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input name="email" label="Email Address" type="email" defaultValue={currentUser?.email} required placeholder="john@example.com" />
                                    <Input name="phone" label="Phone Number" defaultValue={currentUser?.phone} placeholder="+1 234..." />
                                </div>
                            </div>

                            {/* ACCESS SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Shield size={16} />} title="Access & Security" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select name="role" label="Access Role" options={["admin", "staff", "customer"]} defaultValue={currentUser?.role} />
                                    {!currentUser && (
                                        <Input name="password" label="Initial Password" type="password" required placeholder="••••••••" />
                                    )}
                                </div>
                            </div>

                            {/* FOOTER ACTIONS */}
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                                <button type="button" onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" className="flex-[2] bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                                    <Save size={18} /> {currentUser ? "Update User" : "Create Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

// --- SHARED UI COMPONENTS ---

const RoleBadge = ({ role }) => {
    const themes = {
        admin: "bg-blue-50 text-blue-700 ring-blue-100",
        staff: "bg-purple-50 text-purple-700 ring-purple-100",
        customer: "bg-slate-50 text-slate-600 ring-slate-100"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ring-1 inline-flex items-center gap-1.5 ${themes[role] || themes.customer}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-blue-400' : role === 'staff' ? 'bg-purple-400' : 'bg-slate-400'}`}></span>
            {role || 'customer'}
        </span>
    );
};

const SectionTitle = ({ icon, title }) => (
    <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-50 pb-2">
        {icon} <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
    </div>
);

const Input = ({ label, ...props }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{label} {props.required && <span className="text-red-400">*</span>}</label>
        <input {...props} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-semibold placeholder:text-slate-300 shadow-sm" />
    </div>
);

const Select = ({ label, options, name, defaultValue }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{label}</label>
        <select name={name} defaultValue={defaultValue} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-semibold appearance-none shadow-sm cursor-pointer capitalize">
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default UserMaster;