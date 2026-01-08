import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Find the Best Legal Advocate for Your Needs</h1>
            <p>Connect with experienced advocates for online and offline consultations</p>
            <div className="hero-buttons">
              <Link to="/search" className="btn btn-primary btn-lg">
                Find an Advocate
              </Link>
              {!isAuthenticated && (
                <Link to="/advocate-register" className="btn btn-secondary btn-lg">
                  Register as Advocate
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us?</h2>
          <div className="grid grid-cols-3">
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>Expert Advocates</h3>
              <p>Access to verified and experienced legal professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💻</div>
              <h3>Online & Offline</h3>
              <p>Choose between virtual consultations or in-person meetings</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Trusted Reviews</h3>
              <p>Read genuine reviews from clients before booking</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied clients who found their perfect legal advocate</p>
          {!isAuthenticated ? (
            <Link to="/register" className="btn btn-primary btn-lg">
              Create Free Account
            </Link>
          ) : user?.role === 'user' ? (
            <Link to="/search" className="btn btn-primary btn-lg">
              Search Advocates
            </Link>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default Home;
