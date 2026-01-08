const express = require('express');
const router = express.Router();
const db = require('../config/db');

/**
 * GET unique specializations
 * IMPORTANT: This must be defined BEFORE the /:id route
 */
router.get('/specializations', (req, res) => {
  const query = `SELECT DISTINCT specialization FROM advocates WHERE specialization IS NOT NULL AND specialization != ''`;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch specializations' });
    }
    // Convert array of objects [{specialization: 'Civil'}] to array of strings ['Civil']
    const specializations = rows.map(row => row.specialization);
    res.json(specializations);
  });
});

/**
 * GET all advocates with FILTERS (Location, Specialization, Experience)
 */
router.get('/', (req, res) => {
  // 1. Extract query parameters
  const { specialization, location, minExperience } = req.query;

  // 2. Start with Base Query
  let sql = `
    SELECT 
      a.id, 
      a.user_id, 
      a.specialization, 
      a.location, 
      a.experience_years, 
      a.rating, 
      u.name, 
      u.email, 
      u.phone
    FROM advocates a
    JOIN users u ON a.user_id = u.id
    WHERE a.is_available = 1
  `;

  const params = [];

  // 3. Append Filters Dynamically
  if (specialization && specialization !== '') {
    sql += ` AND a.specialization = ?`;
    params.push(specialization);
  }

  if (location && location !== '') {
    // Use LIKE for partial matching (e.g., "Bang" finds "Bangalore")
    sql += ` AND a.location LIKE ?`;
    params.push(`%${location}%`); 
  }

  if (minExperience && minExperience !== '') {
    sql += ` AND a.experience_years >= ?`;
    params.push(minExperience);
  }

  // 4. Execute Query
  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch advocates' });
    }
    res.json(rows);
  });
});

/**
 * UPDATE Advocate Profile
 * Enables existing advocates to add specialization, bio, etc.
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { specialization, experience_years, location, bio, is_available } = req.body;

  const sql = `
    UPDATE advocates 
    SET 
      specialization = COALESCE(?, specialization),
      experience_years = COALESCE(?, experience_years),
      location = COALESCE(?, location),
      bio = COALESCE(?, bio),
      is_available = COALESCE(?, is_available)
    WHERE id = ?
  `;

  db.run(sql, [specialization, experience_years, location, bio, is_available, id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    res.json({ message: 'Profile updated successfully' });
  });
});

/**
 * GET advocate profile with Services and Reviews
 */
router.get('/:id', (req, res) => {
  const id = req.params.id;

  // 1. Fetch Advocate Basic Info
  const advocateQuery = `
    SELECT 
      a.*,
      u.name,
      u.email,
      u.phone
    FROM advocates a
    JOIN users u ON a.user_id = u.id
    WHERE a.id = ? OR a.user_id = ?
  `;

  // 2. Fetch Services
  const servicesQuery = `SELECT * FROM services WHERE advocate_id = ?`;

  // 3. Fetch Reviews (Join with users to get reviewer name)
  const reviewsQuery = `
    SELECT 
      r.*, 
      u.name as userName 
    FROM reviews r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.advocate_id = ?
  `;

  db.get(advocateQuery, [id, id], (err, advocate) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!advocate) {
      return res.status(404).json({ error: 'Advocate not found' });
    }

    // We found the advocate, now get their services using the advocate.id
    const advocateId = advocate.id;

    db.all(servicesQuery, [advocateId], (err, services) => {
      if (err) {
        console.error("Error fetching services:", err);
        services = [];
      }

      db.all(reviewsQuery, [advocateId], (err, reviews) => {
        if (err) {
          console.error("Error fetching reviews:", err);
          reviews = [];
        }

        // Send the complete object
        res.json({
          ...advocate,
          services: services || [],
          reviews: reviews || []
        });
      });
    });
  });
});

module.exports = router;