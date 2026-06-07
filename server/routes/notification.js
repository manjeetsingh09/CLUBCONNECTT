const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const { auth } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    
    notification.isRead = true;
    await notification.save();
    
    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/notifications
// @desc    Clear all notifications
router.delete('/', auth, async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.user.id }
    });
    res.json({ message: 'Notifications cleared' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
