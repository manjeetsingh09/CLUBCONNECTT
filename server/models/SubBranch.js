const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SubBranch = sequelize.define('SubBranch', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  collegeName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING',
  },
  inventory: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  usageHistory: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = SubBranch;
