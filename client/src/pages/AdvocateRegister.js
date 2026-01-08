import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const AdvocateRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'advocate',
    specialization: '',
    customSpecialization: '', // To store 'Other' input
    service_type: 'both',     // Default choice
    location: ''              // Conditional field
  });
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const specializations = [
    'Criminal Law', 'Civil Law', 'Corporate Law', 'Family Law',
    'Property Law', 'Tax Law', 'Labour Law', 'Constitutional Law',
    'IPR Law', 'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Resolve Specialization (Dropdown vs Custom Input)
      let finalSpecialization = formData.specialization;
      if (formData.specialization === 'Other') {
        finalSpecialization = formData.customSpecialization;
      }

      if (!finalSpecialization) {
        toast.error('Please select a specialization');
        setLoading(false);
        return;
      }

      // 2. Resolve Location Logic
      let finalLocation = formData.location;
      
      if (formData.service_type === 'online') {
        // Automatically set location to 'Online' if service type is Online Only
        finalLocation = 'Online';
      } else {
        // If Offline/Both, ensure the user typed a location
        if (!finalLocation || !finalLocation.trim()) {
          toast.error('Please enter your office location/city');
          setLoading(false);
          return;
        }
      }

      // 3. Send Registration Data
      await register({
        ...formData,
        specialization: finalSpecialization,
        location: finalLocation
      });
      
      toast.success('Registration successful! Please login to continue.');
      navigate('/login');

    } catch (error) {
      console.error('Registration Error:', error);
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '500px' }}>
        <h2>Register as Advocate</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '20px' }}>
          Join our platform to offer legal services
        </p>
        <form onSubmit={handleSubmit}>
          
          {/* Basic Info */}
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone *</label>
            <input type="tel" name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
          </div>

          {/* Specialization Field */}
          <div className="form-group">
            <label>Specialization *</label>
            <select name="specialization" className="form-control" value={formData.specialization} onChange={handleChange} required>
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Conditional: Custom Specialization Input */}
          {formData.specialization === 'Other' && (
            <div className="form-group">
              <label>Enter Custom Specialization *</label>
              <input type="text" name="customSpecialization" className="form-control" placeholder="e.g. Cyber Law" value={formData.customSpecialization} onChange={handleChange} required />
            </div>
          )}

          {/* Service Offering Field */}
          <div className="form-group">
            <label>Service Offering *</label>
            <select name="service_type" className="form-control" value={formData.service_type} onChange={handleChange} required>
              <option value="both">Both (Online & Offline)</option>
              <option value="online">Online Only</option>
              <option value="offline">Offline Only</option>
            </select>
          </div>

          {/* Conditional: Location Field (Hidden if Online Only) */}
          {formData.service_type !== 'online' && (
            <div className="form-group">
              <label>Office Location / City *</label>
              <input 
                type="text" 
                name="location" 
                className="form-control" 
                placeholder="e.g. High Court Complex, New Delhi" 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
            </div>
          )}

          {/* Password Field */}
          <div className="form-group">
            <label>Password *</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Registering...' : 'Register as Advocate'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default AdvocateRegister;