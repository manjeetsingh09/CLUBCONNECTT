import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  MapPin, 
  GraduationCap, 
  Linkedin, 
  Phone, 
  Mail, 
  Trophy, 
  Bookmark,
  Edit3,
  LogOut,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center p-20 text-white">Loading Profile...</div>;
  if (!user) return <div className="text-center p-20 text-white">User not found.</div>;

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Profile Header */}
      <div className="relative h-64 rounded-3xl overflow-hidden glass border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-rtu-orange/20 to-blue-500/20"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        <div className="absolute -bottom-1 left-8 flex items-end space-x-6 translate-y-1/2 md:translate-y-0 md:bottom-8">
          <div className="w-32 h-32 md:w-40 md:h-40 bg-rtu-deep rounded-3xl border-4 border-rtu-deep overflow-hidden shadow-2xl group flex items-center justify-center relative">
            <div className="w-full h-full bg-gradient-to-br from-rtu-orange to-yellow-500 flex items-center justify-center text-white text-6xl font-black italic">
              {user.fullName[0]}
            </div>
            {user.points > 100 && (
              <div className="absolute top-2 right-2 w-8 h-8 bg-white text-rtu-orange rounded-full flex items-center justify-center shadow-lg border-2 border-rtu-deep" title="Elite Member">
                <Star size={16} fill="currentColor" />
              </div>
            )}
          </div>
          <div className="pb-4 hidden md:block space-y-2">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">{user.fullName}</h1>
              {user.role === 'SUPER_ADMIN' && <div className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)]">Registry Admin</div>}
              {(user.role === 'CLUB_COORDINATOR' || user.role === 'COLLEGE_COORDINATOR') && <div className="px-3 py-1 bg-green-500 text-rtu-deep text-[10px] font-black rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.4)]">Verified Node</div>}
            </div>
            <p className="text-rtu-light/60 font-bold flex items-center text-sm">
              <span className="text-rtu-orange font-black mr-3 tracking-widest">ID: {user.profileId}</span>
              <span className="opacity-20 mr-3">|</span>
              <span className="flex items-center italic text-xs uppercase tracking-tight opacity-80"><MapPin size={14} className="mr-1 text-rtu-orange" /> {user.collegeName}</span>
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <div className="absolute top-8 right-8 flex space-x-4">
            <button className="glass px-6 py-2 rounded-xl font-bold text-white flex items-center hover:bg-white/10 transition-all">
              <Edit3 size={18} className="mr-2" /> Edit Profile
            </button>
            <button onClick={logout} className="bg-red-500/10 text-red-500 px-6 py-2 rounded-xl font-bold flex items-center hover:bg-red-500/20 transition-all border border-red-500/20">
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 md:pt-0">
        {/* Left Column - Info */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-xl font-bold text-white underline decoration-rtu-orange underline-offset-8">Basic Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-rtu-light/70">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-rtu-orange shadow-inner">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-rtu-light/70">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-400">
                  <GraduationCap size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Academic</p>
                  <p className="text-sm font-medium">{user.branch}, Year {user.year}</p>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-center space-x-4 text-rtu-light/70">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-green-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">Contact</p>
                    <p className="text-sm font-medium">{user.phone}</p>
                  </div>
                </div>
              )}
              {user.linkedin && (
                <div className="flex items-center space-x-4 text-rtu-light/70">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-600">
                    <Linkedin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">LinkedIn</p>
                    <a href={user.linkedin} target="_blank" rel="noreferrer" className="text-sm font-medium hover:text-white underline">View Profile</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-xl font-bold text-white">Skills & Badges</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-rtu-orange/10 text-rtu-orange border border-rtu-orange/20 rounded-full text-xs font-bold">Top Scorer</span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold">Club Lead</span>
              <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">Event Host</span>
            </div>
          </div>
        </div>

        {/* Right Column - Activity & Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Points Bar */}
          <div className="glass p-8 rounded-3xl border border-rtu-orange/10 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-8 text-rtu-orange/10 group-hover:text-rtu-orange/20 transition-colors">
              <Trophy size={120} />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                   <div className="w-8 h-8 rounded-lg bg-rtu-orange flex items-center justify-center text-rtu-deep text-xs font-black">
                      L{Math.floor((user.points || 0) / 100) + 1}
                   </div>
                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Contribution Level</h3>
                </div>
                <p className="text-rtu-light/40 text-sm font-medium">You are in the top 5% of active members this month.</p>
              </div>
              <div className="flex items-end space-x-2">
                <span className="text-6xl font-black text-rtu-orange leading-none">{user.points || 0}</span>
                <span className="text-rtu-light/20 font-bold uppercase tracking-widest pb-1">Total XP</span>
              </div>
            </div>
            <div className="mt-8 h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((user.points % 100) || (user.points > 0 ? 100 : 0), 100)}%` }}
                transition={{ duration: 1.5, ease: 'circOut' }}
                className="h-full bg-gradient-to-r from-rtu-orange via-orange-400 to-yellow-400 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <Bookmark className="mr-3 text-rtu-orange" />
              Activity Timeline
            </h3>
            <div className="space-y-4">
              {[
                { date: 'Yesterday', title: 'Joined CodeRTU sub-branch', desc: 'Successfully onboarded as a contributor.', pts: '+10 XP' },
                { date: '3 days ago', title: 'Completed Technical Aptitude Test', desc: 'Scored 85% on the coordinator assessment.', pts: '+30 XP' },
                { date: '1 week ago', title: 'Profile Created', desc: 'Welcome to the RTU Connect network!', pts: '+5 XP' }
              ].map((activity, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/[0.03] transition-colors group">
                  <div className="flex items-center space-x-6">
                    <div className="text-[10px] w-20 text-rtu-light/30 uppercase font-black font-mono tracking-widest">{activity.date}</div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-rtu-orange transition-colors">{activity.title}</h4>
                      <p className="text-sm text-rtu-light/50">{activity.desc}</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-green-400">{activity.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
