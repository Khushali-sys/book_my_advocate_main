-- ===================================================
-- BookMyAdvocate Database Setup
-- Complete SQL Script to Create Tables and Sample Data
-- ===================================================

-- Create database
CREATE DATABASE IF NOT EXISTS bookmyadvocate;
USE bookmyadvocate;

-- ===================================================
-- TABLE CREATION
-- ===================================================

-- 1. Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('user', 'advocate', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Advocates Table
DROP TABLE IF EXISTS advocates;
CREATE TABLE advocates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNIQUE NOT NULL,
  specialization VARCHAR(255),
  experience_years INT,
  bar_council_number VARCHAR(100) UNIQUE,
  license_number VARCHAR(100),
  location VARCHAR(255),
  bio TEXT,
  hourly_rate DECIMAL(10, 2),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_specialization (specialization),
  INDEX idx_location (location),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Services Table
DROP TABLE IF EXISTS services;
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  advocate_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  service_type ENUM('online', 'offline', 'both') DEFAULT 'both',
  category VARCHAR(100),
  price DECIMAL(10, 2),
  duration_minutes INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE,
  INDEX idx_advocate (advocate_id),
  INDEX idx_category (category),
  INDEX idx_service_type (service_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Bookings Table
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  advocate_id INT NOT NULL,
  service_id INT,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  service_type ENUM('online', 'offline') NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_user (user_id),
  INDEX idx_advocate (advocate_id),
  INDEX idx_status (status),
  INDEX idx_booking_date (booking_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Reviews Table
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNIQUE NOT NULL,
  user_id INT NOT NULL,
  advocate_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE,
  INDEX idx_advocate (advocate_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================================================
-- SAMPLE DATA INSERTION
-- ===================================================

-- Insert Admin User
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@bookmyadvocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9999999999', 'admin');

-- Insert Sample Users
INSERT INTO users (name, email, password, phone, role) VALUES
('John Doe', 'john@example.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543210', 'user'),
('Jane Smith', 'jane@example.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543211', 'user'),
('Robert Johnson', 'robert@example.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543212', 'user');

-- Insert Sample Advocates (Users)
INSERT INTO users (name, email, password, phone, role) VALUES
('Advocate Rajesh Kumar', 'rajesh@advocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543220', 'advocate'),
('Advocate Priya Sharma', 'priya@advocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543221', 'advocate'),
('Advocate Amit Patel', 'amit@advocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543222', 'advocate'),
('Advocate Sunita Reddy', 'sunita@advocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543223', 'advocate'),
('Advocate Vikram Singh', 'vikram@advocate.com', '$2a$10$8K1p/a0dL3LRLxv1bHOlZOcKSvPT1lHFk4PnZ0TfWZuNr5mYK/Nwi', '9876543224', 'advocate');

-- Insert Advocate Profiles
INSERT INTO advocates (user_id, specialization, experience_years, bar_council_number, license_number, location, bio, hourly_rate, rating, total_reviews, is_verified, is_available) VALUES
(5, 'Criminal Law', 15, 'BAR/DL/2008/12345', 'LIC12345', 'New Delhi', 'Experienced criminal lawyer with 15+ years of practice in handling complex criminal cases. Specializes in bail matters, trials, and appeals.', 5000.00, 4.8, 25, TRUE, TRUE),
(6, 'Corporate Law', 12, 'BAR/MH/2011/23456', 'LIC23456', 'Mumbai', 'Expert in corporate law, mergers & acquisitions, company formation, and compliance. Worked with numerous startups and established companies.', 6000.00, 4.9, 30, TRUE, TRUE),
(7, 'Family Law', 10, 'BAR/KA/2013/34567', 'LIC34567', 'Bangalore', 'Specialized in family law matters including divorce, child custody, property disputes, and maintenance cases. Compassionate approach to sensitive family issues.', 4000.00, 4.7, 20, TRUE, TRUE),
(8, 'Property Law', 8, 'BAR/TN/2015/45678', 'LIC45678', 'Chennai', 'Expert in property disputes, real estate transactions, title verification, and property registration. Extensive experience in both residential and commercial properties.', 4500.00, 4.6, 18, TRUE, TRUE),
(9, 'Civil Litigation', 7, 'BAR/UP/2016/56789', 'LIC56789', 'Noida', 'Handles all types of civil litigation including contract disputes, property cases, and consumer matters. Known for quick resolution of cases.', 3500.00, 4.5, 15, FALSE, TRUE);

-- Insert Services for Advocates
INSERT INTO services (advocate_id, title, description, service_type, category, price, duration_minutes, is_active) VALUES
-- Rajesh Kumar's Services (Criminal Law)
(1, 'Criminal Case Consultation', 'Initial consultation for criminal cases including assessment and legal strategy', 'both', 'Criminal Law', 3000.00, 60, TRUE),
(1, 'Bail Application', 'Complete bail application preparation and court representation', 'offline', 'Criminal Law', 15000.00, 120, TRUE),
(1, 'Trial Representation', 'Full trial representation in criminal cases', 'offline', 'Criminal Law', 50000.00, 240, TRUE),

-- Priya Sharma's Services (Corporate Law)
(2, 'Company Registration', 'Complete company incorporation services including documentation', 'both', 'Corporate Law', 20000.00, 90, TRUE),
(2, 'Legal Compliance Audit', 'Comprehensive legal compliance review for companies', 'both', 'Corporate Law', 25000.00, 120, TRUE),
(2, 'Contract Drafting', 'Professional contract drafting and review services', 'online', 'Corporate Law', 10000.00, 60, TRUE),

-- Amit Patel's Services (Family Law)
(3, 'Divorce Consultation', 'Initial consultation for divorce and separation matters', 'both', 'Family Law', 2500.00, 60, TRUE),
(3, 'Child Custody Case', 'Legal representation in child custody disputes', 'offline', 'Family Law', 30000.00, 90, TRUE),
(3, 'Property Settlement', 'Assistance with property division in divorce cases', 'both', 'Family Law', 20000.00, 90, TRUE),

-- Sunita Reddy's Services (Property Law)
(4, 'Property Title Verification', 'Comprehensive property title search and verification', 'both', 'Property Law', 8000.00, 60, TRUE),
(4, 'Property Registration Assistance', 'Complete assistance with property registration process', 'offline', 'Property Law', 15000.00, 120, TRUE),
(4, 'Property Dispute Resolution', 'Legal representation in property dispute cases', 'offline', 'Property Law', 35000.00, 120, TRUE),

-- Vikram Singh's Services (Civil Litigation)
(5, 'Civil Case Consultation', 'Initial consultation for civil litigation matters', 'both', 'Civil Litigation', 2000.00, 45, TRUE),
(5, 'Contract Dispute Resolution', 'Legal representation in contract dispute cases', 'offline', 'Civil Litigation', 25000.00, 90, TRUE),
(5, 'Consumer Court Representation', 'Representation in consumer court cases', 'offline', 'Consumer Law', 10000.00, 60, TRUE);

-- Insert Sample Bookings
INSERT INTO bookings (user_id, advocate_id, service_id, booking_date, booking_time, service_type, status, payment_status, total_amount, notes) VALUES
(2, 1, 1, '2025-01-15', '10:00:00', 'online', 'confirmed', 'paid', 3000.00, 'Need urgent consultation for a criminal case'),
(3, 2, 4, '2025-01-16', '14:00:00', 'offline', 'pending', 'pending', 20000.00, 'Want to register a new company'),
(4, 3, 7, '2025-01-17', '11:00:00', 'online', 'confirmed', 'paid', 2500.00, 'Seeking divorce consultation'),
(2, 4, 10, '2025-01-10', '15:00:00', 'offline', 'completed', 'paid', 8000.00, 'Property verification needed'),
(3, 5, 13, '2025-01-12', '10:30:00', 'online', 'completed', 'paid', 2000.00, 'Civil case discussion');

-- Insert Sample Reviews (for completed bookings)
INSERT INTO reviews (booking_id, user_id, advocate_id, rating, comment) VALUES
(4, 2, 4, 5, 'Excellent service! Very thorough property verification. Highly recommended.'),
(5, 3, 5, 4, 'Good consultation. Helped me understand my legal options clearly.');

-- Update advocate ratings based on reviews
UPDATE advocates SET rating = 4.8, total_reviews = 25 WHERE id = 1;
UPDATE advocates SET rating = 4.9, total_reviews = 30 WHERE id = 2;
UPDATE advocates SET rating = 4.7, total_reviews = 20 WHERE id = 3;
UPDATE advocates SET rating = 4.6, total_reviews = 18 WHERE id = 4;
UPDATE advocates SET rating = 4.5, total_reviews = 15 WHERE id = 5;

-- ===================================================
-- VERIFICATION QUERIES
-- ===================================================

-- Verify all tables are created
SELECT 'Tables Created:' AS Status;
SHOW TABLES;

-- Count records in each table
SELECT 'users' AS table_name, COUNT(*) AS record_count FROM users
UNION ALL
SELECT 'advocates', COUNT(*) FROM advocates
UNION ALL
SELECT 'services', COUNT(*) FROM services
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews;

-- Display sample data
SELECT 'Sample Users:' AS Info;
SELECT id, name, email, role FROM users;

SELECT 'Sample Advocates:' AS Info;
SELECT a.id, u.name, a.specialization, a.location, a.rating, a.is_verified 
FROM advocates a 
JOIN users u ON a.user_id = u.id;

SELECT 'Sample Services:' AS Info;
SELECT s.id, u.name AS advocate_name, s.title, s.price, s.service_type 
FROM services s 
JOIN advocates a ON s.advocate_id = a.id 
JOIN users u ON a.user_id = u.id;

-- ===================================================
-- DEFAULT CREDENTIALS
-- ===================================================
-- Admin Login:
--   Email: admin@bookmyadvocate.com
--   Password: admin123
--
-- All demo users/advocates password: admin123
-- ===================================================

-- Success message
SELECT '✓ Database setup completed successfully!' AS Status;
SELECT '✓ All tables created with sample data' AS Status;
SELECT '✓ Admin account created: admin@bookmyadvocate.com / admin123' AS Status;
