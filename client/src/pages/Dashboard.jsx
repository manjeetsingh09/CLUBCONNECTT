import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { 
  Trophy, Users, Calendar, Activity, 
  User as UserIcon, Zap, TrendingUp, 
  ArrowUpRight, Shield, Cpu, Flame,
  ChevronRight, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { trackEvent } from '../utils/analytics';

const AnimCounter = ({ value, suffix = '' }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(value) || 0;
    if (end === 0) { setCount(0); return; }
    const duration = 1000;
    const step = end / (duration / 16);
    const counter = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(counter); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(counter);
  }, [value]);
  return <>{count.toLocaleString()}{suffix}</>;
};

const Dashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [activities, setActivities] = useState([]);

  const level = Math.floor((user.points || 0) / 100);
  const xpInLevel = (user.points || 0) % 100;
  const nextLevelXP = 100;

  // Trigger when a user hits an XP threshold and levels up
  const handleLevelUp = (newLevel) => {
    trackEvent('Gamification', 'Level Up', `Reached Level ${newLevel}`, newLevel);
  };

  // Trigger when a user is awarded a new RBAC role badge
  const awardBadge = (roleName) => {
    trackEvent('Gamification', 'Badge Unlocked', roleName);
  };

  useEffect(() => {
    if (socket) {
      socket.on('activity_feed', (data) => {
        setActivities(prev => [data, ...prev].slice(0, 10));
      });
      return () => socket.off('activity_feed');
    }
  }, [socket]);

  useEffect(() => {
    setActivities([
      { type: 'APPROVAL', message: 'SKIT sub-branch ranked #1 with 1,020 XP', timestamp: new Date(), xp: '+50' },
      { type: 'EVENT', message: 'RTU Global Hackathon 2024 — Registration open', timestamp: new Date(Date.now() - 1800000), xp: '+100' },
      { type: 'MEMBER', message: 'Neha Sharma (JECRC) scored 95% on assessment', timestamp: new Date(Date.now() - 3600000), xp: '+25' },
      { type: 'APPROVAL', message: 'Pacific University — DesignRTU chapter approved', timestamp: new Date(Date.now() - 7200000), xp: '+75' },
      { type: 'EVENT', message: 'CyberSecurity bootcamp announced for April 25th', timestamp: new Date(Date.now() - 14400000), xp: '+50' },
      { type: 'MEMBER', message: '12 new members joined CodeRTU from Poornima', timestamp: new Date(Date.now() - 28800000), xp: '+30' }
    ]);
  }, []);

  const getTypeStyle = (type) => {
    if (type === 'APPROVAL') return { dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Approved' };
    if (type === 'EVENT') return { dot: 'bg-violet-500', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20', label: 'Event' };
    return { dot: 'bg-cyan-500', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', label: 'Member' };
  };

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* === Hero Banner === */}
      <div className="relative rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/5 to-cyan-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_50%)]"></div>
        
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                {user.fullName[0]}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-zinc-900">
                <Zap size={12} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  {user.fullName}
                </h1>
                {user.role === 'SUPER_ADMIN' && (
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 text-amber-400 rounded border border-amber-500/20 uppercase tracking-wider">Admin</span>
                )}
              </div>
              <p className="text-sm text-zinc-500">{user.collegeName}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-600">
                  <Cpu size={12} className="text-emerald-500" />
                  <span className="text-emerald-400">ONLINE</span>
                </span>
                <span className="text-zinc-800">·</span>
                <span className="text-[11px] font-mono text-zinc-600">{user.profileId}</span>
              </div>
            </div>
          </div>

          {/* Level + XP */}
          <div className="flex items-center gap-5">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex flex-col items-center justify-center">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Level</p>
                <p className="text-3xl font-black font-mono text-white">{level}</p>
              </div>
            </div>
            <div className="w-48 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black font-mono text-white"><AnimCounter value={user.points || 0} /></span>
                <span className="text-[10px] font-mono text-violet-400 font-bold">XP</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(xpInLevel / nextLevelXP) * 100}%` }}
                  transition={{ duration: 1.5, ease: 'circOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
                />
              </div>
              <p className="text-[10px] font-mono text-zinc-600">{xpInLevel} / {nextLevelXP} to Level {level + 1}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === Quick Stats === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total XP', value: user.points || 0, icon: Flame, color: 'text-violet-400', gradient: 'from-violet-500/20', change: '+120' },
          { label: 'Network Rank', value: '#12', icon: TrendingUp, color: 'text-amber-400', gradient: 'from-amber-500/20', change: '↑ 3' },
          { label: 'Events Done', value: 3, icon: Calendar, color: 'text-cyan-400', gradient: 'from-cyan-500/20', change: '+1' },
          { label: 'Team Size', value: 124, icon: Users, color: 'text-emerald-400', gradient: 'from-emerald-500/20', change: '+8' },
        ].map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: i * 0.06 }}
            className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 group hover:border-zinc-700 transition-all"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${s.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full`}></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <s.icon size={16} className={s.color} />
                <span className="flex items-center text-[10px] font-mono text-emerald-400">
                  <ArrowUpRight size={10} className="mr-0.5" />{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold font-mono text-white tabular-nums">
                {typeof s.value === 'number' ? <AnimCounter value={s.value} /> : s.value}
              </p>
              <p className="text-[10px] text-zinc-600 font-medium mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* === Main Grid === */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        
        {/* Activity Feed — 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity size={16} className="text-violet-400" />
              Live Activity
            </h2>
            <span className="text-[10px] font-mono text-zinc-600">{activities.length} EVENTS</span>
          </div>
          
          <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/60">
            {activities.map((activity, i) => {
              const style = getTypeStyle(activity.type);
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="px-4 py-3.5 hover:bg-zinc-800/30 transition-colors flex items-center gap-3"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-zinc-300 truncate">{activity.message}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">{new Date(activity.timestamp).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${style.badge}`}>{style.label}</span>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">{activity.xp}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Panel — 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          {/* Profile Card */}
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Shield size={14} className="text-violet-400" />
                Identity
              </h3>
              <span className="text-[9px] font-mono text-zinc-600 uppercase">Verified</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Branch', value: user.branch },
                  { label: 'Year', value: `Y${user.year}` },
                  { label: 'Role', value: user.role.replace('_', ' ') },
                  { label: 'Score', value: `${user.testScore || 0}%` },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-800/40 rounded-lg p-2.5 border border-zinc-800/50">
                    <p className="text-[9px] text-zinc-600 uppercase tracking-wider font-bold">{item.label}</p>
                    <p className="text-sm font-semibold text-white mt-0.5 font-mono truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Test Readiness Gauge */}
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-zinc-500 font-medium">Aptitude Score</span>
                  <span className="font-mono font-bold text-violet-400">{user.testScore || 0}%</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${user.testScore || 0}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <div className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800">
              <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-violet-400" />
                Quick Actions
              </h3>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {[
                { label: 'Browse Clubs', desc: '10 active clubs', to: '/', color: 'text-violet-400' },
                { label: 'Leaderboard', desc: '7 ranked nodes', to: '/leaderboard', color: 'text-amber-400' },
                { label: 'Events Hub', desc: '5 upcoming', to: '/events', color: 'text-cyan-400' },
                { label: 'Global Chat', desc: 'Live now', to: '/chat/global', color: 'text-emerald-400' },
              ].map((link, i) => (
                <Link key={i} to={link.to} className="flex items-center justify-between px-4 py-3 hover:bg-zinc-800/30 transition-colors group">
                  <div>
                    <p className={`text-sm font-medium text-zinc-300 group-hover:${link.color} transition-colors`}>{link.label}</p>
                    <p className="text-[10px] text-zinc-600">{link.desc}</p>
                  </div>
                  <ChevronRight size={14} className="text-zinc-700 group-hover:text-zinc-400 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
