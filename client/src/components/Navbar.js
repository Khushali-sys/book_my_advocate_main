import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>BookMyAdvocate</h2>
        </Link>
        
        <div className="navbar-links">
          <Link to="/search" className="nav-link">Find Advocates</Link>
          
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          ) : (
            <>
              {user.role === 'user' && (
                <>
                  <Link to="/my-bookings" className="nav-link">My Bookings</Link>
                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                </>
              )}
              
              {user.role === 'advocate' && (
                <Link to="/advocate-dashboard" className="nav-link">Dashboard</Link>
              )}
              
              {user.role === 'admin' && (
                <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
              )}
              
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
