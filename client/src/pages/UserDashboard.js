import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Welcome, {user?.name}!</h1>
        
        <div className="dashboard-grid">
          <Link to="/search" className="dashboard-card card">
            <div className="card-icon">🔍</div>
            <h3>Find Advocates</h3>
            <p>Search for advocates based on specialization and location</p>
          </Link>

          <Link to="/my-bookings" className="dashboard-card card">
            <div className="card-icon">📅</div>
            <h3>My Bookings</h3>
            <p>View and manage your appointment bookings</p>
          </Link>

          <Link to="/profile" className="dashboard-card card">
            <div className="card-icon">👤</div>
            <h3>My Profile</h3>
            <p>Update your personal information</p>
          </Link>
        </div>

        <div className="card quick-tips">
          <h2>Quick Tips</h2>
          <ul>
            <li>Search for advocates by specialization to find the right expert for your case</li>
            <li>Check advocate ratings and reviews before booking</li>
            <li>Choose between online and offline consultations based on your preference</li>
            <li>Keep track of your bookings in the My Bookings section</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
