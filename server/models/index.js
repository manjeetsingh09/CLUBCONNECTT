const { sequelize } = require('../config/db');
const User = require('./User');
const Club = require('./Club');
const SubBranch = require('./SubBranch');
const Request = require('./Request');
const TestBank = require('./TestBank');
const Event = require('./Event');
const Project = require('./Project');
const Message = require('./Message');
const Notification = require('./Notification');
const Quiz = require('./Quiz');
const Question = require('./Question');
const QuizResult = require('./QuizResult');

// Associations

// Club -> SubBranch (One-to-Many)
Club.hasMany(SubBranch, { foreignKey: 'clubId', as: 'subBranches' });
SubBranch.belongsTo(Club, { foreignKey: 'clubId', as: 'mainClub' });

// User -> Club (Coordinator of Main Club)
User.hasMany(Club, { foreignKey: 'coordinatorId', as: 'managedClubs' });
Club.belongsTo(User, { foreignKey: 'coordinatorId', as: 'mainCoordinator' });

// SubBranch -> User (Coordinators)
SubBranch.belongsTo(User, { foreignKey: 'coordinator1Id', as: 'coordinator1' });
SubBranch.belongsTo(User, { foreignKey: 'coordinator2Id', as: 'coordinator2' });

// Club -> Request (One-to-Many)
Club.hasMany(Request, { foreignKey: 'clubId' });
Request.belongsTo(Club, { foreignKey: 'clubId' });

// User -> Request (Requester)
User.hasMany(Request, { foreignKey: 'requesterId' });
Request.belongsTo(User, { foreignKey: 'requesterId' });

// SubBranch -> Event (One-to-Many)
SubBranch.hasMany(Event, { foreignKey: 'subBranchId' });
Event.belongsTo(SubBranch, { foreignKey: 'subBranchId' });

// Club -> Event (One-to-Many)
Club.hasMany(Event, { foreignKey: 'clubId', as: 'events' });
Event.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// SubBranch -> Project (One-to-Many)
SubBranch.hasMany(Project, { foreignKey: 'subBranchId' });
Project.belongsTo(SubBranch, { foreignKey: 'subBranchId' });

// User -> Message (One-to-Many)
User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId' });

// User -> Notification (One-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Club -> Quiz (One-to-Many)
Club.hasMany(Quiz, { foreignKey: 'clubId', as: 'quizzes' });
Quiz.belongsTo(Club, { foreignKey: 'clubId', as: 'club' });

// Quiz -> Question (One-to-Many)
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// Quiz -> QuizResult (One-to-Many)
Quiz.hasMany(QuizResult, { foreignKey: 'quizId', as: 'results' });
QuizResult.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

// User -> QuizResult (One-to-Many)
User.hasMany(QuizResult, { foreignKey: 'userId', as: 'quizResults' });
QuizResult.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Club,
  SubBranch,
  Request,
  TestBank,
  Event,
  Project,
  Message,
  Notification,
  Quiz,
  Question,
  QuizResult,
};
