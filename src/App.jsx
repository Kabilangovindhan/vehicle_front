import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";
import Customers from "./pages/admin/Customer";
import Vehicle from "./pages/customer/Vehicle";
import Booking from "./pages/customer/booking";
import ServiceTracking from "./pages/customer/servicetracking";



function App() {

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
				<Route path="customers" element={<Customers />} />
				<Route path="my-vehicles" element={<Vehicle />} />
				<Route path="/layout/vehicle" element={<Vehicle />} />
				<Route path="/layout/service-booking" element={<Booking />} />
				<Route path="/layout/service-tracking" element={<ServiceTracking />} />


			</Route>
		</Routes>
	)
}

export default App;