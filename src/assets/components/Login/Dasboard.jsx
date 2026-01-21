import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Car, Calendar, CreditCard, BarChart3, MessageSquare, 
  Settings, ClipboardList, LayoutDashboard, LogOut, Menu, X 
} from "lucide-react";

function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const modules = [
    { title: "User & Admin", desc: "Access control & roles", icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-purple-500" },
    { title: "Customers", desc: "CRM & Contact details", icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-blue-500" },
    { title: "Vehicles", desc: "Fleet & Ownership logs", icon: <Car className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-emerald-500" },
    { title: "Service Booking", desc: "Live appointment slots", icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-orange-500" },
    { title: "Billing & Invoice", desc: "Payments & Tax records", icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-pink-500" },
    { title: "Reports", desc: "Revenue & Performance", icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-indigo-500" },
    { title: "User Feedback", desc: "Client satisfaction logs", icon: <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-cyan-500" },
    { title: "Staff Feedback", desc: "Mechanic performance", icon: <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />, color: "bg-slate-500" }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      
      {/* 1. Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* 2. Sidebar (Mobile & Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white p-6 transition-transform duration-300 transform
        lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">AutoFleet</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 p-3 bg-blue-600 rounded-xl text-white text-sm font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </a>
          <div className="pt-4 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Management</div>
          {modules.slice(0, 5).map((m, i) => (
            <a key={i} href="#" className="flex items-center gap-3 p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-sm">
              {m.icon} <span>{m.title}</span>
            </a>
          ))}
        </nav>

        <button className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 rounded-xl mt-6">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 flex justify-between items-center px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold text-slate-800 lg:hidden">AutoFleet</h1>
            <div className="hidden lg:block text-xs sm:text-sm text-slate-500">
              Welcome back, <span className="font-bold text-slate-800">Admin Portal</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900">John Doe</p>
              <p className="text-[10px] text-slate-500 italic">System Manager</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
               <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="avatar" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
          <header className="mb-6 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">System Modules</h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Efficiently manage every aspect of your vehicle service business.</p>
          </header>

          {/* Grid Layout: Responsive columns */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {modules.map((m, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 transition-all cursor-pointer flex flex-col h-full"
              >
                <div className={`${m.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-inherit/20 flex-shrink-0`}>
                  {m.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-6 leading-relaxed flex-1">
                  {m.desc}
                </p>
                <div className="flex items-center text-blue-600 font-bold text-[10px] sm:text-xs uppercase tracking-widest mt-auto">
                  Manage Now
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;






// import React, { useState } from "react";
// import { 
//   Users, Car, Calendar, CreditCard, BarChart3, 
//   Settings, LayoutDashboard, LogOut, Menu, X 
// } from "lucide-react";

// function Dashboard() {
//   const [isOpen, setIsOpen] = useState(false);

//   const modules = [
//     { title: "Admin", icon: <Settings />, color: "bg-purple-600" },
//     { title: "Customers", icon: <Users />, color: "bg-blue-600" },
//     { title: "Vehicles", icon: <Car />, color: "bg-emerald-600" },
//     { title: "Service", icon: <Calendar />, color: "bg-orange-600" },
//     { title: "Billing", icon: <CreditCard />, color: "bg-pink-600" },
//     { title: "Reports", icon: <BarChart3 />, color: "bg-indigo-600" },
//   ];

//   return (
//     <div className="flex h-screen bg-gray-50 overflow-hidden">
//       {/* 1. SIDEBAR */}
//       <div className={`
//         fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300
//         lg:relative lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}
//       `}>
//         <div className="p-6 text-xl font-bold flex justify-between items-center border-b border-slate-800">
//           <span>AutoFleet</span>
//           <button onClick={() => setIsOpen(false)} className="lg:hidden"><X /></button>
//         </div>
//         <nav className="p-4 space-y-2">
//           <a href="#" className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg"><LayoutDashboard size={20}/> Dashboard</a>
//           {modules.map((m, i) => (
//             <a key={i} href="#" className="flex items-center gap-3 p-3 text-gray-400 hover:bg-slate-800 rounded-lg transition">
//               {React.cloneElement(m.icon, { size: 20 })} {m.title}
//             </a>
//           ))}
//           <button className="flex items-center gap-3 p-3 text-red-400 w-full mt-10 hover:bg-red-900/20 rounded-lg">
//             <LogOut size={20}/> Logout
//           </button>
//         </nav>
//       </div>

//       {/* 2. MAIN CONTENT */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header */}
//         <header className="bg-white shadow-sm p-4 flex justify-between items-center px-6">
//           <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 bg-gray-100 rounded"><Menu /></button>
//           <h2 className="font-bold text-gray-700">Vehicle Management Portal</h2>
//           <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">AD</div>
//         </header>

//         {/* Content Area */}
//         <main className="p-4 sm:p-8 overflow-y-auto">
//           <div className="max-w-6xl mx-auto">
//             <h1 className="text-2xl font-bold mb-6">Welcome, Administrator</h1>
            
//             {/* Simple Responsive Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//               {modules.map((m, i) => (
//                 <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group">
//                   <div className={`${m.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
//                     {m.icon}
//                   </div>
//                   <h3 className="font-bold text-gray-800 group-hover:text-blue-600">{m.title}</h3>
//                   <p className="text-sm text-gray-500 mt-1">Manage all {m.title.toLowerCase()} data.</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;