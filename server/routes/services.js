const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const db = require('../config/db');

// Get services by advocate ID (public)
router.get('/advocate/:advocateId', (req, res) => {
  db.all(
    'SELECT * FROM services WHERE advocate_id = ? AND is_active = 1',
    [req.params.advocateId],
    (err, services) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch services' });
      }
      res.json(services);
    }
  );
});

// Get logged-in advocate's own services
router.get('/my-services', auth, checkRole('advocate'), (req, res) => {
  db.get(
    'SELECT id FROM advocates WHERE user_id = ?',
    [req.user.id],
    (err, advocate) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!advocate) return res.status(404).json({ error: 'Advocate profile not found' });

      db.all(
        'SELECT * FROM services WHERE advocate_id = ? ORDER BY created_at DESC',
        [advocate.id],
        (err, services) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch services' });
          res.json(services);
        }
      );
    }
  );
});

// Create new service
router.post('/', auth, checkRole('advocate'), (req, res) => {
  const {
    title,
    description,
    service_type = 'both',
    category,
    price,
    duration_minutes,
    location
  } = req.body;

  if (!title || !description || !price || !duration_minutes) {
    return res.status(400).json({
      error: 'title, description, price, and duration_minutes are required'
    });
  }

  // Require location for offline or both
  if (service_type !== 'online' && (!location || location.trim() === '')) {
    return res.status(400).json({
      error: 'Location is required for Offline Only or Both service types'
    });
  }

  db.get(
    'SELECT id FROM advocates WHERE user_id = ?',
    [req.user.id],
    (err, advocate) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!advocate) return res.status(404).json({ error: 'Advocate profile not found' });

      const finalLocation = service_type === 'online' ? 'Online' : location.trim();

      db.run(
        `INSERT INTO services
         (advocate_id, title, description, service_type, category, price, duration_minutes, location, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          advocate.id,
          title.trim(),
          description.trim(),
          service_type,
          category?.trim() || null,
          price,
          duration_minutes,
          finalLocation
        ],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create service' });
          }
          res.status(201).json({
            message: 'Service created successfully',
            serviceId: this.lastID
          });
        }
      );
    }
  );
});

// Update service
router.put('/:id', auth, checkRole('advocate'), (req, res) => {
  const {
    title,
    description,
    service_type = 'both',
    category,
    price,
    duration_minutes,
    location,
    is_active = 1
  } = req.body;

  if (!title || !description || !price || !duration_minutes) {
    return res.status(400).json({
      error: 'title, description, price, and duration_minutes are required'
    });
  }

  if (service_type !== 'online' && (!location || location.trim() === '')) {
    return res.status(400).json({
      error: 'Location is required for Offline Only or Both service types'
    });
  }

  db.get(
    'SELECT id FROM advocates WHERE user_id = ?',
    [req.user.id],
    (err, advocate) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!advocate) return res.status(404).json({ error: 'Advocate profile not found' });

      const finalLocation = service_type === 'online' ? 'Online' : location.trim();

      db.run(
        `UPDATE services SET
          title = ?, description = ?, service_type = ?, category = ?,
          price = ?, duration_minutes = ?, location = ?, is_active = ?
         WHERE id = ? AND advocate_id = ?`,
        [
          title.trim(),
          description.trim(),
          service_type,
          category?.trim() || null,
          price,
          duration_minutes,
          finalLocation,
          is_active,
          req.params.id,
          advocate.id
        ],
        function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update service' });
          }
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Service not found or unauthorized' });
          }
          res.json({ message: 'Service updated successfully' });
        }
      );
    }
  );
});

// Delete service
router.delete('/:id', auth, checkRole('advocate'), (req, res) => {
  db.get(
    'SELECT id FROM advocates WHERE user_id = ?',
    [req.user.id],
    (err, advocate) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!advocate) return res.status(404).json({ error: 'Advocate profile not found' });

      db.run(
        'DELETE FROM services WHERE id = ? AND advocate_id = ?',
        [req.params.id, advocate.id],
        function (err) {
          if (err) return res.status(500).json({ error: 'Failed to delete service' });
          if (this.changes === 0) {
            return res.status(404).json({ error: 'Service not found or unauthorized' });
          }
          res.json({ message: 'Service deleted successfully' });
        }
      );
    }
  );
});

module.exports = router;