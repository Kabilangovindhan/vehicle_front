import React, { useState } from "react";

function Customers() {
  const [customers, setCustomers] = useState([
    { id: 1, name: "Kumar", phone: "9876543210", email: "kumar@gmail.com" },
    { id: 2, name: "Suresh", phone: "9123456780", email: "suresh@gmail.com" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [editId, setEditId] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add or Update customer
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      // Update
      setCustomers(
        customers.map((c) =>
          c.id === editId ? { ...c, ...formData } : c
        )
      );
      setEditId(null);
    } else {
      // Add
      setCustomers([
        ...customers,
        { id: Date.now(), ...formData },
      ]);
    }

    setFormData({ name: "", phone: "", email: "" });
  };

  // Edit customer
  const handleEdit = (customer) => {
    setFormData(customer);
    setEditId(customer.id);
  };

  // Delete customer
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      setCustomers(customers.filter((c) => c.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow mb-6 max-w-xl"
      >
        <h2 className="font-semibold mb-3">
          {editId ? "Edit Customer" : "Add Customer"}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editId ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-slate-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.name}</td>
                  <td className="p-3">{c.phone}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
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
