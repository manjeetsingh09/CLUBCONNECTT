const express = require('express');
const router = express.Router();
const { User, SubBranch, Club, Project, Event } = require('../models');
const { auth } = require('../middleware/auth');

// @route   GET /api/profile/:id
// @desc    Get user profile by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Fetch related activities (simplified)
    // In a real app, you'd have a separate Activity model
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/profile
// @desc    Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { fullName, phone, linkedin } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (linkedin) user.linkedin = linkedin;
    
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
