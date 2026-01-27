import React, { useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Kumar", phone: "9876543210", email: "kumar@gmail.com" },
    { id: 2, name: "Suresh", phone: "9123456780", email: "suresh@gmail.com" },
  ]);

  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      setCustomers(customers.map((c) => (c.id === editId ? { ...c, ...formData } : c)));
      setEditId(null);
    } else {
      setCustomers([...customers, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: "", phone: "", email: "" });
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditId(customer.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Better UX for mobile
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">Customer Management</h1>

      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8"
      >
        <h2 className="font-semibold text-lg mb-4 text-slate-700">
          {editId ? "📝 Edit Customer" : "➕ Add New Customer"}
        </h2>

        {/* Responsive Grid: 1 col on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className={`w-full md:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition-colors ${
                editId ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {editId ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </div>
      </form>

      {/* TABLE / LIST SECTION */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Desktop Table Header (Hidden on Mobile) */}
        <table className="w-full border-collapse">
          <thead className="bg-slate-50 hidden md:table-header-group">
            <tr className="text-slate-600 uppercase text-xs font-bold tracking-wider">
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Contact Info</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-10 text-center text-slate-400">
                  No customers found. Start by adding one above.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="flex flex-col md:table-row p-4 md:p-0 hover:bg-slate-50 transition-colors">
                  {/* Name Column */}
                  <td className="md:p-4 text-slate-900 font-medium md:font-normal">
                    <span className="block md:hidden text-xs text-slate-400 uppercase font-bold mb-1">Name</span>
                    {c.name}
                  </td>
                  
                  {/* Contact Column */}
                  <td className="md:p-4 mt-2 md:mt-0">
                    <span className="block md:hidden text-xs text-slate-400 uppercase font-bold mb-1">Contact</span>
                    <div className="flex flex-col text-sm text-slate-600">
                      <span>{c.phone}</span>
                      <span className="text-slate-400">{c.email}</span>
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="md:p-4 mt-4 md:mt-0 md:text-right flex md:table-cell gap-2 justify-end">
                    <button
                      onClick={() => handleEdit(c)}
                      className="flex-1 md:flex-none px-4 py-2 bg-slate-100 text-slate-700 md:bg-transparent md:text-yellow-600 hover:bg-yellow-50 rounded-lg font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;