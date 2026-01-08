import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdvocateDetails.css';

const AdvocateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [advocate, setAdvocate] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState({
    serviceType: 'online',
    scheduledDate: '',
    notes: ''
  });

  useEffect(() => {
    fetchAdvocateDetails();
  }, [id]);

  const fetchAdvocateDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/advocates/${id}`);
      const advocateData = response.data;
      
      setAdvocate(advocateData);
      setServices(advocateData.services || []);
      setReviews(advocateData.reviews || []);
      
      console.log("Loaded Data:", advocateData); // Debugging: Check console to see if services appear
    } catch (error) {
      console.error('Failed to fetch advocate details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = (service) => {
    if (!isAuthenticated) {
      alert('Please login to book a service');
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!bookingData.scheduledDate) {
        alert('Please select a date and time');
        return;
      }

      const datetime = new Date(bookingData.scheduledDate);
      
      if (isNaN(datetime.getTime())) {
        alert('Invalid date selected');
        return;
      }

      const year = datetime.getFullYear();
      const month = String(datetime.getMonth() + 1).padStart(2, '0');
      const day = String(datetime.getDate()).padStart(2, '0');
      const hours = String(datetime.getHours()).padStart(2, '0');
      const minutes = String(datetime.getMinutes()).padStart(2, '0');
      const seconds = '00';

      const booking_date = `${year}-${month}-${day}`;
      const booking_time = `${hours}:${minutes}:${seconds}`;

      const response = await api.post('/bookings', {
        advocate_id: parseInt(id),
        service_id: selectedService?.id || null,
        booking_date: booking_date,
        booking_time: booking_time,
        service_type: bookingData.serviceType,
        notes: bookingData.notes
      });
      
      alert('Booking created successfully!');
      setShowBookingModal(false);
      setBookingData({
        serviceType: 'online',
        scheduledDate: '',
        notes: ''
      });
      navigate('/my-bookings');
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!advocate) {
    return <div className="container"><p>Advocate not found</p></div>;
  }

  return (
    <div className="advocate-details-page">
      <div className="container">
        <div className="advocate-header card">
          <div className="advocate-info-section">
            <h1>{advocate.name}</h1>
            <p className="specialization">{advocate.specialization}</p>
            <div className="advocate-meta">
              <span>⭐ {advocate.rating || 'N/A'}</span>
              <span>📍 {advocate.location || advocate.city}</span>
              <span>💼 {advocate.experience_years || advocate.experience} years experience</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div>
            <div className="card">
              <h2>Services Offered</h2>
              {services.length === 0 ? (
                <p>No services available</p>
              ) : (
                <div className="services-list">
                  {services.map(service => (
                    <div key={service.id} className="service-item">
                      <div className="service-info">
                        {/* Checks for both 'service_name' and 'name' */}
                        <h3>{service.service_name || service.name}</h3>
                        <p>{service.description}</p>
                        <div className="service-details">
                          <span className="price">₹{service.price}</span>
                          <span className="duration">{service.duration} mins</span>
                        </div>
                      </div>
                      {user?.role === 'user' && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleBookService(service)}
                        >
                          Book Now
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card">
              <h2>Reviews & Ratings</h2>
              {reviews.length === 0 ? (
                <p>No reviews yet</p>
              ) : (
                <div className="reviews-list">
                  {reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <strong>{review.userName || 'Anonymous'}</strong>
                        <span className="rating">{'⭐'.repeat(review.rating)}</span>
                      </div>
                      <p>{review.comment}</p>
                      <span className="review-date">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showBookingModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Book Service: {selectedService.service_name || selectedService.name}</h2>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Service Type</label>
                  <select
                    className="form-control"
                    value={bookingData.serviceType}
                    onChange={(e) => setBookingData({...bookingData, serviceType: e.target.value})}
                    required
                  >
                    <option value="online">Online Consultation</option>
                    <option value="offline">Offline Meeting</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={bookingData.scheduledDate}
                    onChange={(e) => setBookingData({...bookingData, scheduledDate: e.target.value})}
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    className="form-control"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    rows="3"
                  ></textarea>
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="btn btn-primary">
                    Confirm Booking
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvocateDetails;