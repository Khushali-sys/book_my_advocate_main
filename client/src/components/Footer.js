import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BookMyAdvocate</h3>
            <p>Your trusted platform for finding legal advocates</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/search">Find Advocates</a></li>
              <li><a href="/register">Sign Up</a></li>
              <li><a href="/advocate-register">Register as Advocate</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Email: support@bookmyadvocate.com</li>
              <li>Phone: +91 1234567890</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 BookMyAdvocate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
