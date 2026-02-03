import React, { useState } from "react";
import {
	Hash,
	ClipboardCheck,
	Gauge,
	ChevronRight,
	CheckCircle2,
	Activity,
	ArrowLeft,
	Calendar,
	FileText,
	Smartphone,
	User
} from "lucide-react";

/* ===================== BIKE DATA ===================== */
const BIKE_DATA = {
	Honda: ["Shine", "SP 125", "Unicorn", "CBR 250R", "Activa"],
	Yamaha: ["FZ", "R15", "MT-15", "Aerox 155"],
	"Royal Enfield": ["Classic 350", "Meteor 350", "Himalayan"],
	KTM: ["Duke 200", "Duke 390", "RC 390"],
	Bajaj: ["Pulsar 125", "Pulsar RS200", "Dominar 400"],
	TVS: ["Apache RTR 160", "Apache RTR 200", "NTorq"],
	Suzuki: ["Access 125", "Gixxer", "Hayabusa"],
	Kawasaki: ["Ninja 300", "Z650", "Versys 650"],
	Triumph: ["Street Triple", "Tiger 660"]
};

function Booking() {
	const [step, setStep] = useState(1);
	const [data, setData] = useState({
		registrationNumber: "",
		chassisNumber: "",
		engineNumber: "",
		brand: "",
		model: "",
		engineCC: "",
		fuelType: "Petrol",
		customerName: "",
		vehicleNumber: "",
		bookingDate: "",
		odometer: "",
		serviceType: "General Service",
		deliveryMode: "Customer Drop",
		notes: ""
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleBrandChange = (e) => {
		setData((prev) => ({ ...prev, brand: e.target.value, model: "" }));
	};

	const handleServiceType = (type) => {
		setData((prev) => ({ ...prev, serviceType: type }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		alert("Service booked successfully ✅");
	};

	/* ===================== SHARED STYLES ===================== */
	const inputStyle = "w-full rounded-xl border border-slate-300 px-4 py-3 text-base md:text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white appearance-none";
	const labelStyle = "block text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 ml-1";
	const cardStyle = "bg-white rounded-3xl border border-slate-200 shadow-sm p-5 md:p-8";

	return (
		<div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
			<div className="max-w-4xl mx-auto px-4 py-8 md:py-16">

				{/* TOP NAVIGATION / STATUS */}
				<div className="mb-10 text-center md:text-left">
					<div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter mb-4">
						<Activity size={14} className="text-blue-400" /> System Live
					</div>
					<h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
						{step === 1 ? "Vehicle Info" : "Service Details"}
					</h1>
					<p className="text-slate-500 mt-2 font-medium">Please fill in the details to book your slot.</p>
				</div>

				{/* STEPPER BAR */}
				<div className="flex gap-2 mb-8 h-1.5">
					<div className={`flex-1 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
					<div className={`flex-1 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
				</div>

				{/* STEP 1: VEHICLE DETAILS */}
				{step === 1 && (
					<div className={`${cardStyle} animate-in fade-in zoom-in-95 duration-300`}>
						<header className="flex items-center justify-between mb-8">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Hash size={24} /></div>
								<h3 className="font-bold text-xl">Identity</h3>
							</div>
						</header>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-5">
							<div className="sm:col-span-2 lg:col-span-1">
								<label className={labelStyle}>Reg. Number</label>
								<input name="registrationNumber" placeholder="e.g. MH 12 AB 1234" onChange={handleChange} className={inputStyle} />
							</div>

							<div>
								<label className={labelStyle}>Chassis No.</label>
								<input name="chassisNumber" placeholder="17-digit number" onChange={handleChange} className={inputStyle} />
							</div>

							<div>
								<label className={labelStyle}>Engine No.</label>
								<input name="engineNumber" onChange={handleChange} className={inputStyle} />
							</div>

							<div className="relative">
								<label className={labelStyle}>Brand</label>
								<select value={data.brand} onChange={handleBrandChange} className={inputStyle}>
									<option value="">Select Brand</option>
									{Object.keys(BIKE_DATA).map((b) => <option key={b} value={b}>{b}</option>)}
								</select>
								<div className="absolute right-4 top-[38px] pointer-events-none text-slate-400"><ChevronRight size={16} className="rotate-90" /></div>
							</div>

							<div className="relative">
								<label className={labelStyle}>Model</label>
								<select name="model" value={data.model} onChange={handleChange} className={inputStyle} disabled={!data.brand}>
									<option value="">Select Model</option>
									{data.brand && BIKE_DATA[data.brand].map((m) => <option key={m} value={m}>{m}</option>)}
								</select>
								<div className="absolute right-4 top-[38px] pointer-events-none text-slate-400"><ChevronRight size={16} className="rotate-90" /></div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className={labelStyle}>CC</label>
									<input name="engineCC" placeholder="150" onChange={handleChange} className={inputStyle} />
								</div>
								<div>
									<label className={labelStyle}>Fuel</label>
									<select name="fuelType" value={data.fuelType} onChange={handleChange} className={inputStyle}>
										<option>Petrol</option>
										<option>EV</option>
									</select>
								</div>
							</div>
						</div>

						<div className="mt-10 pt-8 border-t border-slate-100">
							<button
								onClick={() => setStep(2)}
								className="w-full md:w-auto float-right bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
							>
								Continue Booking <ChevronRight size={20} />
							</button>
						</div>
					</div>
				)}

				{/* STEP 2: SERVICE DETAILS */}
				{step === 2 && (
					<form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							{/* LEFT COLUMN: CUSTOMER */}
							<div className="lg:col-span-2 space-y-6">
								<div className={cardStyle}>
									<h3 className="font-bold text-lg mb-6 flex items-center gap-3">
										<User size={20} className="text-blue-600" /> Customer Information
									</h3>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
										<div>
											<label className={labelStyle}>Owner Name</label>
											<input name="customerName" placeholder="Enter full name" onChange={handleChange} className={inputStyle} />
										</div>
										<div>
											<label className={labelStyle}>Contact Number</label>
											<div className="relative">
												<Smartphone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
												<input name="vehicleNumber" placeholder="98765 43210" onChange={handleChange} className={`${inputStyle} pl-11`} />
											</div>
										</div>
									</div>
								</div>

								<div className={cardStyle}>
									<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
										<h3 className="font-bold text-lg flex items-center gap-3">
											<ClipboardCheck size={20} className="text-emerald-500" /> Service Tasks
										</h3>
									</div>

									<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
										{["General Service", "Oil Change", "Engine Repair", "Electrical", "Brakes", "Body Work"].map((type) => (
											<button
												key={type}
												type="button"
												onClick={() => handleServiceType(type)}
												className={`p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between ${data.serviceType === type
													? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-100"
													: "border-slate-100 hover:border-slate-200 bg-slate-50 text-slate-500"
													}`}
											>
												{type}
												{data.serviceType === type && <CheckCircle2 size={16} />}
											</button>
										))}
									</div>
								</div>
							</div>

							{/* RIGHT COLUMN: LOGISTICS */}
							<div className="space-y-6">
								<div className={cardStyle}>
									<label className={labelStyle}>Odometer Reading</label>
									<div className="relative mb-6">
										<Gauge size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
										<input name="odometer" placeholder="KM count" onChange={handleChange} className={`${inputStyle} pl-11`} />
									</div>

									<label className={labelStyle}>Scheduled Date</label>
									<div className="relative mb-6">
										<Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
										<input type="date" name="bookingDate" onChange={handleChange} className={`${inputStyle} pl-11`} />
									</div>

									<label className={labelStyle}>Delivery Mode</label>
									<div className="flex bg-slate-100 p-1.5 rounded-2xl">
										{["Customer Drop", "Pickup"].map((mode) => (
											<button
												key={mode}
												type="button"
												onClick={() => setData(p => ({ ...p, deliveryMode: mode }))}
												className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter rounded-xl transition-all ${data.deliveryMode === mode ? "bg-white shadow-sm text-blue-600" : "text-slate-400"
													}`}
											>
												{mode}
											</button>
										))}
									</div>
								</div>

								<div className={cardStyle}>
									<label className={labelStyle}>Service Notes</label>
									<textarea name="notes" rows="4" placeholder="Mention any specific problems..." onChange={handleChange} className={inputStyle} />
								</div>
							</div>
						</div>

						{/* ACTION FOOTER */}
						<div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
							<button
								type="button"
								onClick={() => setStep(1)}
								className="w-full sm:w-auto order-2 sm:order-1 px-8 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
							>
								Go Back
							</button>
							<button
								type="submit"
								className="w-full sm:flex-1 order-1 sm:order-2 bg-slate-900 hover:bg-black text-white font-black py-5 rounded-3xl shadow-2xl shadow-slate-200 transition-all active:scale-[0.98]"
							>
								Finalize Booking
							</button>
						</div>
					</form>
				)}
			</div>
		</div>
	);
}

export default Booking;