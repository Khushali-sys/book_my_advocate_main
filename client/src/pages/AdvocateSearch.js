import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { advocateService } from '../services'; // Import the service we updated
import './AdvocateSearch.css';

const AdvocateSearch = () => {
  const navigate = useNavigate();
  const [advocates, setAdvocates] = useState([]);
  const [specializations, setSpecializations] = useState([]); // State for dropdown options
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    minExperience: '', // Added to match backend
  });

  useEffect(() => {
    // 1. Fetch Specializations for the dropdown
    fetchSpecializations();
    // 2. Fetch initial list of advocates
    fetchAdvocates();
  }, []);

  const fetchSpecializations = async () => {
    try {
      // Uses the new function we added to services/index.js
      const data = await advocateService.getSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error('Error fetching specializations:', error);
      // Fallback if API fails
      setSpecializations(['Criminal Law', 'Civil Law', 'Corporate Law']);
    }
  };

  const fetchAdvocates = async () => {
    try {
      setLoading(true);
      // Clean filters: remove empty keys before sending
      const activeFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key]) activeFilters[key] = filters[key];
      });
      
      // Use the service to search
      const data = await advocateService.search(activeFilters);
      setAdvocates(data);
    } catch (error) {
      console.error('Error fetching advocates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAdvocates();
  };

  const handleClearFilters = () => {
    setFilters({
      specialization: '',
      location: '',
      minExperience: ''
    });
    // Trigger fetch after state update
    setTimeout(fetchAdvocates, 100);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading advocates...</p>
      </div>
    );
  }

  return (
    <div className="advocate-search-page">
      <div className="container">
        <div className="page-header">
          <h1>Find Legal Advocates</h1>
          <p>Search and connect with experienced legal professionals</p>
        </div>

        <div className="search-section card">
          <form onSubmit={handleSearch}>
            <div className="search-grid">
              
              {/* Specialization Dropdown */}
              <div className="form-group">
                <select
                  name="specialization"
                  className="form-control"
                  value={filters.specialization}
                  onChange={handleFilterChange}
                >
                  <option value="">All Specializations</option>
                  {/* Map through dynamic specializations from DB */}
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Location Input */}
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="Location (e.g. Bangalore)"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>

              {/* Experience Input */}
              <div className="form-group">
                <input
                  type="number"
                  name="minExperience"
                  className="form-control"
                  placeholder="Min Experience (Years)"
                  value={filters.minExperience}
                  onChange={handleFilterChange}
                  min="0"
                />
              </div>

              <div className="search-buttons">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleClearFilters}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="results-section">
          <h2>{advocates.length} Advocates Found</h2>

          {advocates.length === 0 ? (
            <div className="card no-results">
              <p>No advocates found matching your criteria</p>
            </div>
          ) : (
            <div className="advocates-grid">
              {advocates.map((advocate) => (
                <div key={advocate.id} className="advocate-card card">
                  <div className="advocate-header">
                    <h3>{advocate.name}</h3>
                    {/* Assuming you might have a verified field, otherwise remove */}
                    {advocate.is_verified === 1 && (
                      <span className="badge badge-success">✓ Verified</span>
                    )}
                  </div>

                  <p className="specialization">{advocate.specialization}</p>
                  <p className="location">📍 {advocate.location}</p>

                  <div className="advocate-stats">
                    <span className="rating">
                      ⭐ {advocate.rating ? advocate.rating.toFixed(1) : 'New'}
                    </span>
                    <span className="experience">
                      💼 {advocate.experience_years} years
                    </span>
                  </div>

                  {advocate.bio && (
                    <p className="bio">{advocate.bio.substring(0, 100)}...</p>
                  )}

                  <div className="advocate-pricing">
                    {/* Only show if you have price data, otherwise fallback */}
                    {advocate.hourly_rate ? (
                        <span className="price">₹{advocate.hourly_rate}/hr</span>
                    ) : (
                        <span className="price">Contact for rates</span>
                    )}
                  </div>

                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => navigate(`/advocates/${advocate.id}`)}
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvocateSearch;