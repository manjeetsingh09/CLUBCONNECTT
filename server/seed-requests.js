const { Request } = require('./models');
const { sequelize } = require('./config/db');

const requests = [
  {
    clubId: '8ca43a46-f912-40e2-9dcb-1d7016086441',
    requesterId: 'c051cc5e-3995-42af-ad7a-b2aa956626d6',
    collegeName: 'SKIT Jaipur',
    coordinator1Name: 'Rahul Sharma',
    coordinator2Name: 'Priya Verma',
    reason: 'To establish a tech-driven community in SKIT and leverage the RTU network for better placements and skill development.',
    expectedMembers: 120,
    type: 'SUB_BRANCH',
    status: 'PENDING'
  },
  {
    clubId: '8ca43a46-f912-40e2-9dcb-1d7016086441',
    requesterId: 'c051cc5e-3995-42af-ad7a-b2aa956626d6',
    collegeName: 'JECRC Foundation',
    coordinator1Name: 'Amit Meena',
    coordinator2Name: 'Soniya Gupta',
    reason: 'Collaboration for an upcoming inter-college hackathon "CODE_STORM 2024". We need technical mentorship and outreach support.',
    expectedMembers: 300,
    type: 'COLLABORATION',
    status: 'PENDING'
  },
  {
    clubId: '8ca43a46-f912-40e2-9dcb-1d7016086441',
    requesterId: 'c051cc5e-3995-42af-ad7a-b2aa956626d6',
    collegeName: 'Poornima College of Engineering',
    coordinator1Name: 'Vikram Singh',
    coordinator2Name: 'Anjali Das',
    reason: 'Requesting to open a specialized AI/ML branch of the club to cater to the growing interest in our college.',
    expectedMembers: 80,
    type: 'SUB_BRANCH',
    status: 'UNDER_REVIEW'
  },
  {
    clubId: '8ca43a46-f912-40e2-9dcb-1d7016086441',
    requesterId: 'c051cc5e-3995-42af-ad7a-b2aa956626d6',
    collegeName: 'Global Institute of Technology',
    coordinator1Name: 'Aryan Khan',
    reason: 'Looking to organize a joint workshop on Cyber Security.',
    expectedMembers: 150,
    type: 'COLLABORATION',
    status: 'REJECTED'
  },
  {
    clubId: '8ca43a46-f912-40e2-9dcb-1d7016086441',
    requesterId: 'c051cc5e-3995-42af-ad7a-b2aa956626d6',
    collegeName: 'Pacific University Udaipur',
    coordinator1Name: 'Manish Soni',
    coordinator2Name: 'Divya Rajawat',
    reason: 'Expansion of the design wing to the lake city.',
    expectedMembers: 200,
    type: 'SUB_BRANCH',
    status: 'APPROVED'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    // Sync models to update schema (add 'type' column)
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
    
    // Clear existing requests to avoid duplicates during testing
    await Request.destroy({ where: {}, truncate: true, cascade: true });
    
    await Request.bulkCreate(requests);
    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
