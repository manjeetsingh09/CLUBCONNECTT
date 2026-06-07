import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Trophy, Zap, Flame, TrendingUp, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedCounter = ({ value, delay = 0 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const end = value;
      const duration = 1200;
      const step = end / (duration / 16);
      const counter = setInterval(() => {
        start += step;
        if (start >= end) { setCount(end); clearInterval(counter); }
        else setCount(Math.floor(start));
      }, 16);
      return () => clearInterval(counter);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return <span>{count.toLocaleString()}</span>;
};

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const maxPoints = data.length > 0 ? data[0].points : 1;
  const topThree = data.slice(0, 3);
  const rest = data.slice(3);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-600 text-sm font-mono">Loading rankings...</p>
    </div>
  );

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="text-center space-y-3 pt-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-xs font-semibold">
          <Sparkles size={14} />
          <span>Season 2024 · Q4 Rankings</span>
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Leaderboard</h1>
      </div>

      {/* === PODIUM === */}
      {topThree.length >= 3 && (
        <div className="flex items-end justify-center gap-3 md:gap-5 px-4 pt-8">
          {/* 2nd Place */}
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex-1 max-w-[200px]">
            <div className="text-center mb-3">
              <div className="w-14 h-14 mx-auto bg-zinc-800 border-2 border-zinc-600 rounded-full flex items-center justify-center text-2xl font-black text-zinc-300 shadow-lg">2</div>
            </div>
            <div className="bg-gradient-to-t from-zinc-800/80 to-zinc-800/30 border border-zinc-700/50 rounded-t-2xl p-5 text-center h-40 flex flex-col justify-end">
              <p className="text-xs text-zinc-400 font-medium truncate mb-1">{topThree[1].collegeName}</p>
              <p className="text-[10px] text-violet-400 font-semibold mb-2">{topThree[1].mainClub?.name}</p>
              <p className="text-3xl font-black font-mono text-white"><AnimatedCounter value={topThree[1].points} delay={200} /></p>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">XP EARNED</p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="flex-1 max-w-[220px]">
            <div className="text-center mb-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <Trophy size={28} className="text-amber-900" />
              </div>
            </div>
            <div className="bg-gradient-to-t from-amber-500/10 to-amber-500/[0.02] border border-amber-500/20 rounded-t-2xl p-5 text-center h-52 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.08),transparent_70%)]"></div>
              <div className="relative">
                <p className="text-sm text-amber-200/80 font-semibold truncate mb-1">{topThree[0].collegeName}</p>
                <p className="text-[10px] text-violet-400 font-semibold mb-3">{topThree[0].mainClub?.name}</p>
                <p className="text-5xl font-black font-mono text-white tracking-tight"><AnimatedCounter value={topThree[0].points} delay={100} /></p>
                <p className="text-[10px] font-mono text-amber-400 mt-1 flex items-center justify-center gap-1"><Flame size={10} />XP EARNED</p>
              </div>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="flex-1 max-w-[200px]">
            <div className="text-center mb-3">
              <div className="w-14 h-14 mx-auto bg-zinc-800 border-2 border-orange-700/50 rounded-full flex items-center justify-center text-2xl font-black text-orange-400 shadow-lg">3</div>
            </div>
            <div className="bg-gradient-to-t from-orange-900/20 to-transparent border border-orange-800/20 rounded-t-2xl p-5 text-center h-32 flex flex-col justify-end">
              <p className="text-xs text-zinc-400 font-medium truncate mb-1">{topThree[2].collegeName}</p>
              <p className="text-[10px] text-violet-400 font-semibold mb-2">{topThree[2].mainClub?.name}</p>
              <p className="text-3xl font-black font-mono text-white"><AnimatedCounter value={topThree[2].points} delay={300} /></p>
              <p className="text-[10px] font-mono text-zinc-500 mt-1">XP EARNED</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* === POINTS TABLE === */}
      <div className="rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="bg-zinc-900/80 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            All Rankings
          </h3>
          <span className="text-[10px] font-mono text-zinc-600">{data.length} NODES</span>
        </div>

        <div className="divide-y divide-zinc-800/70">
          {data.map((item, index) => {
            const pct = Math.round((item.points / maxPoints) * 100);
            const isTop3 = index < 3;
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className={`group flex items-center gap-4 px-6 py-4 hover:bg-zinc-800/40 transition-colors ${isTop3 ? 'bg-zinc-900/40' : ''}`}
              >
                {/* Rank */}
                <div className="w-8 text-center shrink-0">
                  {index === 0 ? <span className="text-amber-400 text-lg">🥇</span> :
                   index === 1 ? <span className="text-zinc-300 text-lg">🥈</span> :
                   index === 2 ? <span className="text-orange-400 text-lg">🥉</span> :
                   <span className="text-sm font-mono font-bold text-zinc-600">{String(index + 1).padStart(2, '0')}</span>}
                </div>

                {/* College Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${isTop3 ? 'text-white' : 'text-zinc-300'}`}>{item.collegeName}</p>
                  <p className="text-[11px] text-zinc-600">
                    <span className="text-violet-400">{item.mainClub?.name}</span>
                  </p>
                </div>

                {/* Visual Bar */}
                <div className="hidden md:block w-32">
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: index * 0.08, ease: 'circOut' }}
                      className={`h-full rounded-full ${
                        index === 0 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                        index === 1 ? 'bg-gradient-to-r from-zinc-400 to-zinc-300' :
                        index === 2 ? 'bg-gradient-to-r from-orange-500 to-amber-400' :
                        'bg-gradient-to-r from-violet-500 to-cyan-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0 w-28">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className={`text-xl font-bold font-mono tabular-nums ${isTop3 ? 'text-white' : 'text-zinc-300'}`}>
                      {item.points.toLocaleString()}
                    </span>
                    <span className="text-[9px] font-mono text-violet-400/70 font-bold">XP</span>
                  </div>
                  <div className="flex items-center justify-end gap-0.5 mt-0.5">
                    <ArrowUpRight size={10} className="text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400">+{Math.floor(item.points * 0.03)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Total Network Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total XP', value: data.reduce((s, d) => s + d.points, 0).toLocaleString(), color: 'text-violet-400' },
          { label: 'Active Nodes', value: data.length, color: 'text-cyan-400' },
          { label: 'Top Score', value: maxPoints.toLocaleString(), color: 'text-amber-400' },
          { label: 'Avg Score', value: data.length > 0 ? Math.round(data.reduce((s, d) => s + d.points, 0) / data.length).toLocaleString() : '0', color: 'text-emerald-400' }
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 text-center">
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-lg flex items-center justify-center text-violet-400">
            <Zap size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Want your college on the board?</h3>
            <p className="text-xs text-zinc-500">Open a sub-branch and start earning XP.</p>
          </div>
        </div>
        <Link to="/" className="btn-primary py-3 px-6 text-sm font-semibold">Explore Clubs →</Link>
      </div>
    </div>
  );
};

export default Leaderboard;
