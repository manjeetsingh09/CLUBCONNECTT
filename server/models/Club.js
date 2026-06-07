const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Club = sequelize.define('Club', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  membersCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  subBranchesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  activeProjectsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  inventory: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
});

module.exports = Club;
