const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const db = require('../config/db');

// Create booking (user only)
router.post('/', auth, checkRole('user'), (req, res) => {
  const { advocate_id, service_id, booking_date, booking_time, service_type, notes } = req.body;

  if (!advocate_id || !booking_date || !booking_time || !service_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let total_amount = 0;

  const insertBooking = () => {
    db.run(
      `INSERT INTO bookings
      (user_id, advocate_id, service_id, booking_date, booking_time, service_type, total_amount, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        advocate_id,
        service_id || null,
        booking_date,
        booking_time,
        service_type,
        total_amount,
        notes || null
      ],
      function (err) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to create booking' });
        }

        res.status(201).json({
          message: 'Booking created successfully',
          bookingId: this.lastID
        });
      }
    );
  };

  if (service_id) {
    db.get('SELECT price FROM services WHERE id = ?', [service_id], (err, service) => {
      if (service) total_amount = service.price;
      insertBooking();
    });
  } else {
    db.get('SELECT hourly_rate FROM advocates WHERE id = ?', [advocate_id], (err, advocate) => {
      if (advocate) total_amount = advocate.hourly_rate;
      insertBooking();
    });
  }
});

// User bookings
router.get('/my-bookings', auth, checkRole('user'), (req, res) => {
  db.all(
    `SELECT b.*, s.title AS service_title
     FROM bookings b
     LEFT JOIN services s ON b.service_id = s.id
     WHERE b.user_id = ?
     ORDER BY b.booking_date DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch bookings' });
      res.json(rows);
    }
  );
});

// Advocate bookings
router.get('/advocate-bookings', auth, checkRole('advocate'), (req, res) => {
  db.get(
    'SELECT id FROM advocates WHERE user_id = ?',
    [req.user.id],
    (err, advocate) => {
      if (!advocate) return res.status(404).json({ error: 'Advocate not found' });

      db.all(
        'SELECT * FROM bookings WHERE advocate_id = ? ORDER BY booking_date DESC',
        [advocate.id],
        (err, rows) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch bookings' });
          res.json(rows);
        }
      );
    }
  );
});

module.exports = router;
