const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  mode: {
    type: DataTypes.ENUM('ONLINE', 'OFFLINE'),
    defaultValue: 'OFFLINE',
  },
  registrationLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Main Campus Auditorium',
  },
  speaker: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Technical Event',
  },
  pointsAwarded: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
  },
  status: {
    type: DataTypes.ENUM('UPCOMING', 'ONGOING', 'PAST'),
    defaultValue: 'UPCOMING',
  },
}, {
  timestamps: true,
});

module.exports = Event;
