import React, { useState, useEffect } from 'react';
import { bookingService } from '../services';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      alert('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingService.cancelBooking(bookingId);
      alert('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      alert('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-info',
      cancelled: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="bookings-page">
      <div className="container">
        <h1>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div className="card">
            <p className="no-bookings">You don't have any bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card card">
                <div className="booking-header">
                  <h3>{booking.advocate_name}</h3>
                  <span className={`badge ${getStatusBadge(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <p><strong>Service:</strong> {booking.service_title || 'General Consultation'}</p>
                  <p><strong>Specialization:</strong> {booking.specialization}</p>
                  <p><strong>Type:</strong> {booking.service_type === 'online' ? '💻 Online' : '📍 Offline'}</p>
                  <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {booking.booking_time}</p>
                  <p><strong>Location:</strong> {booking.location}</p>
                  <p><strong>Price:</strong> ₹{booking.total_amount}</p>
                  <p><strong>Payment:</strong> <span className={`badge ${booking.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{booking.payment_status}</span></p>
                  {booking.notes && <p><strong>Notes:</strong> {booking.notes}</p>}
                </div>
                <div className="booking-footer">
                  <span className="booking-date">
                    Booked on: {new Date(booking.created_at).toLocaleDateString()}
                  </span>
                  <span className="advocate-phone">📞 {booking.advocate_phone}</span>
                  {booking.status === 'pending' && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
