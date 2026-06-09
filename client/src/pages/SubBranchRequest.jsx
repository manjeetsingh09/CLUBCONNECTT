import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { GitBranchPlus, Building, Users, MessageSquare, Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const SubBranchRequest = () => {
  const { clubId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'SUB_BRANCH',
    collegeName: user.collegeName,
    coordinator1Name: user.fullName,
    coordinator2Name: '',
    reason: '',
    expectedMembers: 50
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requests`, { ...formData, clubId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success(`${formData.type === 'SUB_BRANCH' ? 'Sub-branch' : 'Collaboration'} request submitted!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-rtu-light/40 hover:text-rtu-orange transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Club
      </button>

      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rtu-orange/20 rounded-2xl flex items-center justify-center mx-auto text-rtu-orange">
            {formData.type === 'SUB_BRANCH' ? <GitBranchPlus size={32} /> : <Handshake size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-white">
            {formData.type === 'SUB_BRANCH' ? 'Request Sub-Branch' : 'Propose Collaboration'}
          </h2>
          <p className="text-rtu-light/60 max-w-lg mx-auto">
            {formData.type === 'SUB_BRANCH' 
              ? 'Scale the impact of RTU clubs by establishing a local chapter in your college.'
              : 'Partner with this club for events, projects, or knowledge sharing initiatives.'}
          </p>
        </div>

        <div className="flex bg-rtu-deep/40 p-1.5 rounded-2xl border border-white/5 mx-auto max-w-sm">
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'SUB_BRANCH'})}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.type === 'SUB_BRANCH' ? 'bg-rtu-orange text-white' : 'text-rtu-light/40 hover:text-rtu-light'}`}
          >
            Sub-Branch
          </button>
          <button 
            type="button"
            onClick={() => setFormData({...formData, type: 'COLLABORATION'})}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${formData.type === 'COLLABORATION' ? 'bg-rtu-orange text-white' : 'text-rtu-light/40 hover:text-rtu-light'}`}
          >
            Collaboration
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">College Name</label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40" size={20} />
                <input 
                  type="text" required
                  className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                  value={formData.collegeName}
                  onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">
                {formData.type === 'SUB_BRANCH' ? 'Expected Members' : 'Est. Participant Count'}
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40" size={20} />
                <input 
                  type="number" required min="10"
                  className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                  value={formData.expectedMembers}
                  onChange={(e) => setFormData({...formData, expectedMembers: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">Lead Coordinator</label>
              <input 
                type="text" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                value={formData.coordinator1Name}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">Co-Coordinator (Optional)</label>
              <input 
                type="text"
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="Senior Student Name"
                value={formData.coordinator2Name}
                onChange={(e) => setFormData({...formData, coordinator2Name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">
              {formData.type === 'SUB_BRANCH' ? 'Reason for Expansion' : 'Collaboration Proposal'}
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-rtu-light/40" size={20} />
              <textarea 
                required rows="4"
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all resize-none"
                placeholder={formData.type === 'SUB_BRANCH' 
                  ? "Explain why your college needs this club..." 
                  : "Outline your collaboration idea, events, or shared goals..."}
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              ></textarea>
            </div>
          </div>

          <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start space-x-3">
            <div className="mt-1 text-yellow-500">
              <Users size={16} />
            </div>
            <p className="text-xs text-rtu-light/60 leading-relaxed font-medium">
              Note: Upon submission, the Main Club Coordinator will review your request. {formData.type === 'SUB_BRANCH' ? 'You may be asked to undergo an eligibility test.' : 'They will reach out to discuss the proposal further.'}
            </p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center group"
          >
            {loading ? 'Submitting...' : (
              <>
                Submit {formData.type === 'SUB_BRANCH' ? 'Application' : 'Proposal'} 
                <Send size={20} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

import { Handshake } from 'lucide-react';

export default SubBranchRequest;
