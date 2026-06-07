const { Message, User } = require('../models');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific room (Global or Club-ID)
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle chat messages
    socket.on('send_message', async (data) => {
      const { roomId, content, senderId } = data;
      
      try {
        const user = await User.findByPk(senderId);
        if (user) {
          const message = await Message.create({
            roomId,
            content,
            senderName: user.fullName,
            senderProfileId: user.profileId,
            collegeTag: user.collegeName
          });

          // Broadcast to everyone in the room
          io.to(roomId).emit('receive_message', message);
          
          // Also broadcast to a global activity feed if needed
          io.emit('activity_feed', {
            type: 'CHAT_MESSAGE',
            message: `${user.fullName} sent a message in ${roomId === 'global' ? 'Global Chat' : 'Club Chat'}`,
            timestamp: new Date()
          });
        }
      } catch (err) {
        console.error('Socket message error:', err);
      }
    });

    // Special event for activity feed (e.g., new approvals, rankings)
    socket.on('new_activity', (data) => {
      // Data format: { type, message }
      io.emit('activity_feed', {
        ...data,
        timestamp: new Date()
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Handle real-time notifications
    socket.on('send_notification', async (data) => {
      const { userId, type, message, link } = data;
      // In a real app, we would emit to a specific user's room
      // For this hackathon, we'll join users to their own userId room on connect
      io.to(userId).emit('receive_notification', {
        type,
        message,
        link,
        createdAt: new Date()
      });
    });

    // Join user to their private room
    socket.on('identify', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} identified and joined private room`);
    });
  });
};
