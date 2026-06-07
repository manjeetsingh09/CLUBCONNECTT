const express = require('express');
const router = express.Router();
const { Event, Club } = require('../models');

// @route   GET /api/events
// @desc    Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [{ model: Club, as: 'club', attributes: ['name'] }],
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
