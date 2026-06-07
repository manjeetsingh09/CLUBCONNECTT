import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Building, GraduationCap, Phone, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    collegeName: '',
    branch: '',
    year: '',
    role: 'MEMBER',
    phone: '',
    linkedin: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(res.data.token, res.data.user);
      toast.success(`Welcome to RTU Connect, ${res.data.user.fullName}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const colleges = [
    "Arya College of Engineering, Jaipur",
    "Poornima Institute of Engineering, Jaipur",
    "Global Institute of Technology, Jaipur",
    "Swami Keshvanand Institute, Jaipur",
    "Rajasthan College of Engineering for Women, Jaipur",
    "Bikaner Technical University College",
    "Pacific University, Udaipur",
    "Jodhpur Institute of Engineering",
    "RTU Kota"
  ];

  return (
    <div className="min-h-screen py-12 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 md:p-12 rounded-3xl w-full max-w-2xl border border-white/10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-rtu-orange/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rtu-orange">
            <UserPlus size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-rtu-light/60">Join the largest network of university clubs across Rajasthan</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <input 
                type="text" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <input 
                type="email" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* College Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">College Name</label>
            <div className="relative group">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <select 
                required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all appearance-none"
                value={formData.collegeName}
                onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
              >
                <option value="">Select College</option>
                {colleges.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Branch & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">Branch</label>
              <input 
                type="text" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="CS / IT"
                value={formData.branch}
                onChange={(e) => setFormData({...formData, branch: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-rtu-light/80 block ml-1">Year</label>
              <input 
                type="number" min="1" max="4" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="1-4"
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">Role</label>
            <div className="relative group">
              <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <select 
                required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="MEMBER">General Member</option>
                <option value="CLUB_COORDINATOR">RTU Club Head</option>
                <option value="COLLEGE_COORDINATOR">College Branch Lead</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <input 
                type="tel" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="+91 00000 00000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          {/* LinkedIn (Optional) */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">LinkedIn Profile (Optional)</label>
            <div className="relative group">
              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <input 
                type="url"
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium text-rtu-light/80 block ml-1">Create Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-rtu-light/40 group-focus-within:text-rtu-orange transition-colors" size={20} />
              <input 
                type="password" required
                className="w-full bg-rtu-deep/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-rtu-orange transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary md:col-span-2 py-4 text-lg font-bold flex items-center justify-center group"
          >
            {loading ? 'Creating Account...' : (
              <>
                Complete Registration <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-rtu-light/60">
            Already have an account? <Link to="/login" className="text-rtu-orange font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
