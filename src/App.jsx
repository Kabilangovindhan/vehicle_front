import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";
import Customers from "./pages/admin/Customer";
import VehicleMaster from "./pages/admin/VehicleMaster";

function App() {

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
				<Route path="customers" element={<Customers />} />
				<Route path="vehicle-master" element={<VehicleMaster />} />
			</Route>
		</Routes>
	)
}

export default App;