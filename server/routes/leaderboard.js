const express = require('express');
const router = express.Router();
const { SubBranch, Club } = require('../models');

// @route   GET /api/leaderboard
// @desc    Get leaderboard of sub-branches
router.get('/', async (req, res) => {
  try {
    const leaderboard = await SubBranch.findAll({
      where: { status: 'APPROVED' },
      include: [{ model: Club, as: 'mainClub', attributes: ['name'] }],
      order: [['points', 'DESC']]
    });
    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
