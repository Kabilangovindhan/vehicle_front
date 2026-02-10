import React, { useEffect, useState } from "react";

export default function UserManagement() {
	const [users, setUsers] = useState([]);
	const [editingId, setEditingId] = useState(null);
	const [showForm, setShowForm] = useState(false);
	const [formData, setFormData] = useState({
		name: "", email: "", phone: "", password: "", role: "customer"
	});

	const fetchUsers = async () => {
		try { 
			const res = await fetch("http://localhost:5000/api/user");
			const data = await res.json();
			setUsers(data);
		} catch (err) {
			console.error("Fetch error:", err);
		}
	};

	useEffect(() => { fetchUsers(); }, []);

	const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

	const toggleForm = (isOpen) => {
		setShowForm(isOpen);
		if (!isOpen) setEditingId(null);
	};

	const handleSubmit = async e => {
		e.preventDefault();
		try {
			const url = editingId ? `http://localhost:5000/api/user/${editingId}` : "http://localhost:5000/api/user";
			await fetch(url, {
				method: editingId ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData)
			});
			toggleForm(false);
			fetchUsers();
		} catch (err) {
			alert("Error processing request");
		}
	};

	const handleEdit = user => {
		setFormData({ ...user });
		setEditingId(user._id);
		setShowForm(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div style={styles.wrapper}>
			<div style={styles.container}>

				{/* HEADER */}
				<div style={styles.topBar}>
					<h1 style={styles.mainTitle}>Team Members</h1>
					{!showForm && (
						<button onClick={() => { setFormData({ name: "", email: "", phone: "", password: "", role: "customer" }); setShowForm(true); }} style={styles.btnPrimary}>
							Invite Member
						</button>
					)}
				</div>

				{/* INLINE FORM - Professional & Compact */}
				{showForm && (
					<div style={styles.formContainer}>
						<div style={styles.formHeader}>
							<h2 style={styles.formTitle}>{editingId ? "Edit Member" : "New Member"}</h2>
							<button onClick={() => toggleForm(false)} style={styles.btnClose}>✕</button>
						</div>
						<form onSubmit={handleSubmit} style={styles.gridForm}>
							<div style={styles.field}><label style={styles.label}>Name</label>
								<input name="name" value={formData.name} onChange={handleChange} style={styles.input} placeholder="Full Name" required />
							</div>
							<div style={styles.field}><label style={styles.label}>Email</label>
								<input name="email" type="email" value={formData.email} onChange={handleChange} style={styles.input} placeholder="email@company.com" required />
							</div>
							<div style={styles.field}><label style={styles.label}>Phone</label>
								<input name="phone" value={formData.phone} onChange={handleChange} style={styles.input} placeholder="+1..." required />
							</div>
							<div style={styles.field}><label style={styles.label}>Role</label>
								<select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
									<option value="admin">Admin</option>
									<option value="staff">Staff</option>
									<option value="customer">Customer</option>
								</select>
							</div>
							{!editingId && (
								<div style={styles.field}><label style={styles.label}>Password</label>
									<input name="password" type="password" value={formData.password} onChange={handleChange} style={styles.input} placeholder="••••••••" required />
								</div>
							)}
							<div style={styles.formActions}>
								<button type="submit" style={styles.btnSave}>{editingId ? "Save Changes" : "Create Member"}</button>
							</div>
						</form>
					</div>
				)}

				{/* USER LIST - Clean Table-like Mobile Cards */}
				<div style={styles.list}>
					{users.map(user => (
						<div key={user._id} style={styles.row}>
							<div style={styles.userInfo}>
								<div style={styles.avatar}>{user.name.charAt(0)}</div>
								<div style={styles.userDetails}>
									<span style={styles.userName}>{user.name}</span>
									<span style={styles.userEmail}>{user.email}</span>
								</div>
							</div>
							<div style={styles.roleTag(user.role)}>{user.role}</div>
							<div style={styles.actions}>
								<button onClick={() => handleEdit(user)} style={styles.iconBtn}>Edit</button>
								<button onClick={async () => { if (window.confirm("Delete?")) { await fetch(`http://localhost:5000/api/user/${user._id}`, { method: "DELETE" }); fetchUsers(); } }} style={styles.deleteLink}>Delete</button>
							</div>
						</div>
					))}
				</div>

			</div>
		</div>
	);
}

const styles = {
	wrapper: { backgroundColor: "#ffffff", minHeight: "100vh", color: "#111827", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
	container: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px" },
	topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
	mainTitle: { fontSize: "24px", fontWeight: "600", letterSpacing: "-0.02em" },

	btnPrimary: { backgroundColor: "#111827", color: "#fff", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500", fontSize: "14px" },

	// FORM
	formContainer: { border: "1px solid #e5e7eb", borderRadius: "8px", padding: "20px", marginBottom: "32px", backgroundColor: "#f9fafb" },
	formHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
	formTitle: { fontSize: "16px", fontWeight: "600" },
	btnClose: { background: "none", border: "none", cursor: "pointer", color: "#9ca3af" },
	gridForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" },
	field: { display: "flex", flexDirection: "column", gap: "6px" },
	label: { fontSize: "12px", fontWeight: "500", color: "#6b7280" },
	input: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" },
	formActions: { gridColumn: "1 / -1", marginTop: "8px" },
	btnSave: { backgroundColor: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", width: "100%", fontWeight: "500" },

	// LIST
	list: { borderTop: "1px solid #f3f4f6" },
	row: {
		display: "flex", alignItems: "center", justifyContent: "space-between",
		padding: "16px 0", borderBottom: "1px solid #f3f4f6", flexWrap: "wrap", gap: "12px"
	},
	userInfo: { display: "flex", alignItems: "center", gap: "12px", minWidth: "200px" },
	avatar: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "600", color: "#4b5563" },
	userDetails: { display: "flex", flexDirection: "column" },
	userName: { fontSize: "14px", fontWeight: "500" },
	userEmail: { fontSize: "13px", color: "#6b7280" },

	roleTag: (role) => ({
		fontSize: "12px", fontWeight: "500", padding: "2px 8px", borderRadius: "4px",
		backgroundColor: role === 'admin' ? '#eff6ff' : '#f3f4f6',
		color: role === 'admin' ? '#1e40af' : '#374151',
		textTransform: "capitalize"
	}),

	actions: { display: "flex", gap: "16px" },
	iconBtn: { background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontSize: "13px", fontWeight: "500", padding: 0 },
	deleteLink: { background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: "13px", fontWeight: "500", padding: 0 }
};
