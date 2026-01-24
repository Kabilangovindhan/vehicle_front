import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customer";

function App() {

	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout/*" element={<Layout />}>
				<Route path="dashboard" element={<Dashboard />} />
				<Route path="customers" element={<Customers />} />
			</Route>

		</Routes>
	);
}

export default App;
