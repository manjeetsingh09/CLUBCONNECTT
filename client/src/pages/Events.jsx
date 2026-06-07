import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  MapPin, 
  User, 
  Timer, 
  ExternalLink,
  ChevronRight,
  Zap,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(e => {
    const matchesFilter = filter === 'ALL' || e.status === filter;
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'ONGOING': return 'text-green-400 bg-green-400/10 border-green-400/20 animate-pulse';
      case 'PAST': return 'text-rtu-light/30 bg-white/5 border-white/5';
      default: return 'text-white';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-rtu-orange border-t-transparent rounded-full animate-spin"></div>
      <p className="text-rtu-light/40 font-mono tracking-tighter">INITIALIZING STREAM...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-10">
        <div className="space-y-4 text-center lg:text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center lg:justify-start space-x-2 text-rtu-orange font-mono text-xs font-bold tracking-[0.3em] uppercase mb-2"
          >
            <Zap size={14} fill="currentColor" />
            <span>Digital Hub</span>
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic select-none">
            Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-rtu-orange to-yellow-400">Events</span>
          </h1>
          <p className="text-rtu-light/50 max-w-lg text-sm tracking-wide leading-relaxed mx-auto lg:mx-0">
            Stay ahead of the curve. Join university-wide hackathons, workshops, and seminars happening across the RTU network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search events..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 text-white focus:outline-none focus:border-rtu-orange transition-all font-medium text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {['ALL', 'UPCOMING', 'PAST'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${filter === f ? 'bg-rtu-orange text-rtu-deep shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'text-rtu-light/40 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="group relative h-full"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rtu-orange to-purple-600 rounded-[2.5rem] opacity-0 group-hover:opacity-20 transition duration-500 blur"></div>
                
                <div className="relative glass-dark h-full flex flex-col rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:-translate-y-1">
                  {/* Event Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1] transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-rtu-deep/90 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(event.status)} backdrop-blur-md shadow-2xl`}>
                        {event.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-6">
                      <div className="flex items-center space-x-2 text-white/90">
                        <Calendar size={14} className="text-rtu-orange" />
                        <span className="text-sm font-bold">{new Date(event.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-rtu-orange uppercase tracking-[.2em] mb-3 opacity-60">
                      <Tag size={12} />
                      <span>{event.type || 'Technical'}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 line-clamp-2 leading-tight group-hover:text-rtu-orange transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-rtu-light/50 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                      {event.description}
                    </p>

                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-rtu-light/40">
                          <MapPin size={16} />
                          <span className="text-xs font-bold truncate max-w-[120px]">{event.location || 'RTU HQ'}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400 font-mono text-xs font-black">
                          <Zap size={14} fill="currentColor" />
                          <span>+{event.pointsAwarded} XP</span>
                        </div>
                      </div>

                      {event.speaker && (
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-2xl border border-white/5">
                          <div className="w-8 h-8 rounded-full bg-rtu-orange/20 flex items-center justify-center text-rtu-orange">
                            <User size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-rtu-light/30 tracking-widest">Keynote Speaker</p>
                            <p className="text-xs font-bold text-white truncate">{event.speaker}</p>
                          </div>
                        </div>
                      )}

                      <button className="w-full mt-2 btn-primary py-4 rounded-2xl font-bold text-sm tracking-widest uppercase flex items-center justify-center group/btn active:scale-95 transition-all">
                        Secure Spot <ChevronRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 glass rounded-[2rem] border-2 border-dashed border-white/5">
              <p className="text-rtu-light/30 font-bold uppercase tracking-widest">No matching events found in the network</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
