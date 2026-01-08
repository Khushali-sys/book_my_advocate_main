import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdvocateRegister from './pages/AdvocateRegister';
import SearchAdvocates from './pages/SearchAdvocates';
import AdvocateDetails from './pages/AdvocateDetails';
import UserDashboard from './pages/UserDashboard';
import AdvocateDashboard from './pages/AdvocateDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/advocate-register" element={<AdvocateRegister />} />
            <Route path="/search" element={<SearchAdvocates />} />
            <Route path="/advocate/:id" element={<AdvocateDetails />} />
            
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <UserDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/advocate-dashboard" 
              element={
                <PrivateRoute role="advocate">
                  <AdvocateDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/admin-dashboard" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/my-bookings" 
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
