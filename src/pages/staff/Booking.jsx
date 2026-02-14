import React, { useEffect, useState } from "react";

function StaffBookings() {

    const [bookings, setBookings] = useState([]);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {

        const res = await fetch("http://localhost:5000/api/staff/bookings/pending", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        setBookings(data);
    };

    const approveBooking = async (id) => {

        await fetch(`http://localhost:5000/api/staff/booking/${id}/approve`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        fetchBookings();
    };

    const rejectBooking = async (id) => {

        await fetch(`http://localhost:5000/api/staff/booking/${id}/reject`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        fetchBookings();
    };

    return (
        <div>

            <h2>Pending Bookings</h2>

            {bookings.map(b => (

                <div key={b._id}>

                    <h4>{b.vehicle.vehicleNumber}</h4>

                    <p>{b.serviceType}</p>

                    <button onClick={() => approveBooking(b._id)}>
                        Approve
                    </button>

                    <button onClick={() => rejectBooking(b._id)}>
                        Reject
                    </button>

                </div>

            ))}

        </div>
    );
}

export default StaffBookings;
