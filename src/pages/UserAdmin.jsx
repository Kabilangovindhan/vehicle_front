// // import React, { useState } from "react";

// // function CreateUser() {
// //   const [user, setUser] = useState({
// //     name: "",
// //     email: "",
// //     password: ""
// //   });

// //   const handleChange = (e) => {
// //     setUser({ ...user, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     alert("User created successfully");
// //   };

// //   return (
// //     <div className="p-6 max-w-md mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">
// //         Create User
// //       </h2>

// //       <form onSubmit={handleSubmit} className="space-y-3">
// //         <input
// //           name="name"
// //           placeholder="User Name"
// //           className="w-full p-2 border rounded"
// //           onChange={handleChange}
// //           required
// //         />

// //         <input
// //           name="email"
// //           placeholder="User Email"
// //           className="w-full p-2 border rounded"
// //           onChange={handleChange}
// //           required
// //         />

// //         <input
// //           name="password"
// //           placeholder="Password"
// //           className="w-full p-2 border rounded"
// //           onChange={handleChange}
// //           required
// //         />

// //         <button className="bg-green-600 text-white px-4 py-2 rounded">
// //           Create User
// //         </button>
// //       </form>
// //     </div>
// //   );
// // }

// // export default CreateUser;




// import React from "react";

// function UsersList() {
//   const users = [
//     { id: 1, name: "Admin", email: "admin@gmail.com", role: "Admin" },
//     { id: 2, name: "Staff", email: "staff@gmail.com", role: "User" }
//   ];

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">
//         Users Management
//       </h2>

//       <table className="w-full border">
//         <thead className="bg-gray-200">
//           <tr>
//             <th className="border p-2">Name</th>
//             <th className="border p-2">Email</th>
//             <th className="border p-2">Role</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((u) => (
//             <tr key={u.id}>
//               <td className="border p-2">{u.name}</td>
//               <td className="border p-2">{u.email}</td>
//               <td className="border p-2">{u.role}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default UsersList;





import React from "react";
import { UserCog, Mail, ShieldCheck, MoreVertical, UserPlus, Search } from "lucide-react";

function UsersList() {
  const users = [
    { id: 1, name: "Admin User", email: "admin@gmail.com", role: "Admin", status: "Active" },
    { id: 2, name: "Staff Member", email: "staff@gmail.com", role: "Staff", status: "Inactive" },
    { id: 3, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Manage permissions and monitor user activity.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200 active:scale-95">
            <UserPlus size={18} />
            Add New User
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold uppercase tracking-wider px-4 py-2 text-slate-600 outline-none">
              <option>All Roles</option>
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
        </div>

        {/* RESPONSIVE TABLE CONTAINER */}
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">Role</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold border-2 border-white shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                          <div className="text-slate-500 text-xs flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck size={14} className={u.role === 'Admin' ? 'text-blue-500' : 'text-slate-400'} />
                        <span className={`text-xs font-bold ${u.role === 'Admin' ? 'text-slate-900' : 'text-slate-600'}`}>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        u.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-500'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 hover:text-slate-900">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* MOBILE FOOTER INFO */}
          <div className="md:hidden p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Scroll horizontally to view roles & status
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;