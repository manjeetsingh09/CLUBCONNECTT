const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TestBank = sequelize.define('TestBank', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('TECHNICAL', 'CULTURAL', 'SOCIAL'),
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON, // Array of strings
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});

module.exports = TestBank;
