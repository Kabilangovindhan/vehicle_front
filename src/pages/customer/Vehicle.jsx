import React, { useEffect, useState } from "react";
import {
    Phone, Trash2, Edit3, Search, Plus, X,
    Car, User, Settings2, Loader2, Save,
    Fingerprint, Calendar, Activity, Mail
} from "lucide-react";

function Vehicle() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/vehicle");
            const data = await res.json();
            setUsers(data);
        } catch (err) { console.error("Fetch error:", err); }
        finally { setLoading(false); }
    };

    const handleSave = async (e) => {

        e.preventDefault();

        const formData = new FormData(e.target);

        const payload = {
            ownerName: formData.get("ownerName"),
            ownerPhone: formData.get("ownerPhone"),
            ownerEmail: formData.get("ownerEmail"),
            vehicleNumber: formData.get("vehicleNumber"),
            brand: formData.get("brand"),
            model: formData.get("model"),
            variant: formData.get("variant"),
            fuelType: formData.get("fuelType"),
            transmission: formData.get("transmission"),
            chassisNumber: formData.get("chassisNumber"),
            engineNumber: formData.get("engineNumber"),
            color: formData.get("color"),
            year: formData.get("year"),
            lastServiceDate: formData.get("lastServiceDate"),
        };

        try {

            let res;

            if (currentUser) {
                res = await fetch(`http://localhost:5000/api/vehicle/${currentUser._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(`http://localhost:5000/api/vehicle`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (res.ok) {
                fetchUsers();
                setIsDrawerOpen(false);
            }

        } catch (err) {alert("Save failed")}
    };

    const handleDelete = async (id) => {

        if (!window.confirm("Permanently delete this vehicle record?")) return;

        try {
            const res = await fetch(`http://localhost:5000/api/vehicle/${id}`, { method: "DELETE"});
            if (res.ok) setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const openDrawer = (user = null) => {
        setCurrentUser(user);
        setIsDrawerOpen(true);
    };

    const filteredUsers = users.filter(u =>
        u.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12">
            {/* --- NAV BAR --- */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><Car size={20} /></div>
                        Vehicle<span className="text-indigo-600">Details</span>
                    </div>
                    <button onClick={() => openDrawer()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                        <Plus size={18} /> Add New Vehicle
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
                            placeholder="Search plate, owner, or brand..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {users.length} Assets Tracked
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
                                        <th className="px-8 py-4">Owner & Contact</th>
                                        <th className="px-8 py-4">Vehicle Identity</th>
                                        <th className="px-8 py-4">Specs & Identification</th>
                                        <th className="px-8 py-4">Maintenance</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-slate-900">{u.ownerName}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone size={12} /> {u.ownerPhone}</div>
                                                <div className="text-xs text-slate-400 flex items-center gap-1"><Mail size={12} /> {u.ownerEmail || 'No Email'}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="bg-slate-900 text-white px-2 py-1 rounded text-[12px] font-mono font-bold tracking-wider">{u.vehicleNumber}</span>
                                                <div className="text-[11px] font-bold text-indigo-600 mt-1 uppercase">{u.brand} {u.model} <span className="text-slate-400">({u.variant || 'Base'})</span></div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex gap-1 mb-2">
                                                    <Badge text={u.fuelType} color="emerald" />
                                                    <Badge text={u.transmission} color="purple" />
                                                    <Badge text={u.year} color="blue" />
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium">Chassis: {u.chassisNumber || 'N/A'}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-[11px] font-bold text-slate-600">Last Service:</div>
                                                <div className="text-xs text-slate-400 italic">{u.lastServiceDate ? new Date(u.lastServiceDate).toLocaleDateString() : 'Pending Data'}</div>
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
                                        <span className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-widest">{u.vehicleNumber}</span>
                                        <div className="flex gap-1">
                                            <button onClick={() => openDrawer(u)} className="p-2 text-slate-400"><Edit3 size={18} /></button>
                                            <button onClick={() => handleDelete(u._id)} className="p-2 text-slate-400"><Trash2 size={18} /></button>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg">{u.ownerName}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{u.brand} {u.model} • {u.year}</p>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase">Fuel</p>
                                            <p className="text-xs font-bold">{u.fuelType}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase">Last Service</p>
                                            <p className="text-xs font-bold">{u.lastServiceDate ? new Date(u.lastServiceDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* --- ALL-FIELDS SLIDE-OVER DRAWER --- */}
            {isDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsDrawerOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                            <div>
                                <h2 className="text-xl font-black tracking-tight">{currentUser ? "Update Asset" : "Register New Asset"}</h2>
                                <p className="text-xs text-slate-400 font-medium">{currentUser ? `Editing ID: ${currentUser._id}` : 'Complete all mandatory fields'}</p>
                            </div>
                            <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors border border-slate-100"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 overflow-y-auto flex-1 space-y-8 bg-white">
                            {/* OWNER SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<User size={16} />} title="Owner Information" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input name="ownerName" label="Full Name" defaultValue={currentUser?.ownerName} required />
                                    <Input name="ownerPhone" label="Phone Number" defaultValue={currentUser?.ownerPhone} required />
                                    <div className="md:col-span-2">
                                        <Input name="ownerEmail" label="Email Address" type="email" defaultValue={currentUser?.ownerEmail} />
                                    </div>
                                </div>
                            </div>

                            {/* VEHICLE CORE SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Car size={16} />} title="Vehicle Specification" />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <Input name="vehicleNumber" label="License Plate" defaultValue={currentUser?.vehicleNumber} required />
                                    </div>
                                    <Input name="brand" label="Brand" defaultValue={currentUser?.brand} required />
                                    <Input name="model" label="Model" defaultValue={currentUser?.model} required />
                                    <Input name="variant" label="Variant" placeholder="e.g. VXI / Luxury" defaultValue={currentUser?.variant} />
                                    <Select label="Fuel Type" options={["Petrol", "Diesel", "Electric", "Hybrid"]} defaultValue={currentUser?.fuelType} />
                                    <Select label="Transmission" options={["Manual", "Automatic"]} defaultValue={currentUser?.transmission} />
                                </div>
                            </div>

                            {/* IDENTIFICATION SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Fingerprint size={16} />} title="Identification & Aesthetics" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="chassisNumber" label="Chassis Number" defaultValue={currentUser?.chassisNumber} />
                                    <Input name="engineNumber" label="Engine Number" defaultValue={currentUser?.engineNumber} />
                                    <Input name="color" label="Body Color" defaultValue={currentUser?.color} />
                                    <Input name="year" label="Manufacturing Year" type="number" defaultValue={currentUser?.year} />
                                </div>
                            </div>

                            {/* SERVICE SECTION */}
                            <div className="space-y-4">
                                <SectionTitle icon={<Activity size={16} />} title="Maintenance History" />
                                <div className="grid grid-cols-1">
                                    <Input name="lastServiceDate" label="Last Service Date" type="date" defaultValue={currentUser?.lastServiceDate ? new Date(currentUser.lastServiceDate).toISOString().split('T')[0] : ''} />
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                                <button onClick={() => setIsDrawerOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
                                <button type="submit" className="flex-[2] bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                                    <Save size={18} /> {currentUser ? "Save Changes" : "Create Record"}
                                </button>
                            </div>
                        </form>


                    </div>
                </>
            )}
        </div>
    );
}


const Badge = ({ text, color }) => {
    const themes = {
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        blue: "bg-blue-50 text-blue-700 ring-blue-100",
        purple: "bg-purple-50 text-purple-700 ring-purple-100",
        slate: "bg-slate-50 text-slate-600 ring-slate-100"
    };
    return text ? (
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight ring-1 ${themes[color] || themes.slate}`}>
            {text}
        </span>
    ) : null;
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

const Select = ({ label, options, defaultValue }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">{label}</label>
        <select defaultValue={defaultValue} className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm font-semibold appearance-none shadow-sm cursor-pointer">
            <option value="">N/A</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default Vehicle;