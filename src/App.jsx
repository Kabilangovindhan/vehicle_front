// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Layout from "./pages/Layout";
// import Dashboard from "./pages/Dashboard";
// import Customers from "./pages/Customer";
// import Regiter from "./pages/Register";

// function App() {

// 	return (
// 		<Routes>
// 			<Route path="/" element={<Login />} />
// 			<Route path="/layout/*" element={<Layout />}>
// 				<Route path="dashboard" element={<Dashboard />} />
// 				<Route path="customers" element={<Customers />} />
				
// 			</Route>

// 		</Routes>
// 	);
// }

// export default App;




import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer";
import Register from "./pages/Register"; // ✅ fix import name

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* Protected Layout */}
      <Route path="/layout/*" element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
      </Route>
    </Routes>
  );
}

export default App;
