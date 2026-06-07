const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
connectDB();

// Request models to sync
const models = require('./models');

// Routes (to be implemented)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clubs', require('./routes/club'));
app.use('/api/requests', require('./routes/request'));
app.use('/api/tests', require('./routes/test'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/events', require('./routes/events'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io logic
const socketHandler = require('./socket/socket');
socketHandler(io);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Sync Database and Start Server
sequelize.sync().then(() => {
  console.log('Database synced.');
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
