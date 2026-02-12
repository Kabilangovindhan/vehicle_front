// // import React, { useEffect, useState } from "react";

// // export default function UserManagement() {
// // 	const [users, setUsers] = useState([]);
// // 	const [editingId, setEditingId] = useState(null);
// // 	const [showForm, setShowForm] = useState(false);
// // 	const [formData, setFormData] = useState({
// // 		name: "", email: "", phone: "", password: "", role: "customer"
// // 	});

// // 	const fetchUsers = async () => {
// // 		try { 
// // 			const res = await fetch("http://localhost:5000/api/user");
// // 			const data = await res.json();
// // 			setUsers(data);
// // 		} catch (err) {
// // 			console.error("Fetch error:", err);
// // 		}
// // 	};

// // 	useEffect(() => { fetchUsers(); }, []);

// // 	const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

// // 	const toggleForm = (isOpen) => {
// // 		setShowForm(isOpen);
// // 		if (!isOpen) setEditingId(null);
// // 	};

// // 	const handleSubmit = async e => {
// // 		e.preventDefault();
// // 		try {
// // 			const url = editingId ? `http://localhost:5000/api/user/${editingId}` : "http://localhost:5000/api/user";
// // 			await fetch(url, {
// // 				method: editingId ? "PUT" : "POST",
// // 				headers: { "Content-Type": "application/json" },
// // 				body: JSON.stringify(formData)
// // 			});
// // 			toggleForm(false);
// // 			fetchUsers();
// // 		} catch (err) {
// // 			alert("Error processing request");
// // 		}
// // 	};

// // 	const handleEdit = user => {
// // 		setFormData({ ...user });
// // 		setEditingId(user._id);
// // 		setShowForm(true);
// // 		window.scrollTo({ top: 0, behavior: "smooth" });
// // 	};

// // 	return (
// // 		<div style={styles.wrapper}>
// // 			<div style={styles.container}>

// // 				{/* HEADER */}
// // 				<div style={styles.topBar}>
// // 					<h1 style={styles.mainTitle}>Team Members</h1>
// // 					{!showForm && (
// // 						<button onClick={() => { setFormData({ name: "", email: "", phone: "", password: "", role: "customer" }); setShowForm(true); }} style={styles.btnPrimary}>
// // 							Invite Member
// // 						</button>
// // 					)}
// // 				</div>

// // 				{/* INLINE FORM - Professional & Compact */}
// // 				{showForm && (
// // 					<div style={styles.formContainer}>
// // 						<div style={styles.formHeader}>
// // 							<h2 style={styles.formTitle}>{editingId ? "Edit Member" : "New Member"}</h2>
// // 							<button onClick={() => toggleForm(false)} style={styles.btnClose}>✕</button>
// // 						</div>
// // 						<form onSubmit={handleSubmit} style={styles.gridForm}>
// // 							<div style={styles.field}><label style={styles.label}>Name</label>
// // 								<input name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="Full Name" required />
// // 							</div>
// // 							<div style={styles.field}><label style={styles.label}>Email</label>
// // 								<input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="email@company.com" required />
// // 							</div>
// // 							<div style={styles.field}><label style={styles.label}>Phone</label>
// // 								<input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} placeholder="+1..." required />
// // 							</div>
// // 							<div style={styles.field}><label style={styles.label}>Role</label>
// // 								<select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
// // 									<option value="admin">Admin</option>
// // 									<option value="staff">Staff</option>
// // 									<option value="customer">Customer</option>
// // 								</select>
// // 							</div>
// // 							{!editingId && (
// // 								<div style={styles.field}><label style={styles.label}>Password</label>
// // 									<input name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
// // 								</div>
// // 							)}
// // 							<div style={styles.formActions}>
// // 								<button type="submit" style={styles.btnSave}>{editingId ? "Save Changes" : "Create Member"}</button>
// // 							</div>
// // 						</form>
// // 					</div>
// // 				)}

// // 				{/* USER LIST - Clean Table-like Mobile Cards */}
// // 				<div style={styles.list}>
// // 					{users.map(user => (
// // 						<div key={user._id} style={styles.row}>
// // 							<div style={styles.userInfo}>
// // 								<div style={styles.avatar}>{user.name.charAt(0)}</div>
// // 								<div style={styles.userDetails}>
// // 									<span style={styles.userName}>{user.name}</span>
// // 									<span style={styles.userEmail}>{user.email}</span>
// // 								</div>
// // 							</div>
// // 							<div style={styles.roleTag(user.role)}>{user.role}</div>
// // 							<div style={styles.actions}>
// // 								<button onClick={() => handleEdit(user)} style={styles.iconBtn}>Edit</button>
// // 								<button onClick={async () => { if (window.confirm("Delete?")) { await fetch(`http://localhost:5000/api/user/${user._id}`, { method: "DELETE" }); fetchUsers(); } }} style={styles.deleteLink}>Delete</button>
// // 							</div>
// // 						</div>
// // 					))}
// // 				</div>

// // 			</div>
// // 		</div>
// // 	);
// // }

// // const styles = {
// // 	wrapper: { backgroundColor: "#ffffff", minHeight: "100vh", color: "#111827", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
// // 	container: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px" },
// // 	topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
// // 	mainTitle: { fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" },

// // 	btnPrimary: { backgroundColor: "#111827", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500", fontSize: "14px" },

// // 	// FORM
// // 	formContainer: { border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "32px", backgroundColor: "#f9fafb" },
// // 	formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
// // 	formTitle: { fontSize: "16px", fontWeight: "600" },
// // 	btnClose: { background: "none", border: "none", cursor: "pointer", color: "#9ca3af" },
// // 	gridForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" },
// // 	field: { display: "flex", flexDirection: "column", gap: "6px" },
// // 	label: { fontSize: "12px", fontWeight: "500", color: "#6b7280" },
// // 	input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" },
// // 	formActions: { gridColumn: "1 / -1", marginTop: "8px" },
// // 	btnSave: { backgroundColor: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", width: "100%", fontWeight: "500" },

// // 	// LIST
// // 	list: { borderTop: "1px solid #f3f4f6" },
// // 	row: {
// // 		display: "flex", alignItems: "center", justifyContent: "space-between",
// // 		padding: "16px 0", borderBottom: "1px solid #f3f4f6", flexWrap: "wrap", gap: "12px"
// // 	},
// // 	userInfo: { display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" },
// // 	avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "#4b5563" },
// // 	userDetails: { display: "flex", flexDirection: "column" },
// // 	userName: { fontSize: "14px", fontWeight: "500" },
// // 	userEmail: { fontSize: "13px", color: "#6b7280" },

// // 	roleTag: (role) => ({
// // 		fontSize: "12px", fontWeight: "500", padding: "2px 8px", borderRadius: "4px",
// // 		backgroundColor: role === 'admin' ? '#eff6ff' : '#f3f4f6',
// // 		color: role === 'admin' ? '#1e40af' : '#374151',
// // 		textTransform: "capitalize"
// // 	}),

// // 	actions: { display: "flex", gap: "16px" },
// // 	iconBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px", fontWeight: "500", padding: 0 },
// // 	deleteLink: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "500", padding: 0 }
// // };




import React, { useEffect, useState } from "react";
import {
    Phone, Trash2, Edit3, Search, Plus, X,
    User, Loader2, Save, Mail, Settings2
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

            {/* NAVBAR SAME */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm px-4">
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-xl tracking-tight">
                        <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                            <User size={20} />
                        </div>
                        User<span className="text-indigo-600">Admin</span>
                    </div>

                    <button
                        onClick={() => openDrawer()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100 active:scale-95"
                    >
                        <Plus size={18} /> Add New User
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 mt-8">

                {/* SEARCH SAME */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="px-4 py-2 bg-indigo-50 rounded-xl text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                        {users.length} Users Registered
                    </div>
                </div>

                {/* LOADER SAME */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <Loader2 className="animate-spin text-indigo-600" size={32} />
                        <span className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em]">
                            Syncing Database
                        </span>
                    </div>
                ) : (

                    <div className="space-y-6">

                        {/* TABLE SAME STRUCTURE */}
                        <div className="hidden lg:block bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <th className="px-8 py-4">User Identity</th>
                                        <th className="px-8 py-4">Contact Info</th>
                                        <th className="px-8 py-4">Role</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50">
                                    {filteredUsers.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-8 py-5 font-bold">{u.name}</td>

                                            <td className="px-8 py-5 text-xs text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Mail size={12}/> {u.email || "No Email"}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Phone size={12}/> {u.phone}
                                                </div>
                                            </td>

                                            <td className="px-8 py-5">
                                                <RoleBadge role={u.role}/>
                                            </td>

                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => openDrawer(u)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 shadow-sm border border-transparent hover:border-slate-200">
                                                        <Edit3 size={16}/>
                                                    </button>
                                                    <button onClick={() => handleDelete(u._id)} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-red-600 shadow-sm border border-transparent hover:border-slate-200">
                                                        <Trash2 size={16}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                )}
            </div>

            {/* DRAWER SAME */}
            {isDrawerOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)} />
                    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">

                        <div className="p-6 border-b flex justify-between">
                            <h2 className="text-xl font-black">
                                {currentUser ? "Update User" : "Create User"}
                            </h2>
                            <button onClick={() => setIsDrawerOpen(false)}>
                                <X/>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-4 overflow-y-auto">

                            <Input name="name" label="Full Name" defaultValue={currentUser?.name} required/>
                            <Input name="email" label="Email" defaultValue={currentUser?.email}/>
                            <Input name="phone" label="Phone" defaultValue={currentUser?.phone}/>
                            {!currentUser && <Input name="password" label="Password" type="password"/>}
                            <Select name="role" defaultValue={currentUser?.role}/>

                            <button className="bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2">
                                <Save size={18}/> Save User
                            </button>

                        </form>

                    </div>
                </>
            )}
        </div>
    );
}

/* BADGE */
const RoleBadge = ({ role }) => {
    const map = {
        admin: "bg-blue-50 text-blue-700",
        staff: "bg-purple-50 text-purple-700",
        customer: "bg-slate-50 text-slate-600"
    };

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-md ${map[role] || map.customer}`}>
            {role}
        </span>
    );
};

/* INPUT */
const Input = ({label,...props}) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
        <input {...props} className="border px-4 py-3 rounded-xl"/>
    </div>
);

/* SELECT */
const Select = ({name,defaultValue}) => (
    <select name={name} defaultValue={defaultValue} className="border px-4 py-3 rounded-xl">
        <option value="admin">Admin</option>
        <option value="staff">Staff</option>
        <option value="customer">Customer</option>
    </select>
);

export default UserMaster;
