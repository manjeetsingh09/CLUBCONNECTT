import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User as UserIcon, Bell, Sparkles, X } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (user) {
      fetchNotifications();
      // Identify with socket
      if (socket) {
        socket.emit('identify', user.id);
        socket.on('receive_notification', (notif) => {
          setNotifications(prev => [notif, ...prev]);
          toast.success(notif.message, { icon: '🔔' });
        });
        return () => socket.off('receive_notification');
      }
    }
  }, [user, socket]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`);
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const clearAll = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`);
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
    <nav className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg shadow-violet-500/20">
          <Sparkles size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
          Club<span className="text-violet-400">Connect</span>
        </span>
      </Link>

      <div className="flex items-center space-x-2">
        <Link to="/leaderboard" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">Rankings</Link>
        <Link to="/events" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">Events</Link>
        
        {user ? (
          <div className="flex items-center space-x-2 ml-2 relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={`p-2 rounded-lg transition-all relative ${showNotifications ? 'bg-violet-500/20 text-violet-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full ring-2 ring-zinc-950"></span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <NotificationDropdown 
                  notifications={notifications}
                  onMarkRead={markRead}
                  onClearAll={clearAll}
                  onClose={() => setShowNotifications(false)}
                />
              )}
            </AnimatePresence>
            
            <div className="h-6 w-px bg-zinc-800 mx-1"></div>
            
            <Link to={`/profile/${user.id}`} className="flex items-center space-x-3 px-3 py-1.5 hover:bg-zinc-800 rounded-lg transition-all group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors leading-tight">{user.fullName}</p>
                <p className="text-[11px] text-zinc-500 font-medium">{user.role.replace('_', ' ')}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-violet-500/20">
                {user.fullName[0]}
              </div>
            </Link>

            <button 
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 ml-2">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        )}
      </div>
    </nav>
    {/* Overlay for notification dropdown closure */}
    {showNotifications && (
      <div 
        className="fixed inset-0 z-[55]" 
        onClick={() => setShowNotifications(false)}
      ></div>
    )}
    </>
  );
};

export default Navbar;
