const express = require('express');
const router = express.Router();
const { Quiz, Question, QuizResult, User, Club, TestBank, sequelize } = require('../models');
const { auth } = require('../middleware/auth');

// @route   GET /api/tests/club/:clubId
// @desc    Get all quizzes for a specific club
router.get('/club/:clubId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      where: { clubId: req.params.clubId },
      order: [['createdAt', 'DESC']]
    });
    res.json(quizzes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tests/quiz/:quizId
// @desc    Get quiz details and sanitized questions
router.get('/quiz/:quizId', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.quizId, {
      include: [{
        model: Question,
        as: 'questions',
        attributes: ['id', 'text', 'options', 'category', 'points']
      }]
    });

    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    res.json(quiz);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/tests/quiz/:quizId/submit
// @desc    Submit quiz answers and calculate score
router.post('/quiz/:quizId/submit', auth, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body;
    const quiz = await Quiz.findByPk(req.params.quizId, {
      include: [{ model: Question, as: 'questions' }]
    });

    if (!quiz) return res.status(404).json({ msg: 'Quiz not found' });

    let totalPoints = 0;
    let earnedPoints = 0;
    
    quiz.questions.forEach(q => {
      totalPoints += q.points;
      if (answers[q.id] === q.correctAnswer) {
        earnedPoints += q.points;
      }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    const passed = score >= quiz.passingScore;

    // Save result
    const result = await QuizResult.create({
      quizId: quiz.id,
      userId: req.user.id,
      score,
      pointsEarned: earnedPoints,
      timeTaken,
      completedAt: new Date()
    });

    // Update user points if passed
    if (passed) {
      const user = await User.findByPk(req.user.id);
      user.points += earnedPoints;
      await user.save();
    }

    res.json({ result, passed, score });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/tests/club/:clubId/leaderboard
// @desc    Get club-specific ranking based on quiz results
router.get('/club/:clubId/leaderboard', auth, async (req, res) => {
  try {
    const results = await QuizResult.findAll({
      include: [
        {
          model: Quiz,
          as: 'quiz',
          where: { clubId: req.params.clubId },
          attributes: []
        },
        {
          model: User,
          as: 'user',
          attributes: ['fullName', 'email', 'collegeName']
        }
      ],
      attributes: [
        'userId',
        [sequelize.fn('SUM', sequelize.col('pointsEarned')), 'totalPoints'],
        [sequelize.fn('AVG', sequelize.col('score')), 'avgScore']
      ],
      group: ['userId', 'user.id'],
      order: [[sequelize.literal('totalPoints'), 'DESC']],
      limit: 10
    });

    res.json(results);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// LEGACY ROUTES (Keeping for compatibility if needed)
router.get('/questions/:type', auth, async (req, res) => {
  try {
    const questions = await TestBank.findAll({ 
      where: { type: req.params.type.toUpperCase() },
      limit: 15
    });
    const sanitized = questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));
    res.json(sanitized);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
