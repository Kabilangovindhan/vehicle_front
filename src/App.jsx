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
import ServiceTracking from "./pages/customer/ServiceTrackings";
import ServiceBooking from "./pages/customer/ServiceBooking";
import EstimateApproval from "./pages/customer/EstimateApproval";


// Staff Routes
import JobManagement from "./pages/staff/JobManagement";
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
				<Route path="estimates"element={<EstimateApproval />}
				/>


				{/* Staff Routes */}
				<Route path="job-managment" element={<JobManagement />} />
				<Route path="inspection/:jobId" element={<InspectionReport />} />
				<Route path="estimate/:jobId" element={<Estimate />} />

			</Route>
		</Routes>
	)
}

export default App;