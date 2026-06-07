const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const QuizResult = sequelize.define('QuizResult', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  quizId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pointsEarned: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  timeTaken: {
    type: DataTypes.INTEGER, // in seconds
    allowNull: true,
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = QuizResult;
