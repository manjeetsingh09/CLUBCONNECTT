const { QuizResult, User, Quiz } = require('../models');

const seedResults = async () => {
  try {
    const users = await User.findAll({ limit: 10 });
    const quizzes = await Quiz.findAll();

    if (users.length === 0 || quizzes.length === 0) {
      console.log('Ensure users and quizzes are seeded first.');
      return;
    }

    const results = [];

    // RoboRTU Results
    const roboQuiz = quizzes.find(q => q.title.includes('RoboRTU'));
    if (roboQuiz) {
      results.push(
        {
          quizId: roboQuiz.id,
          userId: users[0].id,
          score: 85,
          pointsEarned: 40,
          timeTaken: 450,
          completedAt: new Date(Date.now() - 86400000)
        },
        {
          quizId: roboQuiz.id,
          userId: users[1].id,
          score: 95,
          pointsEarned: 50,
          timeTaken: 380,
          completedAt: new Date(Date.now() - 43200000)
        },
        {
          quizId: roboQuiz.id,
          userId: users[2].id,
          score: 70,
          pointsEarned: 30,
          timeTaken: 600,
          completedAt: new Date(Date.now() - 21600000)
        }
      );
    }

    // CodeRTU Results
    const codeQuiz = quizzes.find(q => q.title.includes('Fullstack'));
    if (codeQuiz) {
      results.push(
        {
          quizId: codeQuiz.id,
          userId: users[3].id,
          score: 92,
          pointsEarned: 45,
          timeTaken: 520,
          completedAt: new Date(Date.now() - 172800000)
        },
        {
          quizId: codeQuiz.id,
          userId: users[4].id,
          score: 88,
          pointsEarned: 40,
          timeTaken: 480,
          completedAt: new Date(Date.now() - 129600000)
        },
        {
          quizId: codeQuiz.id,
          userId: users[0].id,
          score: 75,
          pointsEarned: 35,
          timeTaken: 550,
          completedAt: new Date(Date.now() - 86400000)
        }
      );
    }

    await QuizResult.bulkCreate(results);
    console.log(`Seeded ${results.length} quiz results successfully!`);
  } catch (err) {
    console.error('Error seeding results:', err);
  }
};

seedResults();
