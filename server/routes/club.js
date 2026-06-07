const express = require('express');
const router = express.Router();
const { Club, SubBranch, User } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// @route   GET /api/clubs
// @desc    Get all main clubs
router.get('/', async (req, res) => {
  try {
    const clubs = await Club.findAll({
      include: [
        { model: User, as: 'mainCoordinator', attributes: ['fullName', 'email'] },
        { model: SubBranch, as: 'subBranches' }
      ]
    });
    res.json(clubs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/clubs/:id
// @desc    Get club by ID
router.get('/:id', async (req, res) => {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: [
        { model: User, as: 'mainCoordinator', attributes: ['fullName', 'email'] },
        { model: SubBranch, as: 'subBranches', include: [
          { model: User, as: 'coordinator1', attributes: ['fullName'] },
          { model: User, as: 'coordinator2', attributes: ['fullName'] }
        ]}
      ]
    });
    if (!club) return res.status(404).json({ message: 'Club not found' });

    // Normalize: ensure JSON fields are parsed objects (SQLite may return strings)
    const clubJson = club.toJSON();
    clubJson.inventory = typeof clubJson.inventory === 'string' ? JSON.parse(clubJson.inventory) : (clubJson.inventory || []);
    if (clubJson.subBranches) {
      clubJson.subBranches = clubJson.subBranches.map(branch => ({
        ...branch,
        inventory: typeof branch.inventory === 'string' ? JSON.parse(branch.inventory) : (branch.inventory || []),
        usageHistory: typeof branch.usageHistory === 'string' ? JSON.parse(branch.usageHistory) : (branch.usageHistory || [])
      }));
    }
    res.json(clubJson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/clubs
// @desc    Create a new main club (Super Admin only)
router.post('/', [auth, authorize('SUPER_ADMIN')], async (req, res) => {
  try {
    const { name, domain, description, coordinatorId } = req.body;
    const club = await Club.create({ name, domain, description, coordinatorId });
    res.status(201).json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/clubs/:id/inventory
// @desc    Update club inventory
router.put('/:id/inventory', [auth, authorize('SUPER_ADMIN', 'CLUB_COORDINATOR')], async (req, res) => {
  try {
    const { inventory } = req.body;
    const club = await Club.findByPk(req.params.id);
    
    if (!club) return res.status(404).json({ message: 'Club not found' });
    
    // Safety check: CLUB_COORDINATOR only manages their own club
    if (req.user.role === 'CLUB_COORDINATOR' && club.coordinatorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to manage this club inventory' });
    }
    
    club.inventory = inventory;
    await club.save();
    
    res.json(club);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

