import React, { useState, useEffect, useCallback } from 'react';
import { advocateService } from '../services';
import api from '../services/api'; 
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './SearchAdvocates.css';

const SearchAdvocates = () => {
  const [allAdvocates, setAllAdvocates] = useState([]); // Stores all data from DB
  const [filteredAdvocates, setFilteredAdvocates] = useState([]); // Stores data currently displayed
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]); 

  const [filters, setFilters] = useState({
    specialization: '',
    location: '', 
    minExperience: ''
  });

  // 1. Fetch Dropdown Options
  const fetchSpecializations = async () => {
    try {
      const response = await api.get('/advocates/specializations');
      if (Array.isArray(response.data)) {
        setSpecializations(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch specializations:', error);
      setSpecializations([
        'Criminal Law', 'Civil Law', 'Corporate Law', 'Family Law', 
        'Property Law', 'Constitutional Law', 'IPR Law', 'Cyber Law'
      ]);
    }
  };

  // 2. Fetch All Advocates (Memoized to prevent useEffect loop warnings)
  const fetchAllAdvocates = useCallback(async () => {
    try {
      setLoading(true);
      const data = await advocateService.search({}); // Fetch all without params
      setAllAdvocates(data);
      setFilteredAdvocates(data); // Initially show everyone
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch advocates');
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Initial Data Load
  useEffect(() => {
    fetchSpecializations();
    fetchAllAdvocates();
  }, [fetchAllAdvocates]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // 4. Filtering Logic (Client-Side)
    const results = allAdvocates.filter(advocate => {
      // Specialization: Exact Match
      const matchSpec = filters.specialization 
        ? advocate.specialization === filters.specialization 
        : true;

      // Location: Case-Insensitive Partial Match (e.g., "bang" matches "Bangalore")
      const matchLoc = filters.location 
        ? advocate.location && advocate.location.toLowerCase().includes(filters.location.toLowerCase().trim())
        : true;

      // Experience: Greater than or equal check
      const matchExp = filters.minExperience 
        ? advocate.experience_years >= parseInt(filters.minExperience) 
        : true;

      return matchSpec && matchLoc && matchExp;
    });

    setFilteredAdvocates(results);
    
    if (results.length === 0) {
      toast.info("No advocates found matching your criteria.");
    }
  };

  const handleReset = () => {
    setFilters({ specialization: '', location: '', minExperience: '' });
    setFilteredAdvocates(allAdvocates);
  };

  return (
    <div className="search-page">
      <div className="container">
        <h1>Find Your Advocate</h1>
        
        {/* Search Filters Section */}
        <div className="search-filters card">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-3">
              
              {/* Specialization Filter */}
              <div className="form-group">
                <label>Specialization</label>
                <select 
                  name="specialization" 
                  className="form-control" 
                  value={filters.specialization} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  placeholder="Enter city (e.g. Bangalore)" 
                  value={filters.location} 
                  onChange={handleFilterChange} 
                />
              </div>

              {/* Experience Filter */}
              <div className="form-group">
                <label>Min Experience (Years)</label>
                <input 
                  type="number" 
                  name="minExperience" 
                  className="form-control" 
                  value={filters.minExperience} 
                  onChange={handleFilterChange} 
                  min="0" 
                />
              </div>
            </div>
            
            <div className="filter-buttons">
              <button type="submit" className="btn btn-primary">Search</button>
              <button type="button" className="btn btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="loading">Loading advocates...</div>
        ) : (
          <div className="advocates-grid">
            {filteredAdvocates.length === 0 ? (
              <p className="no-results">No advocates found.</p>
            ) : (
              filteredAdvocates.map(advocate => (
                <div key={advocate.id} className="advocate-card card">
                  <h3>{advocate.name}</h3>
                  <p className="specialization">{advocate.specialization}</p>
                  <div className="advocate-info">
                    <p><strong>Experience:</strong> {advocate.experience_years} years</p>
                    <p><strong>Location:</strong> {advocate.location || 'Not Specified'}</p>
                    <p><strong>Rating:</strong> ⭐ {advocate.rating ? Number(advocate.rating).toFixed(1) : 'New'}</p>
                  </div>
                  <Link to={`/advocate/${advocate.id}`} className="btn btn-primary btn-block">View Profile</Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAdvocates;