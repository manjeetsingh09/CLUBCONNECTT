import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Users, ArrowRight, Zap, Globe, Shield, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/clubs`);
        setClubs(res.data);
        setFilteredClubs(res.data);
      } catch (err) {
        console.error('Error fetching clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  useEffect(() => {
    const results = clubs.filter(club => {
      const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === 'All' || club.domain === selectedDomain;
      return matchesSearch && matchesDomain;
    });
    setFilteredClubs(results);
  }, [searchTerm, selectedDomain, clubs]);

  const domains = ['All', ...new Set(clubs.map(c => c.domain))];

  return (
    <div className="space-y-16 pb-20 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="relative pt-8 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent rounded-3xl pointer-events-none"></div>
        
        <div className="relative text-center px-4 max-w-3xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-semibold"
          >
            <Zap size={14} />
            <span>ClubConnect — 50+ Colleges Synchronized</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-5xl md:text-6xl font-extrabold text-white leading-[1.1] tracking-tight"
          >
            The platform for
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">university clubs</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed"
          >
            Unite clubs across your university network. Open sub-branches, collaborate on projects, and climb the leaderboard.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/register" className="btn-primary px-8 py-3.5 text-sm w-full sm:w-auto text-center">Get Started Free</Link>
            <Link to="/leaderboard" className="px-8 py-3.5 text-sm font-semibold text-zinc-300 w-full sm:w-auto text-center border border-zinc-700 rounded-xl hover:bg-zinc-800 hover:border-zinc-600 transition-all">View Rankings →</Link>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: <Zap size={20} />, title: "Structured Growth", desc: "Main clubs expand seamlessly into affiliated colleges through approved sub-branches.", color: "text-violet-400 bg-violet-500/10" },
          { icon: <Globe size={20} />, title: "Unified Network", desc: "Collaborate with thousands of students across Rajasthan through a single platform.", color: "text-cyan-400 bg-cyan-500/10" },
          { icon: <Shield size={20} />, title: "Quality Control", desc: "Aptitude-based onboarding ensures top-tier leadership in every sub-branch.", color: "text-emerald-400 bg-emerald-500/10" }
        ].map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all group"
          >
            <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
              {f.icon}
            </div>
            <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Club Listings */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">University Clubs</h2>
            <p className="text-sm text-zinc-500 mt-1">Browse and join clubs across the ClubConnect network</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search clubs..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-sm text-zinc-400 focus:outline-none focus:border-violet-500/50 transition-all"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-zinc-900 rounded-2xl animate-pulse border border-zinc-800"></div>
            ))}
          </div>
        ) : filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClubs.map((club, index) => (
              <motion.div 
                key={club.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl overflow-hidden flex flex-col group border border-zinc-800 bg-zinc-900/50 hover:border-violet-500/30 transition-all duration-300 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="p-6 flex-1 relative">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-[11px] font-semibold rounded-lg border border-violet-500/10">{club.domain}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-violet-400 transition-colors tracking-tight">{club.name}</h3>
                  <p className="text-sm text-zinc-500 mb-5 line-clamp-2 leading-relaxed">{club.description}</p>
                  
                  <div className="flex items-center gap-4 text-center">
                    <div className="flex-1 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-800">
                      <p className="text-lg font-bold font-mono text-white">{club.membersCount.toLocaleString()}</p>
                      <p className="text-[9px] uppercase text-zinc-600 font-bold tracking-widest mt-0.5">Members</p>
                    </div>
                    <div className="flex-1 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-800">
                      <p className="text-lg font-bold font-mono text-cyan-400">{club.subBranchesCount}</p>
                      <p className="text-[9px] uppercase text-zinc-600 font-bold tracking-widest mt-0.5">Nodes</p>
                    </div>
                    <div className="flex-1 py-2.5 rounded-lg bg-zinc-800/60 border border-zinc-800">
                      <p className="text-lg font-bold font-mono text-emerald-400">{club.activeProjectsCount}</p>
                      <p className="text-[9px] uppercase text-zinc-600 font-bold tracking-widest mt-0.5">Projects</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t border-zinc-800/80 flex items-center justify-between bg-zinc-900/30">
                  <Link to={`/club/${club.id}`} className="text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors flex items-center">
                    View Details <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                  <Link to={`/request-subbranch/${club.id}`} className="px-4 py-2 bg-zinc-800 hover:bg-violet-500 text-zinc-300 hover:text-white text-xs font-semibold rounded-lg transition-all border border-zinc-700 hover:border-violet-500">
                    Open Branch
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl border-2 border-dashed border-zinc-800">
            <p className="text-zinc-600 font-medium">No clubs found matching your search</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
