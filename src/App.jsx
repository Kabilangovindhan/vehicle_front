import React from "react";
import { Routes, Route } from "react-router-dom";

// Common Routes
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";

// Admin Routes
import CustomerManagement from "./pages/admin/CustomerManagement";
import JobAssignment from "./pages/admin/JobAssignment";

// Customer Routes
import MyVehicle from "./pages/customer/MyVehicle";
import ServiceTracking from "./pages/customer/ServiceTracking";
import ServiceBooking from "./pages/customer/ServiceBooking";

// Staff Routes
import AssignedJobs from "./pages/staff/AssignedJobs";
import InspectionReport from "./pages/staff/InspectionReport";
import Estimate from "./pages/staff/Estimation";

function App() {
	return (
		<Routes>

			{/* Common Routes */}
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>

				{/* Admin Routes */}
				<Route path="customer-management" element={<CustomerManagement />} />
				<Route path="job-assignment" element={<JobAssignment />} />

				{/* Customer Routes */}
				<Route path="my-vehicles" element={<MyVehicle />} />
				<Route path="service-booking" element={<ServiceBooking />} />
				<Route path="service-tracking" element={<ServiceTracking />} />

				{/* Staff Routes */}
				<Route path="assigned-jobs" element={<AssignedJobs />} />
				<Route path="inspection/:jobId" element={<InspectionReport />} />
				<Route path="estimate/:jobId" element={<Estimate />} />

			</Route>
		</Routes>
	)
}

export default App;