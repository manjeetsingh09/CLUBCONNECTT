const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Advanced permission mapping
const permissions = {
  SUPER_ADMIN: ['manage_users', 'manage_clubs', 'manage_all_events', 'approve_requests', 'view_admin'],
  CLUB_COORDINATOR: ['manage_own_club', 'manage_club_events', 'approve_requests'],
  COLLEGE_COORDINATOR: ['manage_subbranch', 'manage_subbranch_events'],
  MEMBER: ['submit_request', 'take_test']
};

const checkPermission = (action) => {
  return (req, res, next) => {
    const userPermissions = permissions[req.user.role] || [];
    if (userPermissions.includes(action) || req.user.role === 'SUPER_ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Missing required permission: ' + action });
    }
  };
};

module.exports = { auth, authorize, checkPermission };

