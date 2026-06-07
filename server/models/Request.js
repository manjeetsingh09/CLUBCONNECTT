const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  collegeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinator1Name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coordinator2Name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  expectedMembers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.ENUM('SUB_BRANCH', 'COLLABORATION'),
    defaultValue: 'SUB_BRANCH',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
}, {
  timestamps: true,
});

module.exports = Request;
