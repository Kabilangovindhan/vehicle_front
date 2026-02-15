import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";
import Customers from "./pages/admin/Customer";
import Vehicle from "./pages/customer/Vehicle";
import Booking from "./pages/customer/Booking";
import ServiceTracking from "./pages/customer/ServiceTracking";
import BookingManagement from "./pages/admin/BookingManagement";
import AssignedJobs from "./pages/staff/AssignedJobs";
import InspectionPage from "./pages/staff/inspection";
import CreateEstimate from "./pages/staff/CreateEstimate";




function App() {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
				<Route path="service-tracking" element={<ServiceTracking />} />
				<Route path="customers" element={<Customers />} />
				<Route path="my-vehicles" element={<Vehicle />} />
				<Route path="vehicle" element={<Vehicle />} />
				<Route path="service-booking" element={<Booking />} />
				<Route path="bookings" element={<BookingManagement />} />
				<Route path="assigned-jobs" element={<AssignedJobs />} />
				<Route path="inspection" element={<InspectionPage />} />
				<Route path="inspection/:jobId" element={<InspectionPage />} />

				<Route path="inspection/:jobId" element={<InspectionPage />} />
				<Route path="create-estimate/:jobId" element={<CreateEstimate />} />



			</Route>
		</Routes>
	)
}

export default App;