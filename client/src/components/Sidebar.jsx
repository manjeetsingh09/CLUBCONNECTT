import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Trophy, 
  Calendar, 
  Rocket,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clubs', path: '/', icon: Users },
    { name: 'Chat', path: '/chat/global', icon: MessageSquare },
    { name: 'Rankings', path: '/leaderboard', icon: Trophy },
    { name: 'Events', path: '/events', icon: Calendar },
    { name: 'Projects', path: '/projects', icon: Rocket },
  ];

  if (user.role === 'SUPER_ADMIN') {
    links.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  if (['SUPER_ADMIN', 'CLUB_COORDINATOR'].includes(user.role)) {
    links.push({ name: 'Requests', path: '/requests', icon: Zap });
  }

  return (
    <aside className="w-16 md:w-56 border-r border-zinc-800/80 flex flex-col h-full bg-zinc-950/50 transition-all duration-300">
      <div className="flex-1 py-4 space-y-0.5 px-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => `
              flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm
              ${isActive 
                ? 'bg-violet-500/10 text-violet-400 font-semibold' 
                : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}
            `}
          >
            <link.icon size={18} className="shrink-0" />
            <span className="hidden md:block">{link.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-800/80">
        <div className="bg-zinc-900 rounded-xl p-4 hidden md:block border border-zinc-800">
          <div className="flex items-center space-x-2 mb-2">
            <Zap size={14} className="text-violet-400" />
            <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">Your XP</p>
          </div>
          <p className="text-2xl font-bold text-white">{user.points || 0}</p>
          <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full" 
              style={{ width: `${Math.min((user.points % 100) || 5, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
