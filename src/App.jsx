// // import React from "react";
// // import { Routes, Route } from "react-router-dom";
// // import Login from "./pages/Login";
// // import Layout from "./pages/Layout";
// // import Dashboard from "./pages/Dashboard";
// // import Customers from "./pages/Customer";
// // import Regiter from "./pages/Register";

// // function App() {

// // 	return (
// // 		<Routes>
// // 			<Route path="/" element={<Login />} />
// // 			<Route path="/layout/*" element={<Layout />}>
// // 				<Route path="dashboard" element={<Dashboard />} />
// // 				<Route path="customers" element={<Customers />} />
				
// // 			</Route>

// // 		</Routes>
// // 	);
// // }

// // export default App;




// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Layout from "./pages/Layout";
// import Dashboard from "./pages/Dashboard";
// import Customers from "./pages/Customer";
// import Register from "./pages/Register"; // ✅ fix import name
// import Vehicle from "./pages/VehicleDetails"; // ✅ import VehicleDetails
// import Booking from "./pages/Payment"; // ✅ import Booking
// import UserAdmin from "./pages/UserAdmin"; // ✅ import UserAdmin
// import ServiceUpdate from "./pages/ServiceUpdate";

// function App() {
//   return (
//     <Routes>
//       {/* Login */}
//       <Route path="/" element={<Login />} />

//       {/* Register */}
//       <Route path="/register" element={<Register />} />

//       {/* Protected Layout */}
//       <Route path="/layout/*" element={<Layout />}>
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="customers" element={<Customers />} />
//         <Route path="vehicleDetails" element={<Vehicle />} />
//         <Route path="payment" element={<Booking />} />
// 		<Route path="users" element={<UserAdmin />} />
// 		<Route path="service-update" element={<ServiceUpdate />} />
//       </Route>
//     </Routes>
//   );
// }

// export default App;



import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./pages/Layout";

import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer";
import Vehicle from "./pages/VehicleDetails";
import Booking from "./pages/Payment";
import UserAdmin from "./pages/UserAdmin";
import ServiceRepairUpdate from "./pages/ServiceUpdate";
import Reports from "./pages/Reports";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Layout */}
      <Route path="/layout" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="vehicleDetails" element={<Vehicle />} />
        <Route path="payment" element={<Booking />} />
        <Route path="users" element={<UserAdmin />} />
		<Route path="service-update" element={<ServiceRepairUpdate />} />
		<Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

export default App;

