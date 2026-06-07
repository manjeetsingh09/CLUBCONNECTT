const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  text: {
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
  category: {
    type: DataTypes.ENUM('TECHNICAL', 'MANAGEMENT', 'APTITUDE', 'GENERAL'),
    defaultValue: 'GENERAL',
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
}, {
  timestamps: true,
});

module.exports = Question;
