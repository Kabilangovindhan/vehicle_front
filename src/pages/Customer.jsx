import React, { useState, useMemo } from "react";
import { 
  UserPlus, Search, Mail, Phone, Edit2, Trash2, 
  User, MoreVertical, Filter, X, CheckCircle 
} from "lucide-react";

function Customers() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Kumar", phone: "9876543210", email: "kumar@gmail.com", status: "Active" },
    { id: 2, name: "Suresh", phone: "9123456780", email: "suresh@gmail.com", status: "Pending" },
  ]);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setCustomers(customers.map((c) => (c.id === editId ? { ...c, ...formData } : c)));
      setEditId(null);
    } else {
      setCustomers([...customers, { id: Date.now(), ...formData, status: "Active" }]);
    }
    setFormData({ name: "", phone: "", email: "" });
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditId(customer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Remove this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              Customer <span className="text-blue-600">Hub</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium">Manage your client database and service history.</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
             <CheckCircle size={16} className="text-blue-600"/>
             <span className="text-sm font-bold text-blue-700">{customers.length} Contacts</span>
          </div>
        </div>

        {/* ADAPTIVE FORM CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              {editId ? <Edit2 size={18} className="text-orange-500"/> : <UserPlus size={18} className="text-blue-600"/>}
              {editId ? "Update Profile" : "New Registration"}
            </h2>
            {editId && (
              <button onClick={() => {setEditId(null); setFormData({name:"", phone:"", email:""})}} className="text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                <input
                  type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-200 p-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="submit"
                className={`w-full sm:w-auto px-10 py-3.5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  editId ? "bg-orange-500 shadow-orange-200" : "bg-blue-600 shadow-blue-200"
                }`}
              >
                {editId ? "Apply Changes" : "Register Customer"}
              </button>
            </div>
          </form>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={20}/> <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {/* CUSTOMER LIST - TABLE (Desktop) / CARDS (Mobile) */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Identity</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Contact Details</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="group hover:bg-blue-50/40 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-200">
                          {c.name.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-800 text-base">{c.name}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-700"><Phone size={14} className="text-blue-500"/> {c.phone}</div>
                        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium"><Mail size={14}/> {c.email}</div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          c.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(c)} className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 rounded-xl hover:shadow-md transition-all"><Edit2 size={18}/></button>
                        <button onClick={() => handleDelete(c.id)} className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:text-red-600 rounded-xl hover:shadow-md transition-all"><Trash2 size={18}/></button>
                      </div>
                      <MoreVertical size={20} className="text-slate-300 inline group-hover:hidden"/>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARD VIEW (Hidden on Desktop) */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredCustomers.length === 0 ? (
                <div className="p-10 text-center text-slate-400 font-medium">No customers found.</div>
            ) : (
                filteredCustomers.map((c) => (
                    <div key={c.id} className="p-5 space-y-4 active:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                                    {c.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{c.name}</p>
                                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{c.status}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(c)} className="p-3 bg-slate-100 text-slate-600 rounded-xl"><Edit2 size={18}/></button>
                                <button onClick={() => handleDelete(c.id)} className="p-3 bg-red-50 text-red-600 rounded-xl"><Trash2 size={18}/></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pt-2">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700">
                                <Phone size={16} className="text-blue-500"/> {c.phone}
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-sm font-medium text-slate-500">
                                <Mail size={16} className="text-slate-400"/> {c.email}
                            </div>
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;