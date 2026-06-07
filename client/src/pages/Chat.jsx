import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send, Hash, Users as UsersIcon, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Chat = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const scrollRef = useRef();

  useEffect(() => {
    if (socket) {
      // Join room
      socket.emit('join_room', roomId);

      // Listen for messages
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Simulation of online members
      setOnlineCount(Math.floor(Math.random() * 20) + 5);

      return () => {
        socket.off('receive_message');
      };
    }
  }, [socket, roomId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const data = {
      roomId,
      content: newMessage,
      senderId: user.id
    };

    socket.emit('send_message', data);
    setNewMessage('');
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass rounded-3xl border border-white/5 overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rtu-orange/20 rounded-xl flex items-center justify-center text-rtu-orange">
              <Hash size={24} />
            </div>
            <div>
              <h2 className="font-bold text-white capitalize">{roomId === 'global' ? 'Global Community' : `${roomId} Club`} Chat</h2>
              <div className="flex items-center text-[10px] text-green-400 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                Active Room
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xs text-rtu-light/40 uppercase font-bold tracking-widest">Online Now</p>
              <p className="text-sm font-bold text-white">{onlineCount} Members</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((msg, i) => {
              const isMine = msg.senderProfileId === user.profileId;
              return (
                <motion.div 
                  key={msg.id || i}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] space-y-1 ${isMine ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center space-x-2 px-1">
                      <span className="text-[10px] font-bold text-rtu-light/40">{msg.senderName}</span>
                      <span className="text-[10px] text-rtu-orange/50 px-1.5 py-0.5 bg-rtu-orange/5 rounded uppercase">{msg.collegeTag}</span>
                    </div>
                    
                    <div className={`px-4 py-3 rounded-2xl ${
                      isMine 
                        ? 'bg-rtu-orange text-white rounded-tr-none shadow-lg shadow-rtu-orange/20' 
                        : 'bg-rtu-dark border border-white/5 text-rtu-light rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    
                    <div className={`flex items-center px-1 text-[9px] text-rtu-light/20 font-mono ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <Clock size={10} className="mr-1" />
                      {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={scrollRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 bg-rtu-deep/50 border-t border-white/5">
          <div className="relative group">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Send a message to #${roomId}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-white focus:outline-none focus:border-rtu-orange transition-all placeholder:text-rtu-light/30"
            />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-rtu-orange rounded-xl flex items-center justify-center text-white hover:bg-rtu-orange/80 transition-all active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar - Members Info */}
      <div className="hidden lg:block w-72 space-y-6">
        <div className="glass p-6 rounded-3xl border border-white/5">
          <h3 className="font-bold text-white mb-4 flex items-center tracking-tight">
            <UsersIcon size={18} className="mr-2 text-rtu-orange" />
            Room Info
          </h3>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-bold text-rtu-light/30 tracking-widest mb-1">Room Access</p>
              <div className="flex items-center text-sm font-bold text-white">
                <ShieldCheck size={14} className="mr-2 text-green-400" />
                Everyone
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-[10px] uppercase font-bold text-rtu-light/30 tracking-widest mb-1">Chat Guidelines</p>
              <ul className="text-xs space-y-2 text-rtu-light/60">
                <li className="flex items-start">
                  <span className="text-rtu-orange mr-2">•</span>
                  Keep it professional & related to RTU clubs.
                </li>
                <li className="flex items-start">
                  <span className="text-rtu-orange mr-2">•</span>
                  No spamming or aggressive behavior.
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-white/5">
          <h3 className="font-bold text-white mb-4">RTU Connect Community</h3>
          <p className="text-xs text-rtu-light/50 leading-relaxed">
            This is the official real-time channel for {roomId === 'global' ? 'all registered users' : 'affiliated club members'}. 
            Updates from university admins will be prefixed with [ADMIN].
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
