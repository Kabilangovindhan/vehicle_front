import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";
import Customers from "./pages/admin/Customer";
import Vehicle from "./pages/customer/Vehicle";

function App() {

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
				<Route path="customers" element={<Customers />} />
				<Route path="my-vehicles" element={<Vehicle />} />
			</Route>
		</Routes>
	)
}

export default App;