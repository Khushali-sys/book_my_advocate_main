import React, { useState, useEffect } from 'react';
import { adminService } from '../services';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [advocates, setAdvocates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData, advocatesData, bookingsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers(),
        adminService.getAllAdvocates(),
        adminService.getAllBookings()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setAdvocates(advocatesData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Admin fetch error:', error);
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAdvocate = async (id, currentStatus) => {
    try {
      await adminService.verifyAdvocate(id, !currentStatus);
      toast.success(currentStatus ? 'Advocate unverified' : 'Advocate verified successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(id);
        toast.success('User deleted successfully');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getPaymentBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      paid: 'badge-success',
      failed: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab-btn ${activeTab === 'advocates' ? 'active' : ''}`}
            onClick={() => setActiveTab('advocates')}
          >
            Advocates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            Bookings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>Total Users</h3>
                  <p className="stat-number">{stats?.totalUsers || 0}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">⚖️</div>
                <div className="stat-content">
                  <h3>Total Advocates</h3>
                  <p className="stat-number">{stats?.totalAdvocates || 0}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>Total Bookings</h3>
                  <p className="stat-number">{stats?.totalBookings || 0}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Pending Bookings</h3>
                  <p className="stat-number">{stats?.pendingBookings || 0}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Revenue</h3>
                  <p className="stat-number">{formatCurrency(stats?.totalRevenue)}</p>
                </div>
              </div>
              <div className="stat-card card">
                <div className="stat-icon">✓</div>
                <div className="stat-content">
                  <h3>Unverified Advocates</h3>
                  <p className="stat-number">{advocates.filter(a => !a.is_verified).length}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2>Recent Bookings</h2>
              <div className="recent-bookings">
                {stats?.recentBookings?.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-info">
                      <strong>{booking.user_name}</strong> booked <strong>{booking.advocate_name}</strong>
                      <span className={`badge ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="booking-meta">
                      <span>{formatDate(booking.booking_date)}</span>
                      <span>{formatCurrency(booking.total_amount)}</span>
                    </div>
                  </div>
                ))}
                {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                  <p className="no-data">No recent bookings</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card">
            <div className="card-header">
              <h2>All Users ({users.filter(u => u.role === 'user').length})</h2>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data">No users found</td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`badge badge-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{formatDate(user.created_at)}</td>
                        <td>
                          {user.role !== 'admin' && (
                            <button 
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteUser(user.id)}
                              title="Delete User"
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'advocates' && (
          <div className="card">
            <div className="card-header">
              <h2>All Advocates ({advocates.length})</h2>
              <span className="badge badge-warning">
                {advocates.filter(a => !a.is_verified).length} Unverified
              </span>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {advocates.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">No advocates found</td>
                    </tr>
                  ) : (
                    advocates.map(advocate => (
                      <tr key={advocate.id}>
                        <td>{advocate.id}</td>
                        <td>{advocate.name}</td>
                        <td>{advocate.email}</td>
                        <td>{advocate.specialization || 'Not specified'}</td>
                        <td>{advocate.experience_years ? `${advocate.experience_years} years` : 'N/A'}</td>
                        <td>{advocate.location || 'Not specified'}</td>
                        <td>
                          <span className="rating">
                            ⭐ {advocate.rating ? advocate.rating.toFixed(1) : '0.0'} 
                            ({advocate.total_reviews || 0})
                          </span>
                        </td>
                        <td>
                          <div className="advocate-status">
                            <span className={`badge ${advocate.is_verified ? 'badge-success' : 'badge-warning'}`}>
                              {advocate.is_verified ? '✓ Verified' : '⏳ Unverified'}
                            </span>
                            <span className={`badge ${advocate.is_available ? 'badge-success' : 'badge-secondary'}`}>
                              {advocate.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className={`btn btn-sm ${advocate.is_verified ? 'btn-warning' : 'btn-success'}`}
                              onClick={() => handleVerifyAdvocate(advocate.id, advocate.is_verified)}
                              title={advocate.is_verified ? 'Unverify' : 'Verify'}
                            >
                              {advocate.is_verified ? '✗ Unverify' : '✓ Verify'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="card">
            <div className="card-header">
              <h2>All Bookings ({bookings.length})</h2>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Advocate</th>
                    <th>Date & Time</th>
                    <th>Service Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Booked On</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="no-data">No bookings found</td>
                    </tr>
                  ) : (
                    bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>#{booking.id}</td>
                        <td>
                          <div className="user-info">
                            <strong>{booking.user_name}</strong>
                            <small>{booking.user_email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="user-info">
                            <strong>{booking.advocate_name}</strong>
                            <small>{booking.advocate_email}</small>
                          </div>
                        </td>
                        <td>
                          <div className="datetime-info">
                            <strong>{formatDate(booking.booking_date)}</strong>
                            <small>{booking.booking_time}</small>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-info">
                            {booking.service_type}
                          </span>
                        </td>
                        <td>
                          <strong>{formatCurrency(booking.total_amount)}</strong>
                        </td>
                        <td>
                          <span className={`badge ${getStatusBadge(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${getPaymentBadge(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </td>
                        <td>{formatDateTime(booking.created_at)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
