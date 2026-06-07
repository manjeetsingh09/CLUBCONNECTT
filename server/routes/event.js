const express = require('express');
const router = express.Router();
const { Event, Club, SubBranch } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/events
// @desc    Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      include: [
        { model: Club, attributes: ['name'] },
        { model: SubBranch, attributes: ['collegeName'] }
      ],
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/events
// @desc    Create an event (Club or College Coordinator)
router.post('/', [auth, authorize('CLUB_COORDINATOR', 'COLLEGE_COORDINATOR', 'SUPER_ADMIN')], async (req, res) => {
  try {
    const { title, description, date, mode, registrationLink, pointsAwarded, clubId, subBranchId } = req.body;
    
    const event = await Event.create({
      title,
      description,
      date,
      mode,
      registrationLink,
      pointsAwarded,
      clubId,
      subBranchId,
      status: 'UPCOMING'
    });

    res.status(201).json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
