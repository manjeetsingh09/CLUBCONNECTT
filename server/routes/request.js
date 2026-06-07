const express = require('express');
const router = express.Router();
const { Request, Club, User, SubBranch } = require('../models');
const { auth, authorize } = require('../middleware/auth');

// @route   POST /api/requests
// @desc    Submit a sub-branch request
router.post('/', auth, async (req, res) => {
  try {
    const { clubId, type, collegeName, coordinator1Name, coordinator2Name, reason, expectedMembers } = req.body;
    
    const request = await Request.create({
      clubId,
      requesterId: req.user.id,
      type: type || 'SUB_BRANCH',
      collegeName,
      coordinator1Name,
      coordinator2Name,
      reason,
      expectedMembers,
      status: 'PENDING'
    });

    res.status(201).json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/requests
// @desc    Get all requests (for Club Coordinator of the specific club or Super Admin)
router.get('/', auth, async (req, res) => {
  try {
    let requests;
    if (req.user.role === 'SUPER_ADMIN') {
      requests = await Request.findAll({ include: [Club, { model: User, attributes: ['fullName'] }] });
    } else if (req.user.role === 'CLUB_COORDINATOR') {
      // Find clubs managed by this user
      const clubs = await Club.findAll({ where: { coordinatorId: req.user.id } });
      const clubIds = clubs.map(c => c.id);
      requests = await Request.findAll({ 
        where: { clubId: clubIds },
        include: [Club, { model: User, attributes: ['fullName'] }]
      });
    } else {
      // General user sees their own requests
      requests = await Request.findAll({ where: { requesterId: req.user.id }, include: [Club] });
    }
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/requests/:id
// @desc    Approve/Reject request
router.put('/:id', [auth, authorize('CLUB_COORDINATOR', 'SUPER_ADMIN')], async (req, res) => {
  try {
    const { status } = req.body;
    const request = await Request.findByPk(req.params.id);
    
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = status;
    await request.save();

    // If approved, create the SubBranch
    if (status === 'APPROVED') {
      // Check if sub-branch already exists
      let subBranch = await SubBranch.findOne({ 
        where: { clubId: request.clubId, collegeName: request.collegeName } 
      });

      if (!subBranch) {
        subBranch = await SubBranch.create({
          clubId: request.clubId,
          collegeName: request.collegeName,
          status: 'APPROVED',
          points: 0
        });
        
        // Update the requester's role to COLLEGE_COORDINATOR if they aren't already something higher
        const user = await User.findByPk(request.requesterId);
        if (user.role === 'MEMBER') {
          user.role = 'COLLEGE_COORDINATOR';
          await user.save();
        }

        // Link coordinators to sub-branch
        subBranch.coordinator1Id = request.requesterId;
        await subBranch.save();

        // Increment club's sub-branch count
        const club = await Club.findByPk(request.clubId);
        club.subBranchesCount += 1;
        await club.save();
      }
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
