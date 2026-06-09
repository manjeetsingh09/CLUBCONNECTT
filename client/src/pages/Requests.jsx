import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CheckCircle2, XCircle, Clock, Building, 
  Users, MessageSquare, Filter, 
  Search, GitBranch, Handshake, ChevronRight,
  ExternalLink, Check, X, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests/${id}`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`Request ${status.toLowerCase()} successfully`);
      fetchRequests(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.coordinator1Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || req.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || req.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'UNDER_REVIEW': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 size={16} />;
      case 'REJECTED': return <XCircle size={16} />;
      case 'UNDER_REVIEW': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="text-violet-500" />
            Branch & Collab <span className="text-zinc-500 font-light">Requests</span>
          </h1>
          <p className="text-zinc-500 max-w-lg">
            Manage institutional expansion and collaboration proposals from colleges across the network.
          </p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-1.5 flex gap-1">
          {['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ALL'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterStatus === s 
                ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search college or coordinator..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5">
          {['ALL', 'SUB_BRANCH', 'COLLABORATION'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === t 
                ? 'bg-zinc-800 text-white' 
                : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {t === 'SUB_BRANCH' && <GitBranch size={14} />}
              {t === 'COLLABORATION' && <Handshake size={14} />}
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 px-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
          <Filter size={16} className="text-zinc-600" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
            {filteredRequests.length} results found
          </span>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-zinc-500 font-medium">Fetching secure data...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-24 glass rounded-3xl border border-dashed border-zinc-800 text-center">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto text-zinc-600 mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No requests found</h3>
            <p className="text-zinc-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRequests.map((req) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={req.id}
                  className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${req.type === 'SUB_BRANCH' ? 'from-violet-600/5' : 'from-cyan-600/5'} to-transparent rounded-bl-full`} />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${req.type === 'SUB_BRANCH' ? 'bg-violet-500/10 text-violet-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
                          {req.type === 'SUB_BRANCH' ? <GitBranch size={24} /> : <Handshake size={24} />}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors uppercase tracking-tight">{req.collegeName}</h3>
                          <div className="flex items-center gap-2 text-zinc-500 text-sm mt-1">
                            <Clock size={14} />
                            <span>Submitted on {new Date(req.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusStyle(req.status)} flex items-center gap-1`}>
                              {getStatusIcon(req.status)}
                              {req.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <div className="flex items-center gap-3 text-zinc-400">
                          <Users size={16} className="text-zinc-600" />
                          <span className="text-sm">Coordinators: <strong className="text-zinc-300">{req.coordinator1Name}</strong> {req.coordinator2Name && `& ${req.coordinator2Name}`}</span>
                        </div>
                        <div className="flex items-center gap-3 text-zinc-400">
                          <Building size={16} className="text-zinc-600" />
                          <span className="text-sm">Capacity: <strong className="text-zinc-300">{req.expectedMembers}+ members</strong></span>
                        </div>
                      </div>

                      <div className="bg-zinc-800/30 rounded-2xl p-4 border border-zinc-800/50">
                        <p className="text-zinc-400 text-sm leading-relaxed italic">
                          "{req.reason}"
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                      {req.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleAction(req.id, 'APPROVED')}
                            className="bg-emerald-500 text-black px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          >
                            <Check size={18} /> Approve
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'REJECTED')}
                            className="bg-zinc-800 text-rose-400 px-6 py-3 rounded-2xl font-bold border border-zinc-700 flex items-center justify-center gap-2 hover:bg-rose-500/10 transition-all"
                          >
                            <X size={18} /> Reject
                          </button>
                          <button 
                            onClick={() => handleAction(req.id, 'UNDER_REVIEW')}
                            className="bg-zinc-800 text-amber-500 px-6 py-3 rounded-2xl font-bold border border-zinc-700 flex items-center justify-center gap-2 hover:bg-amber-500/10 transition-all font-mono text-xs"
                          >
                             UNDER REVIEW
                          </button>
                        </>
                      )}
                      
                      {req.status !== 'PENDING' && (
                        <div className="flex flex-col gap-3">
                           <div className={`px-6 py-3 rounded-2xl font-bold border flex items-center justify-center gap-2 ${getStatusStyle(req.status)}`}>
                             {getStatusIcon(req.status)} {req.status}
                           </div>
                           <button 
                            onClick={() => handleAction(req.id, 'PENDING')}
                            className="text-zinc-600 hover:text-zinc-400 text-xs font-bold transition-colors"
                          >
                            Revert to Pending
                          </button>
                        </div>
                      )}
                      
                      <button className="text-zinc-500 hover:text-white flex items-center justify-center gap-1.5 text-xs font-bold p-2 transition-colors">
                        View College Profile <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requests;
