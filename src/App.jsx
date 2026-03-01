import React from "react";
import { Routes, Route } from "react-router-dom";

// Common Routes
import Login from "./pages/common/Login";
import Layout from "./layout/Layout";
import Dashboard from "./pages/common/Dashboard";

// Admin Routes
import CustomerManagement from "./pages/admin/CustomerManagement";
import JobAssignment from "./pages/admin/JobAssignment";
import JobControlCenter from "./pages/admin/JobControlCenter";
import InspectionEstimationReport from "./pages/admin/InspectionEstimationReport";
import BillingInvoice from "./pages/admin/BillingInvoice";
import PaymentVerification from "./pages/admin/PaymentVerification";
import ReportAnalytics from "./pages/admin/ReportAnalytics";
import FeedbackAdmin from "./pages/admin/Feedback";

// Customer Routes
import MyVehicle from "./pages/customer/MyVehicle";
import ServiceTracking from "./pages/customer/ServiceTrackings";
import ServiceBooking from "./pages/customer/ServiceBooking";
import EstimateApproval from "./pages/customer/EstimateApproval";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerBillInvoice from "./pages/customer/CustomerBillInvoice";
import ServiceHistory from "./pages/customer/ServiceHistory";
import Feedback from "./pages/customer/Feedback";

// Staff Routes
import ApprovalQueue from "./pages/staff/ApprovalQueue";
import ServiceUpdate from "./pages/staff/ServiceUpdate";
import InspectionReport from "./pages/staff/InspectionReport";
import Estimate from "./pages/staff/Estimation";
import AssignedJob from "./pages/staff/AssignedJob";
import WorkHistory from "./pages/staff/StaffWorkHistory";
import FeedbackStaff from "./pages/staff/Feedback";

function App() {
	return (
		<Routes>

			{/* Common Routes */}
			<Route path="/" element={<Login />} />
			<Route path="/layout" element={<Layout />}>
			<Route path="dashboard" element={<Dashboard />} />

				{/* Admin Routes */}
				<Route path="customer-management" element={<CustomerManagement />} />
				<Route path="job-assignment" element={<JobAssignment />} />
				<Route path="job-control-center" element={<JobControlCenter />} />
				<Route path="inspection-estimation" element={<InspectionEstimationReport />} />
				<Route path="billing-invoice" element={<BillingInvoice />} />
				<Route path="payment-verification" element={<PaymentVerification />} />
				<Route path="report-analytics" element={<ReportAnalytics />} />
				<Route path="feedback-admin" element={<FeedbackAdmin />} />


				{/* Customer Routes */}
				<Route path="my-vehicles" element={<MyVehicle />} />
				<Route path="service-booking" element={<ServiceBooking />} />
				<Route path="service-tracking" element={<ServiceTracking />} />
				<Route path="estimates" element={<EstimateApproval />}/>
                <Route path="profile" element={<CustomerProfile />} />
				<Route path="invoices" element={<CustomerBillInvoice />} />
				<Route path="service-history" element={<ServiceHistory />} />
				<Route path="feedback" element={<Feedback />} />

				{/* Staff Routes */}
				<Route path="inspection/:jobId" element={<InspectionReport />} />
				<Route path="estimate/:jobId" element={<Estimate />} />
				<Route path="assigned-jobs" element={<AssignedJob />} />
                <Route path="approval-queue" element={<ApprovalQueue />} />
                <Route path="service-updates" element={<ServiceUpdate />} />
				<Route path="work-history" element={<WorkHistory />} />
				<Route path="feedback-staff" element={<FeedbackStaff />} />

			</Route>
		</Routes>
	)
}

export default App;