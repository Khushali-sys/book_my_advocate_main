import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const SPECIALIZATIONS = [
  'Criminal Law',
  'Family Law',
  'Corporate Law',
  'Intellectual Property',
  'Tax Law',
  'Civil Litigation',
  'Real Estate',
  'Immigration',
  'Labor & Employment',
  'Other',
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    // Advocate-only fields
    serviceMode: 'online',          // default for advocates
    specializations: [],           // array of strings
    location: '',                  // free-text city/state
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Multi-select handling
  const handleSpecializationChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setFormData((prev) => ({ ...prev, specializations: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---- Basic validation for advocate fields ----
    if (formData.role === 'advocate') {
      if (formData.specializations.length === 0) {
        toast.error('Please select at least one specialization.');
        return;
      }
      if (!formData.serviceMode) {
        toast.error('Please choose a service mode.');
        return;
      }
      if ((formData.serviceMode === 'offline' || formData.serviceMode === 'both') && !formData.location.trim()) {
        toast.error('Location is required for offline or both service modes.');
        return;
      }
    }

    setLoading(true);
    try {
      // Send **exactly** the shape the backend expects
      const payload = { ...formData };
      // If the user is not an advocate, strip advocate fields
      if (payload.role !== 'advocate') {
        delete payload.serviceMode;
        delete payload.specializations;
        delete payload.location;
      }

      const response = await register(payload);
      toast.success('Registration successful!');

      // Redirect based on role
      if (formData.role === 'advocate') {
        navigate('/advocate-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const isAdvocate = formData.role === 'advocate';
  const needsLocation =
    isAdvocate &&
    (formData.serviceMode === 'offline' || formData.serviceMode === 'both');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          {/* ---------- Existing fields ---------- */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Register As</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleChange}
                />
                <span>User (Book Services)</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="role"
                  value="advocate"
                  checked={formData.role === 'advocate'}
                  onChange={handleChange}
                />
                <span>Advocate (Provide Services)</span>
              </label>
            </div>
          </div>

          {/* ---------- Advocate-only sections ---------- */}
          {isAdvocate && (
            <>
              {/* Service Mode */}
              <div className="form-group">
                <label>Service Mode</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="serviceMode"
                      value="online"
                      checked={formData.serviceMode === 'online'}
                      onChange={handleChange}
                    />
                    <span>Online Only</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="serviceMode"
                      value="offline"
                      checked={formData.serviceMode === 'offline'}
                      onChange={handleChange}
                    />
                    <span>Offline Only</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="serviceMode"
                      value="both"
                      checked={formData.serviceMode === 'both'}
                      onChange={handleChange}
                    />
                    <span>Both</span>
                  </label>
                </div>
              </div>

              {/* Specializations */}
              <div className="form-group">
                <label>Specialization (select one or more)</label>
                <select
                  multiple
                  className="form-control"
                  value={formData.specializations}
                  onChange={handleSpecializationChange}
                  style={{ height: '120px' }} // makes multi-select usable
                >
                  {SPECIALIZATIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <small className="form-text text-muted">
                  Hold Ctrl (Cmd on Mac) to select multiple.
                </small>
              </div>

              {/* Location – conditional */}
              {needsLocation && (
                <div className="form-group">
                  <label>Location (City, State)</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="e.g., Mumbai, Maharashtra"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;