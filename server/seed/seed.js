const { sequelize, User, Club, SubBranch, TestBank, Event, Message } = require('../models');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    // Sync database (force: true will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('Database synced for seeding.');

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);

    // 1. Create Main RTU Admin (Human Name)
    const superAdmin = await User.create({
      fullName: 'Prof. Aditya Vardhan',
      email: 'admin@rtu.ac.in',
      password: hashedPass,
      collegeName: 'Rajasthan Technical University, Kota',
      branch: 'Administration',
      year: 2024,
      role: 'SUPER_ADMIN',
      profileId: 'RTU-ADMIN-001',
      points: 2500,
      testScore: 100
    });

    // 2. Create Club Coordinators
    const coord0 = await User.create({ fullName: 'Arjun Sharma', email: 'arjun@rtu.ac.in', password: hashedPass, collegeName: 'RTU Kota', branch: 'CSIT', year: 3, role: 'CLUB_COORDINATOR', profileId: 'RTU-2024-CSIT-ARJUN', points: 1850, testScore: 97 });
    const coord1 = await User.create({ fullName: 'Priya Meena', email: 'priya@rtu.ac.in', password: hashedPass, collegeName: 'RTU Kota', branch: 'ECE', year: 4, role: 'CLUB_COORDINATOR', profileId: 'RTU-2024-ECE-PRIYA', points: 1420, testScore: 91 });
    const coord2 = await User.create({ fullName: 'Sneha Gupta', email: 'sneha@rtu.ac.in', password: hashedPass, collegeName: 'RTU Kota', branch: 'Design', year: 2, role: 'CLUB_COORDINATOR', profileId: 'RTU-2024-DSGN-SNEHA', points: 980, testScore: 88 });
    const coord3 = await User.create({ fullName: 'Rahul Joshi', email: 'rahul@rtu.ac.in', password: hashedPass, collegeName: 'RTU Kota', branch: 'Civil', year: 3, role: 'CLUB_COORDINATOR', profileId: 'RTU-2024-CIVL-RAHUL', points: 1100, testScore: 84 });
    const coord4 = await User.create({ fullName: 'Ananya Singh', email: 'ananya@rtu.ac.in', password: hashedPass, collegeName: 'RTU Kota', branch: 'ME', year: 4, role: 'CLUB_COORDINATOR', profileId: 'RTU-2024-MECH-ANANYA', points: 1640, testScore: 93 });
    const coordinators = [coord0, coord1, coord2, coord3, coord4];

    // 3. Create Main Clubs
    const clubsData = [
      { 
        name: 'CodeRTU', 
        domain: 'Competitive Programming & Development', 
        description: 'Central hub for coding enthusiasts across RTU colleges. Weekly contests, open-source sprints, and mentorship programs.', 
        coordinatorId: coordinators[0].id, 
        membersCount: 1250, 
        subBranchesCount: 8, 
        activeProjectsCount: 45,
        inventory: [
          { id: '1', name: 'MacBook Pro M2', category: 'Hardware', quantity: 5, status: 'Checked Out', lastUsedBy: 'Abhishek Sharma (RTU-2024-MBR-1000)' },
          { id: '2', name: 'Raspberry Pi 4', category: 'IoT', quantity: 15, status: 'Available', lastUsedBy: 'N/A' },
          { id: '3', name: 'Aptitude Test Bank', category: 'Resources', quantity: 50, status: 'Digital', lastUsedBy: 'Riya Verma (RTU-2024-MBR-1001)' }
        ]
      },
      { 
        name: 'RoboRTU', 
        domain: 'Robotics & IoT', 
        description: 'Exploring the future of automation and hardware. Build drones, smart systems, and compete in national robotics championships.', 
        coordinatorId: coordinators[1].id, 
        membersCount: 840, 
        subBranchesCount: 5, 
        activeProjectsCount: 22,
        inventory: [
          { id: '4', name: 'Lidar Sensor V2', category: 'Electronics', quantity: 3, status: 'In Use', lastUsedBy: 'Karan Singh (RTU-2024-MBR-1002)' },
          { id: '5', name: 'Drone Frame Kit', category: 'Mechanical', quantity: 8, status: 'Available', lastUsedBy: 'Ishita Meena (RTU-2024-MBR-1003)' },
          { id: '6', name: 'Arduino Mega', category: 'Electronics', quantity: 20, status: 'Available', lastUsedBy: 'Yash Gupta (RTU-2024-MBR-1004)' }
        ]
      },
      { 
        name: 'DesignRTU', 
        domain: 'UI/UX & Graphic Design', 
        description: 'Creativity meets technology. Figma workshops, design sprints, and portfolio reviews with industry mentors.', 
        coordinatorId: coordinators[2].id, 
        membersCount: 560, 
        subBranchesCount: 4, 
        activeProjectsCount: 15,
        inventory: [
          { id: '7', name: 'Wacom Intuos Pro', category: 'Hardware', quantity: 4, status: 'Checked Out', lastUsedBy: 'Tanvi Joshi (RTU-2024-MBR-1005)' },
          { id: '8', name: 'Pantone Library', category: 'Print', quantity: 2, status: 'In Lab', lastUsedBy: 'Sahil Sharma (RTU-2024-MBR-1006)' }
        ]
      },
      { 
        name: 'GreenRTU', 
        domain: 'Environmental & Social Impact', 
        description: 'Sustainability and social service initiatives. Solar projects, waste management tech, and community outreach.', 
        coordinatorId: coordinators[3].id, 
        membersCount: 920, 
        subBranchesCount: 3, 
        activeProjectsCount: 30,
        inventory: [
          { id: '9', name: 'Solar Panels 100W', category: 'Energy', quantity: 10, status: 'Project Site', lastUsedBy: 'Mannat Verma (RTU-2024-MBR-1007)' },
          { id: '10', name: 'Soil PH Sensors', category: 'Research', quantity: 25, status: 'Available', lastUsedBy: 'Siddharth Singh (RTU-2024-MBR-1008)' }
        ]
      },
      { 
        name: 'CultuRTU', 
        domain: 'Cultural & Arts', 
        description: 'Showcasing the talent and heritage of RTU students through digital art, music production, and cultural festivals.', 
        coordinatorId: coordinators[4].id, 
        membersCount: 1100, 
        subBranchesCount: 6, 
        activeProjectsCount: 18,
        inventory: [
          { id: '11', name: 'Focusrite Audio Interface', category: 'Music', quantity: 2, status: 'Checked Out', lastUsedBy: 'Avani Meena (RTU-2024-MBR-1009)' },
          { id: '12', name: 'Professional DSLR', category: 'Photography', quantity: 3, status: 'In Use', lastUsedBy: 'Varun Gupta (RTU-2024-MBR-1010)' }
        ]
      },
      { name: 'CyberRTU', domain: 'Cybersecurity & Ethical Hacking', description: 'Red team exercises, CTF competitions, bug bounty hunting, and security audit workshops for aspiring white-hat hackers.', coordinatorId: coordinators[0].id, membersCount: 680, subBranchesCount: 3, activeProjectsCount: 12, inventory: [] },
      { name: 'DataRTU', domain: 'Data Science & AI/ML', description: 'From Kaggle competitions to real-world ML deployments. Learn neural networks, NLP, and computer vision with hands-on labs.', coordinatorId: coordinators[1].id, membersCount: 970, subBranchesCount: 6, activeProjectsCount: 28, inventory: [] },
      { name: 'BlockRTU', domain: 'Blockchain & Web3', description: 'Smart contracts, DeFi protocols, and decentralized apps. Building the future of trustless technology on Ethereum and Solana.', coordinatorId: coordinators[2].id, membersCount: 420, subBranchesCount: 2, activeProjectsCount: 8, inventory: [] },
      { name: 'GameDevRTU', domain: 'Game Development & XR', description: 'Unity, Unreal Engine, and AR/VR experiences. Join game jams, build immersive worlds, and learn 3D rendering pipelines.', coordinatorId: coordinators[3].id, membersCount: 510, subBranchesCount: 3, activeProjectsCount: 14, inventory: [] },
      { name: 'SpaceRTU', domain: 'Aerospace & Rocketry', description: 'Model rocketry, satellite communication, and space tech research. Partnered with ISRO student outreach programs.', coordinatorId: coordinators[4].id, membersCount: 340, subBranchesCount: 2, activeProjectsCount: 6, inventory: [] }
    ];

    const clubs = [];
    for (const clubData of clubsData) {
      clubs.push(await Club.create(clubData));
    }

    // 4. Detailed Affiliated Colleges Data
    const colleges = [
      "Arya College of Engineering, Jaipur",
      "Poornima Institute of Engineering, Jaipur",
      "Global Institute of Technology, Jaipur",
      "Swami Keshvanand Institute of Technology (SKIT)",
      "Jaipur Engineering College and Research Centre (JECRC)",
      "Anand International College of Engineering",
      "Rajasthan Institute of Engineering and Technology (RIET)",
      "Maharishi Arvind Institute of Engineering",
      "Shankara Institute of Technology",
      "Bikaner Technical University College",
      "Pacific University, Udaipur",
      "Jodhpur Institute of Engineering (JIET)"
    ];

    // 5. Create Sub-Branch Coordinators (College level)
    const cc0 = await User.create({ fullName: 'Vikram Patel', email: 'vikram@arya.ac.in', password: hashedPass, collegeName: colleges[0], branch: 'CS', year: 4, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-CS-VIKRAM', points: 780, testScore: 85 });
    const cc1 = await User.create({ fullName: 'Rohan Das', email: 'rohan@poornima.org', password: hashedPass, collegeName: colleges[1], branch: 'IT', year: 3, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-IT-ROHAN', points: 595, testScore: 78 });
    const cc2 = await User.create({ fullName: 'Amit Verma', email: 'amit@global.edu', password: hashedPass, collegeName: colleges[2], branch: 'ECE', year: 4, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-ECE-AMIT', points: 870, testScore: 92 });
    const cc3 = await User.create({ fullName: 'Sanjay Tak', email: 'sanjay@skit.ac.in', password: hashedPass, collegeName: colleges[3], branch: 'ME', year: 3, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-ME-SANJAY', points: 1020, testScore: 88 });
    const cc4 = await User.create({ fullName: 'Neha Sharma', email: 'neha@jecrc.ac.in', password: hashedPass, collegeName: colleges[4], branch: 'AI', year: 2, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-AI-NEHA', points: 950, testScore: 95 });
    const cc5 = await User.create({ fullName: 'Deepak Rao', email: 'deepak@anand.edu', password: hashedPass, collegeName: colleges[5], branch: 'CS', year: 3, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-CS-DEEPAK', points: 610, testScore: 72 });
    const cc6 = await User.create({ fullName: 'Simran Kaur', email: 'simran@pacific.ac.in', password: hashedPass, collegeName: colleges[10], branch: 'UX', year: 2, role: 'COLLEGE_COORDINATOR', profileId: 'RTU-2024-UX-SIMRAN', points: 460, testScore: 82 });
    const collegeCoords = [cc0, cc1, cc2, cc3, cc4, cc5, cc6];

    // 6. Create Sub-Branches with inventory and usage history
    await SubBranch.bulkCreate([
      { 
        clubId: clubs[0].id, collegeName: colleges[0], coordinator1Id: collegeCoords[0].id, points: 780, status: 'APPROVED',
        inventory: [
          { id: 'sb1-1', name: 'Dell Inspiron Laptops', category: 'Hardware', quantity: 8 },
          { id: 'sb1-2', name: 'VS Code License Pack', category: 'Software', quantity: 30 },
          { id: 'sb1-3', name: 'LAN Switch 24-Port', category: 'Networking', quantity: 2 }
        ],
        usageHistory: [
          { member: 'Abhishek Sharma', profileId: 'RTU-2024-MBR-1000', item: 'Dell Inspiron Laptops', action: 'Checked Out', date: '2024-04-02', purpose: 'Hackathon Prep' },
          { member: 'Riya Verma', profileId: 'RTU-2024-MBR-1001', item: 'VS Code License Pack', action: 'Activated', date: '2024-04-05', purpose: 'Project Development' },
          { member: 'Karan Singh', profileId: 'RTU-2024-MBR-1002', item: 'Dell Inspiron Laptops', action: 'Returned', date: '2024-04-10', purpose: 'Project Complete' }
        ]
      },
      { 
        clubId: clubs[0].id, collegeName: colleges[1], coordinator1Id: collegeCoords[1].id, points: 595, status: 'APPROVED',
        inventory: [
          { id: 'sb2-1', name: 'Raspberry Pi 4 (8GB)', category: 'IoT', quantity: 12 },
          { id: 'sb2-2', name: 'Raspberry Pi Camera V3', category: 'Electronics', quantity: 6 },
          { id: 'sb2-3', name: 'Breadboard Kit', category: 'Electronics', quantity: 25 }
        ],
        usageHistory: [
          { member: 'Ishita Meena', profileId: 'RTU-2024-MBR-1003', item: 'Raspberry Pi 4 (8GB)', action: 'Checked Out', date: '2024-03-28', purpose: 'Smart Plant Monitor Project' },
          { member: 'Yash Gupta', profileId: 'RTU-2024-MBR-1004', item: 'Breadboard Kit', action: 'Checked Out', date: '2024-04-01', purpose: 'Electronics Workshop Demo' },
          { member: 'Tanvi Joshi', profileId: 'RTU-2024-MBR-1005', item: 'Raspberry Pi Camera V3', action: 'Returned', date: '2024-04-08', purpose: 'Event Completed' }
        ]
      },
      { 
        clubId: clubs[1].id, collegeName: colleges[2], coordinator1Id: collegeCoords[2].id, points: 870, status: 'APPROVED',
        inventory: [
          { id: 'sb3-1', name: 'Servo Motor Pack (SG90)', category: 'Mechanical', quantity: 40 },
          { id: 'sb3-2', name: 'Arduino Uno R3', category: 'Electronics', quantity: 18 },
          { id: 'sb3-3', name: 'Soldering Station', category: 'Tools', quantity: 4 },
          { id: 'sb3-4', name: 'Ultrasonic Sensor HC-SR04', category: 'Electronics', quantity: 20 }
        ],
        usageHistory: [
          { member: 'Sahil Sharma', profileId: 'RTU-2024-MBR-1006', item: 'Servo Motor Pack (SG90)', action: 'Checked Out', date: '2024-03-15', purpose: 'Robo-Soccer Bot Build' },
          { member: 'Mannat Verma', profileId: 'RTU-2024-MBR-1007', item: 'Soldering Station', action: 'In Use', date: '2024-04-09', purpose: 'PCB Prototype Assembly' },
          { member: 'Siddharth Singh', profileId: 'RTU-2024-MBR-1008', item: 'Arduino Uno R3', action: 'Returned', date: '2024-03-30', purpose: 'Obstacle Avoidance Bot' },
          { member: 'Avani Meena', profileId: 'RTU-2024-MBR-1009', item: 'Ultrasonic Sensor HC-SR04', action: 'Checked Out', date: '2024-04-11', purpose: 'Parking System Project' }
        ]
      },
      { 
        clubId: clubs[0].id, collegeName: colleges[3], coordinator1Id: collegeCoords[3].id, points: 1020, status: 'APPROVED',
        inventory: [
          { id: 'sb4-1', name: 'HP Monitor 24"', category: 'Hardware', quantity: 6 },
          { id: 'sb4-2', name: 'Mechanical Keyboard', category: 'Peripherals', quantity: 10 },
          { id: 'sb4-3', name: 'Docker Lab Server', category: 'Server', quantity: 1 }
        ],
        usageHistory: [
          { member: 'Varun Gupta', profileId: 'RTU-2024-MBR-1010', item: 'Docker Lab Server', action: 'Accessed', date: '2024-04-04', purpose: 'Cloud Native Training' },
          { member: 'Kavya Joshi', profileId: 'RTU-2024-MBR-1011', item: 'HP Monitor 24"', action: 'Checked Out', date: '2024-04-07', purpose: 'Design Sprint Week' }
        ]
      },
      { 
        clubId: clubs[4].id, collegeName: colleges[4], coordinator1Id: collegeCoords[4].id, points: 950, status: 'APPROVED',
        inventory: [
          { id: 'sb5-1', name: 'DJ Controller', category: 'Music', quantity: 1 },
          { id: 'sb5-2', name: 'PA Speaker System', category: 'Audio', quantity: 2 },
          { id: 'sb5-3', name: 'DSLR Canon 800D', category: 'Photography', quantity: 2 },
          { id: 'sb5-4', name: 'LED Stage Lighting Kit', category: 'Lighting', quantity: 5 }
        ],
        usageHistory: [
          { member: 'Manish Sharma', profileId: 'RTU-2024-MBR-1012', item: 'DJ Controller', action: 'Checked Out', date: '2024-04-05', purpose: 'Freshers Night Event' },
          { member: 'Divya Verma', profileId: 'RTU-2024-MBR-1013', item: 'PA Speaker System', action: 'Checked Out', date: '2024-04-05', purpose: 'Freshers Night Event' },
          { member: 'Piyush Singh', profileId: 'RTU-2024-MBR-1014', item: 'DSLR Canon 800D', action: 'Returned', date: '2024-04-06', purpose: 'Event Photography Done' },
          { member: 'Megha Meena', profileId: 'RTU-2024-MBR-1015', item: 'LED Stage Lighting Kit', action: 'In Use', date: '2024-04-10', purpose: 'Annual Talent Show Prep' }
        ]
      },
      { 
        clubId: clubs[0].id, collegeName: colleges[5], coordinator1Id: collegeCoords[5].id, points: 610, status: 'APPROVED',
        inventory: [
          { id: 'sb6-1', name: 'Whiteboard & Markers', category: 'Classroom', quantity: 3 },
          { id: 'sb6-2', name: 'Projector (Epson)', category: 'Presentation', quantity: 2 },
          { id: 'sb6-3', name: 'Mini PC NUC', category: 'Hardware', quantity: 5 }
        ],
        usageHistory: [
          { member: 'Shubham Gupta', profileId: 'RTU-2024-MBR-1016', item: 'Projector (Epson)', action: 'Checked Out', date: '2024-04-03', purpose: 'Weekly Coding Session' },
          { member: 'Anjali Joshi', profileId: 'RTU-2024-MBR-1017', item: 'Mini PC NUC', action: 'Checked Out', date: '2024-04-09', purpose: 'Backend Server Setup' }
        ]
      },
      { 
        clubId: clubs[2].id, collegeName: colleges[10], coordinator1Id: collegeCoords[6].id, points: 460, status: 'APPROVED',
        inventory: [
          { id: 'sb7-1', name: 'iPad Pro 12.9"', category: 'Hardware', quantity: 3 },
          { id: 'sb7-2', name: 'Adobe Creative Suite', category: 'Software', quantity: 10 },
          { id: 'sb7-3', name: 'Pantone Swatchbook', category: 'Design', quantity: 2 },
          { id: 'sb7-4', name: 'Green Screen Studio', category: 'Media', quantity: 1 }
        ],
        usageHistory: [
          { member: 'Kartik Sharma', profileId: 'RTU-2024-MBR-1018', item: 'iPad Pro 12.9"', action: 'Checked Out', date: '2024-03-25', purpose: 'Poster Design Competition' },
          { member: 'Sana Verma', profileId: 'RTU-2024-MBR-1019', item: 'Adobe Creative Suite', action: 'Activated', date: '2024-04-01', purpose: 'Branding Workshop' },
          { member: 'Aman Singh', profileId: 'RTU-2024-MBR-1020', item: 'Green Screen Studio', action: 'In Use', date: '2024-04-10', purpose: 'Design Promo Video Shoot' },
          { member: 'Pooja Meena', profileId: 'RTU-2024-MBR-1021', item: 'Pantone Swatchbook', action: 'Returned', date: '2024-04-02', purpose: 'Print Design Finalized' }
        ]
      }
    ]);

    // 7. Create 30+ Fake Members/Students across colleges
    const membersData = [];
    const names = ["Abhishek", "Riya", "Karan", "Ishita", "Yash", "Tanvi", "Sahil", "Mannat", "Siddharth", "Avani", "Varun", "Kavya", "Manish", "Divya", "Piyush", "Megha", "Shubham", "Anjali", "Kartik", "Sana", "Aman", "Pooja", "Harsh", "Sneha", "Vishal", "Swati", "Nitin", "Prachi", "Rahul", "Jyoti"];
    
    // Point tiers: top contributors, active members, and newcomers
    const pointTiers = [420, 385, 360, 340, 310, 290, 275, 255, 240, 225, 210, 195, 180, 170, 155, 145, 130, 120, 110, 95, 85, 75, 65, 55, 45, 40, 35, 30, 20, 15];
    const scoreTiers = [94, 91, 89, 87, 85, 83, 81, 79, 77, 75, 73, 71, 70, 68, 85, 82, 78, 76, 90, 72, 69, 65, 80, 74, 88, 66, 84, 71, 77, 63];
    
    for (let i = 0; i < names.length; i++) {
        const college = colleges[i % colleges.length];
        membersData.push({
            fullName: `${names[i]} ${['Sharma', 'Verma', 'Singh', 'Meena', 'Gupta', 'Joshi'][i % 6]}`,
            email: `${names[i].toLowerCase()}${i}@student.rtu.ac.in`,
            password: hashedPass,
            collegeName: college,
            branch: ['CS', 'IT', 'ECE', 'ME', 'CE', 'AI'][i % 6],
            year: (i % 4) + 1,
            role: 'MEMBER',
            profileId: `RTU-2024-MBR-${1000 + i}`,
            points: pointTiers[i],
            testScore: scoreTiers[i]
        });
    }
    await User.bulkCreate(membersData);

    // 8. Create Test Bank
    await TestBank.bulkCreate([
      { type: 'TECHNICAL', question: 'What is the time complexity of searching in a balanced Binary Search Tree?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], correctAnswer: 'O(log n)' },
      { type: 'TECHNICAL', question: 'Which protocol is used for real-time web communication?', options: ['HTTP', 'SMTP', 'WebSockets', 'FTP'], correctAnswer: 'WebSockets' },
      { type: 'TECHNICAL', question: 'What does CSS stand for?', options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'], correctAnswer: 'Cascading Style Sheets' },
      { type: 'TECHNICAL', question: 'In Node.js, how do you import a module?', options: ['import', 'require', 'fetch', 'using'], correctAnswer: 'require' },
      { type: 'TECHNICAL', question: 'What is the purpose of a primary key in a database?', options: ['To link tables', 'To uniquely identify a record', 'To store passwords', 'To speed up queries'], correctAnswer: 'To uniquely identify a record' },
      { type: 'CULTURAL', question: 'Which state is Rajasthan Technical University located in?', options: ['Gujarat', 'Rajasthan', 'Haryana', 'Punjab'], correctAnswer: 'Rajasthan' },
      { type: 'CULTURAL', question: 'What is the capital city of Rajasthan?', options: ['Jodhpur', 'Kota', 'Jaipur', 'Udaipur'], correctAnswer: 'Jaipur' },
      { type: 'CULTURAL', question: 'Which of these is a famous folk dance of Rajasthan?', options: ['Ghoomar', 'Bhangra', 'Garba', 'Kathak'], correctAnswer: 'Ghoomar' },
      { type: 'SOCIAL', question: 'What does NSS stand for?', options: ['National Social Service', 'National Student Scheme', 'National Service Scheme', 'New Social Structure'], correctAnswer: 'National Service Scheme' },
      { type: 'SOCIAL', question: 'Which of these is a primary goal of a Social Club?', options: ['Making profit', 'Community service', 'Competitive gaming', 'Winning elections'], correctAnswer: 'Community service' }
    ]);

    // 9. Create Detailed Tech Events
    await Event.bulkCreate([
      { 
        title: 'RTU Global Hackathon 2024', 
        description: 'A 36-hour intense development marathon bringing together the best minds from 50+ colleges. Focus areas: AI for Good, Web3, and Sustainable Tech.', 
        date: new Date('2024-05-15'), 
        mode: 'OFFLINE', 
        location: 'RTU Convocation Center',
        speaker: 'Dr. Sameer Malawat (CTO, TechNova)',
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
        type: 'Hackathon',
        clubId: clubs[0].id, 
        pointsAwarded: 100, 
        status: 'UPCOMING' 
      },
      { 
        title: 'Cloud Native Summit', 
        description: 'Master Docker, Kubernetes, and Serverless architectures in this deep-dive workshop led by industry veterans.', 
        date: new Date('2024-06-20'), 
        mode: 'ONLINE', 
        location: 'Zoom Virtual Hall',
        speaker: 'Anurag Kashyap (AWS Community Hero)',
        imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        type: 'Workshop',
        clubId: clubs[0].id, 
        pointsAwarded: 50, 
        status: 'UPCOMING' 
      },
      { 
        title: 'CyberSecurity Red-Teaming', 
        description: 'Learn the art of network penetration testing and ethical hacking in a controlled sandbox environment.', 
        date: new Date('2024-04-25'), 
        mode: 'OFFLINE', 
        location: 'CS IT Lab 4, RTU Kota',
        speaker: 'Security Team (RedLink)',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
        type: 'Bootcamp',
        clubId: clubs[1].id, 
        pointsAwarded: 80, 
        status: 'UPCOMING' 
      },
      { 
        title: 'UI/UX Design Masterclass', 
        description: 'Design digital experiences that matter. From Figma wireframes to high-fidelity prototypes.', 
        date: new Date('2024-05-02'), 
        mode: 'ONLINE', 
        location: 'Google Meet',
        speaker: 'Tanvi Shah (Senior Product Designer, Zomato)',
        imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80',
        type: 'Design Talk',
        clubId: clubs[2].id, 
        pointsAwarded: 30, 
        status: 'UPCOMING' 
      },
      { 
        title: 'AI/ML for HealthTech', 
        description: 'How artificial intelligence is revolutionizing diagnostics and patient care in modern medicine.', 
        date: new Date('2024-03-10'), 
        mode: 'OFFLINE', 
        location: 'RTU Seminar Hall 1',
        speaker: 'Prof. Rajesh Khanna',
        imageUrl: 'https://images.unsplash.com/photo-1576091160550-217359f48123?auto=format&fit=crop&w=800&q=80',
        type: 'Research Seminar',
        clubId: clubs[0].id, 
        pointsAwarded: 40, 
        status: 'PAST' 
      }
    ]);

    // 10. Create Messages
    await Message.bulkCreate([
      { roomId: 'global', content: 'Welcome to RTU Connect!', senderName: 'Admin', senderProfileId: 'RTU-ADMIN-0001', collegeTag: 'RTU Kota' },
      { roomId: 'global', content: 'Excited to open a sub-branch in Jodhpur!', senderName: 'Vikram Patel', senderProfileId: 'RTU-2024-CS-VIKRAM', collegeTag: 'Arya College' },
      { roomId: 'global', content: 'Who is coming to RoboQuest?', senderName: 'Amit Verma', senderProfileId: 'RTU-2024-ECE-AMIT', collegeTag: 'Global Institute' },
      { roomId: 'global', content: 'Can we form inter-college teams for CodeBash?', senderName: 'Neha Sharma', senderProfileId: 'RTU-2024-AI-NEHA', collegeTag: 'JECRC' }
    ]);

    console.log('Database seeded successfully with expanded RTU data!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
