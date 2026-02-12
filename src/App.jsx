import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer";
import Vehicle from "./pages/VehicleDetails";
import Booking from "./pages/Payment";
import ServiceRepairUpdate from "./pages/ServiceUpdate";
import Reports from "./pages/Reports";
import VehicleMaster from "./pages/VehicleMaster";

function App() {

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="customers" element={<Customers />} />
				<Route path="vechicleMaster" element={<VehicleMaster />} />
				<Route path="payment" element={<Booking />} />
				<Route path="service-update" element={<ServiceRepairUpdate />} />
				<Route path="reports" element={<Reports />} />

			</Route>
		</Routes>
	)
}

export default App;