import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  MapPin, 
  Target, 
  GitBranch, 
  Calendar,
  ChevronRight,
  Shield,
  ExternalLink,
  Zap,
  Trophy,
  Star,
  Package,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ClipboardCheck,
  Award,
  Clock,
  ChevronRightCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const ClubDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingInventory, setIsEditingInventory] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, category: '' });
  const [quizzes, setQuizzes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeTab, setActiveTab] = useState('Nodes'); // Nodes, Recruitment, Rankings

  const canEdit = user && (user.role === 'SUPER_ADMIN' || (user.role === 'CLUB_COORDINATOR' && club?.coordinatorId === user.id));

  useEffect(() => {
    const fetchClubData = async () => {
      try {
        const [clubRes, quizzesRes, leaderboardRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/clubs/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tests/club/${id}`),
          axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/tests/club/${id}/leaderboard`)
        ]);
        
        setClub(clubRes.data);
        setInventory(clubRes.data.inventory || []);
        setQuizzes(quizzesRes.data);
        setLeaderboard(leaderboardRes.data);
      } catch (err) {
        console.error('Error fetching club data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubData();
  }, [id]);

  const handleSaveInventory = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/clubs/${id}/inventory`, { inventory });
      setClub(prev => ({ ...prev, inventory }));
      setIsEditingInventory(false);
    } catch (err) {
      console.error('Error saving inventory:', err);
    }
  };

  const addItem = () => {
    if (!newItem.name) return;
    setInventory([...inventory, { ...newItem, id: Date.now() }]);
    setNewItem({ name: '', quantity: 1, category: '' });
  };

  const deleteItem = (itemId) => {
    setInventory(inventory.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setInventory(inventory.map(item => 
      item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-500 font-mono tracking-tighter text-sm uppercase">Loading Hub Data...</p>
    </div>
  );
  if (!club) return <div className="text-center p-20 text-white">Club not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="glass p-10 md:p-14 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 group-hover:from-violet-500/10 group-hover:to-fuchsia-500/10 transition-all duration-700"></div>
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-white">
          <Users size={350} />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-5">
            <div className="flex items-center space-x-3">
              <span className="px-5 py-2 bg-violet-500/10 text-violet-400 text-[10px] font-black rounded-full uppercase tracking-[0.25em] border border-violet-500/20">
                {club.domain}
              </span>
              <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">
                Active
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic">{club.name}</h1>
            <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed font-medium">
              {club.description}
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Users size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{club.membersCount}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Members</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <GitBranch size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{club.subBranchesCount}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Chapters</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                  <Zap size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-xl font-black text-white">{club.activeProjectsCount}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Projects</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-4 shrink-0">
            <Link to={`/request-subbranch/${club.id}`} className="btn-primary px-10 py-5 text-sm font-black flex items-center justify-center rounded-2xl tracking-widest uppercase active:scale-95 transition-all">
              Open New Node <ChevronRight size={20} className="ml-2" />
            </Link>
            <Link to={`/chat/${club.name.toLowerCase()}`} className="glass px-10 py-5 text-sm font-black text-white text-center hover:bg-white/10 transition-all border border-white/10 rounded-2xl tracking-widest uppercase">
              Community Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content Sections */}
        <div className="lg:col-span-2 space-y-10">
          {/* Tab Navigation */}
          <div className="flex items-center p-2 bg-white/5 rounded-2xl border border-white/10 w-fit">
            {['Nodes', 'Recruitment', 'Rankings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-violet-500 text-white shadow-lg' 
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Nodes' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-400">
                  <GitBranch size={20} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Affiliated Nodes</h2>
              </div>
              
              <div className="space-y-4">
                {club.subBranches?.map((branch, index) => (
                  <motion.div 
                    key={branch.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className="glass rounded-2xl border border-white/5 overflow-hidden group hover:border-violet-500/20 transition-all duration-300"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between p-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center text-zinc-600 group-hover:bg-violet-500/10 group-hover:text-violet-400 transition-all">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-white leading-tight group-hover:text-violet-400 transition-colors">{branch.collegeName}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Trophy size={12} className="text-violet-400" />
                            <span className="text-xs text-violet-400 font-black">{branch.points} XP</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">
                        <Star size={10} fill="currentColor" />
                        <span>Active</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {(!club.subBranches || club.subBranches.length === 0) && (
                  <div className="p-16 glass rounded-[2rem] text-center border-2 border-dashed border-white/5">
                    <p className="text-zinc-700 font-bold uppercase tracking-widest">No nodes active yet — be the first to open one!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Recruitment' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-rtu-orange/10 rounded-xl flex items-center justify-center text-rtu-orange">
                  <ClipboardCheck size={20} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Recruitment Tests</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((quiz, index) => (
                  <motion.div 
                    key={quiz.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass p-6 rounded-3xl border border-white/5 group hover:border-rtu-orange/20 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-rtu-orange transition-colors">
                        <Award size={24} />
                      </div>
                      <span className="px-3 py-1 bg-white/5 text-[10px] font-black text-zinc-500 rounded-full border border-white/10 uppercase tracking-widest">
                        {quiz.roleType}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-2 leading-tight uppercase italic">{quiz.title}</h3>
                    <p className="text-sm text-zinc-500 mb-6 font-medium line-clamp-2">{quiz.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-zinc-600">
                        <Clock size={14} />
                        <span className="text-xs font-black uppercase tracking-widest">{quiz.timeLimit} MINS</span>
                      </div>
                      <Link 
                        to={`/test/quiz/${quiz.id}`}
                        className="flex items-center gap-2 text-rtu-orange font-black text-xs uppercase tracking-[0.2em] hover:translate-x-1 transition-transform"
                      >
                        Enter Test <ChevronRightCircle size={16} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
                {quizzes.length === 0 && (
                  <div className="col-span-full p-16 glass rounded-[2rem] text-center border-2 border-dashed border-white/5">
                    <p className="text-zinc-700 font-bold uppercase tracking-widest">No active recruitments found for this club.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Rankings' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
                  <Trophy size={20} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Club Top Talent</h2>
              </div>

              <div className="glass rounded-[2rem] border border-white/5 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Rank</th>
                      <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Member</th>
                      <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Score (Avg)</th>
                      <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Total XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.userId} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                            index === 0 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                            index === 1 ? 'bg-zinc-400/20 text-zinc-300 border border-zinc-400/20' :
                            index === 2 ? 'bg-orange-800/20 text-orange-400 border border-orange-800/20' :
                            'bg-white/5 text-zinc-600'
                          }`}>
                            #{index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400 font-black text-xs">
                              {entry.user.fullName[0]}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{entry.user.fullName}</p>
                              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{entry.user.collegeName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full max-w-[60px] h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500/50" style={{ width: `${entry.avgScore}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-white">{Math.round(entry.avgScore)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-emerald-400">{entry.totalPoints} XP</span>
                        </td>
                      </tr>
                    ))}
                    {leaderboard.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-20 text-center text-zinc-700 font-bold uppercase tracking-widest">
                          Leaderboard inactive — complete tests to rank up!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Leadership & Inventory */}
        <div className="space-y-10">
          {/* Coordinator Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-fuchsia-500/10 rounded-xl flex items-center justify-center text-fuchsia-400">
                <Shield size={20} />
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Leadership</h2>
            </div>
            <div className="glass p-8 rounded-[2rem] border border-white/5 space-y-6">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Main Club Coordinator</p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black italic shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  {club.mainCoordinator?.fullName[0]}
                </div>
                <div>
                  <p className="font-black text-lg text-white">{club.mainCoordinator?.fullName}</p>
                  <p className="text-sm text-zinc-500 font-medium">{club.mainCoordinator?.email}</p>
                </div>
              </div>
              <div className="pt-4 space-y-3 border-t border-white/5">
                <div className="flex items-center text-sm text-zinc-400 font-medium">
                  <Target size={16} className="mr-3 text-violet-400" />
                  Strategic Club Oversight
                </div>
                <div className="flex items-center text-sm text-zinc-400 font-medium">
                  <Calendar size={16} className="mr-3 text-violet-400" />
                  Founded in 2021
                </div>
              </div>
              <button className="w-full mt-2 glass py-4 rounded-2xl font-black text-xs text-white flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 uppercase tracking-widest active:scale-95">
                Contact Lead <ExternalLink size={14} className="ml-2" />
              </button>
            </div>
          </div>

          {/* Club Inventory Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                  <Package size={20} />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">Inventory</h2>
              </div>
              {canEdit && !isEditingInventory && (
                <button 
                  onClick={() => setIsEditingInventory(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[10px] font-black text-white rounded-lg border border-white/10 uppercase tracking-widest transition-all"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}
            </div>

            <div className="glass p-6 rounded-[2rem] border border-white/5 space-y-4">
              {isEditingInventory ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-2 pb-4 border-b border-white/5">
                    <input 
                      className="col-span-5 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-violet-500/50 transition-all"
                      placeholder="Item name..."
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                    />
                    <input 
                      className="col-span-4 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-violet-500/50 transition-all"
                      placeholder="Category..."
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                    />
                    <input 
                      type="number"
                      className="col-span-2 bg-white/5 border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-violet-500/50 transition-all"
                      value={newItem.quantity}
                      onChange={e => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                    />
                    <button 
                      onClick={addItem}
                      className="col-span-1 flex items-center justify-center bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {inventory.map(item => (
                      <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-white/[0.02] border border-white/5 rounded-xl">
                        <div className="col-span-5 font-bold text-white text-[13px] px-1 truncate">{item.name}</div>
                        <div className="col-span-3 text-[10px] text-zinc-600 uppercase font-black truncate">{item.category}</div>
                        <div className="col-span-3 flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white/5 rounded text-white">-</button>
                          <span className="text-white font-mono text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white/5 rounded text-white">+</button>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="col-span-1 flex items-center justify-center text-red-500/50 hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={handleSaveInventory}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={14} /> Commit Changes
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingInventory(false);
                        setInventory(club.inventory || []);
                      }}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {inventory.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {inventory.map(item => (
                        <div key={item.id} className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between group hover:border-violet-500/30 transition-all">
                          <div>
                            <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest truncate">{item.category || 'ASSET'}</p>
                            <h4 className="text-white font-bold group-hover:text-violet-400 transition-colors truncate">{item.name}</h4>
                          </div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-zinc-700 font-mono">STOCK</span>
                              <span className={`text-sm font-black font-mono ${item.quantity > 5 ? 'text-emerald-400' : 'text-amber-400'}`}>{item.quantity}</span>
                            </div>
                            {item.lastUsedBy && item.lastUsedBy !== 'N/A' && (
                              <div className="pt-2 border-t border-white/5">
                                <p className="text-[9px] text-zinc-700 uppercase font-bold tracking-tight">Last Used By</p>
                                <p className="text-[11px] text-zinc-400 font-medium truncate">{item.lastUsedBy}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-zinc-800">
                        <Package size={24} />
                      </div>
                      <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest leading-loose">
                        Asset Log Empty<br/>
                        Inventory Tracking Offline
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
