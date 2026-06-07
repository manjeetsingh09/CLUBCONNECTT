const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  clubId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timeLimit: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 20,
  },
  roleType: {
    type: DataTypes.ENUM('MEMBER', 'COORDINATOR'),
    defaultValue: 'MEMBER',
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
  },
}, {
  timestamps: true,
});

module.exports = Quiz;
