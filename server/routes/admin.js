const express = require('express');
const router = express.Router();
const { User, Club, Request, Event } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users (SUPER_ADMIN only)
router.get('/users', [auth, authorize('SUPER_ADMIN')], async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
router.put('/users/:id/role', [auth, authorize('SUPER_ADMIN')], async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.role = role;
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform stats
router.get('/stats', [auth, authorize('SUPER_ADMIN')], async (req, res) => {
  try {
    const userCount = await User.count();
    const clubCount = await Club.count();
    const eventCount = await Event.count();
    const pendingRequests = await Request.count({ where: { status: 'PENDING' } });
    
    res.json({
      users: userCount,
      clubs: clubCount,
      events: eventCount,
      pendingRequests
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
