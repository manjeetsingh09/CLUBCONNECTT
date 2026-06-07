const { Quiz, Question, Club } = require('../models');

const seedQuizzes = async () => {
  try {
    const clubs = await Club.findAll();
    const roboRTU = clubs.find(c => c.name === 'RoboRTU');
    const codeRTU = clubs.find(c => c.name === 'CodeRTU');
    const cyberRTU = clubs.find(c => c.name === 'CyberRTU');

    if (roboRTU) {
      const q1 = await Quiz.create({
        clubId: roboRTU.id,
        title: 'RoboRTU Core Recruitment 2024',
        description: 'Testing technical and management skills for core robotics team.',
        timeLimit: 15,
        roleType: 'MEMBER',
        passingScore: 65
      });

      await Question.bulkCreate([
        {
          quizId: q1.id,
          text: 'Which motor is best for high precision positioning in robotics?',
          options: ['DC Motor', 'Stepper Motor', 'Servo Motor', 'AC Motor'],
          correctAnswer: 'Servo Motor',
          category: 'TECHNICAL',
          points: 10
        },
        {
          quizId: q1.id,
          text: 'How would you handle a conflict between two team members during a robot build?',
          options: ['Ignore it', 'Escalate to coordinator', 'Mediate a discussion', 'Choose a side'],
          correctAnswer: 'Mediate a discussion',
          category: 'MANAGEMENT',
          points: 10
        },
        {
          quizId: q1.id,
          text: 'If a robot moves at 2m/s, how long will it take to travel 50 meters?',
          options: ['20s', '25s', '50s', '100s'],
          correctAnswer: '25s',
          category: 'APTITUDE',
          points: 10
        },
        {
          quizId: q1.id,
          text: 'What does ROS stand for?',
          options: ['Robot Operating System', 'Real-time OS', 'Remote Operations Service', 'Robotic Open Source'],
          correctAnswer: 'Robot Operating System',
          category: 'TECHNICAL',
          points: 10
        }
      ]);
    }

    if (codeRTU) {
      const q2 = await Quiz.create({
        clubId: codeRTU.id,
        title: 'Fullstack Dev Recruitment',
        description: 'Advanced MERN stack and logic test.',
        timeLimit: 20,
        roleType: 'MEMBER',
        passingScore: 70
      });

      await Question.bulkCreate([
        {
          quizId: q2.id,
          text: 'What is the purpose of useEffect dependency array?',
          options: ['Optimization', 'Memory management', 'Controlling execution', 'Data binding'],
          correctAnswer: 'Controlling execution',
          category: 'TECHNICAL',
          points: 15
        },
        {
          quizId: q2.id,
          text: 'In an Agile sprint, what is the main goal of the retrospective?',
          options: ['Assign tasks', 'Review code', 'Process improvement', 'Demo features'],
          correctAnswer: 'Process improvement',
          category: 'MANAGEMENT',
          points: 10
        },
        {
          quizId: q2.id,
          text: 'What is the time complexity of searching in a Balanced Binary Search Tree?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
          correctAnswer: 'O(log n)',
          category: 'TECHNICAL',
          points: 15
        }
      ]);
    }

    console.log('Quizzes and Questions seeded successfully!');
  } catch (err) {
    console.error('Error seeding quizzes:', err);
  }
};

seedQuizzes();
