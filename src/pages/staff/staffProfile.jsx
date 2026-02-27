import React, { useEffect, useState } from "react";
import { 
    User, Mail, Phone, ShieldCheck,
    Edit3, Save, X, Loader2, Lock, CheckCircle2
} from "lucide-react";

function StaffProfile() {

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);

    const staffId = sessionStorage.getItem("userId");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    useEffect(() => {
        if (!staffId) {
            setLoading(false);
            return;
        }
        fetchProfile();
    }, [staffId]);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/StaffProfile/staff/${staffId}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            setProfile(data);
            setFormData({
                name: data.name || "",
                email: data.email || "",
                phone: data.phone || "",
                password: ""
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            const payload = { ...formData };
            if (!payload.password) delete payload.password;

            const res = await fetch(`http://localhost:5000/api/StaffProfile/staff/${staffId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setProfile(data);
            setEditMode(false);
            setSuccessMsg(true);
            setFormData(prev => ({ ...prev, password: "" }));

            setTimeout(() => setSuccessMsg(false), 3000);

        } catch (err) {
            alert(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!profile) return <div className="text-center mt-20">Staff not found</div>;

    return (
        <div className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-lg">

            {successMsg && (
                <div className="mb-6 bg-green-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Profile Updated Successfully
                </div>
            )}

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Staff Profile</h1>
                    <p className="text-gray-500">Manage your account settings</p>
                </div>

                <button 
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl"
                >
                    <Edit3 size={18}/> Edit
                </button>
            </div>

            <div className="space-y-4">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>Role:</strong> {profile.role}</p>
            </div>

            {/* EDIT SECTION */}
            {editMode && (
                <div className="mt-10 space-y-4">

                    <input 
                        value={formData.name}
                        onChange={(e)=>setFormData({...formData,name:e.target.value})}
                        className="w-full border p-3 rounded-xl"
                        placeholder="Name"
                    />

                    <input 
                        value={formData.email}
                        onChange={(e)=>setFormData({...formData,email:e.target.value})}
                        className="w-full border p-3 rounded-xl"
                        placeholder="Email"
                    />

                    <input 
                        value={formData.phone}
                        onChange={(e)=>setFormData({...formData,phone:e.target.value})}
                        className="w-full border p-3 rounded-xl"
                        placeholder="Phone"
                    />

                    <input 
                        type="password"
                        value={formData.password}
                        onChange={(e)=>setFormData({...formData,password:e.target.value})}
                        className="w-full border p-3 rounded-xl"
                        placeholder="New Password"
                    />

                    <div className="flex gap-3">
                        <button 
                            onClick={()=>setEditMode(false)}
                            className="flex-1 bg-gray-200 py-3 rounded-xl"
                        >
                            Cancel
                        </button>

                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-xl"
                        >
                            {saving ? <Loader2 className="animate-spin mx-auto"/> : "Save"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StaffProfile;