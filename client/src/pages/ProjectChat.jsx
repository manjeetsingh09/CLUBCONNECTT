import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Flame, Rocket, Cpu, Zap, ArrowLeft, Users, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROJECTS = {
  'aero-jet': {
    name: 'HyperBurn X1 — Low-Combustion Jet Engine',
    club: 'SpaceRTU',
    college: 'Swami Keshvanand Institute of Technology (SKIT)',
    status: 'In Progress',
    description: 'A micro-turbine jet engine prototype achieving 40% less fuel combustion using plasma-assisted ignition. Targeting ISRO student rocketry competition 2025.',
    emoji: '🚀',
    color: 'text-amber-400',
    bg: 'from-amber-500/10',
    members: [
      { name: 'Sanjay Tak', avatar: 'S', role: 'Lead Engineer' },
      { name: 'Riya Verma', avatar: 'R', role: 'Combustion Analysis' },
      { name: 'Karan Singh', avatar: 'K', role: 'CFD Simulation' },
      { name: 'Ishita Meena', avatar: 'I', role: 'Materials Testing' },
      { name: 'Yash Gupta', avatar: 'Y', role: 'CAD Design' },
    ],
    messages: [
      { sender: 'Sanjay Tak', avatar: 'S', text: 'Team, the CFD results are in — we\'re hitting 38% less combustion at cruising RPM 🔥', time: '10:15 AM', fire: true },
      { sender: 'Karan Singh', avatar: 'K', text: 'Confirmed. The plasma ignition chamber is performing way above expectations. Thermal efficiency at 67%.', time: '10:18 AM' },
      { sender: 'Riya Verma', avatar: 'R', text: 'I ran the spectroscopy analysis — emission levels are within ISRO Stage-1 compliance ✅', time: '10:22 AM' },
      { sender: 'Ishita Meena', avatar: 'I', text: 'Titanium alloy casing survived the 1200°C stress test. Zero micro-fractures detected 💪', time: '10:30 AM', fire: true },
      { sender: 'Yash Gupta', avatar: 'Y', text: 'Updated the CAD model with the new nozzle geometry. Pushing to the shared drive now.', time: '10:35 AM' },
      { sender: 'Sanjay Tak', avatar: 'S', text: 'This is going to blow their minds at the competition. Let\'s do a full assembly test this Saturday.', time: '10:40 AM', fire: true },
      { sender: 'Karan Singh', avatar: 'K', text: 'I\'ll book the propulsion lab. Who can bring the high-speed camera?', time: '10:42 AM' },
      { sender: 'Riya Verma', avatar: 'R', text: 'I\'ll arrange it. Also, Prof. Sharma wants to observe the test run 🏆', time: '10:45 AM' },
    ]
  },
  'amphi-tank': {
    name: 'AmphibiX — Amphibious Rescue Tanker',
    club: 'RoboRTU',
    college: 'Jaipur Engineering College (JECRC)',
    status: 'Prototype Ready',
    description: 'An autonomous amphibious vehicle that seamlessly transitions between land and water. Designed for flood rescue operations in Rajasthan.',
    emoji: '🛡️',
    color: 'text-cyan-400',
    bg: 'from-cyan-500/10',
    members: [
      { name: 'Neha Sharma', avatar: 'N', role: 'Project Lead' },
      { name: 'Tanvi Joshi', avatar: 'T', role: 'Hull Design' },
      { name: 'Sahil Verma', avatar: 'S', role: 'Propulsion' },
      { name: 'Mannat Gupta', avatar: 'M', role: 'Electronics' },
      { name: 'Siddharth Singh', avatar: 'Si', role: 'Software' },
    ],
    messages: [
      { sender: 'Neha Sharma', avatar: 'N', text: 'Big update — the AmphibiX successfully completed its first water-to-land transition! 🌊➡️🏜️', time: '2:10 PM', fire: true },
      { sender: 'Sahil Verma', avatar: 'S', text: 'The dual-prop system is working perfectly. Water speed: 12 knots, land speed: 35 kmph.', time: '2:14 PM' },
      { sender: 'Tanvi Joshi', avatar: 'T', text: 'Hull integrity held perfectly. The inflatable skirt deployed in 1.2 seconds during transition.', time: '2:18 PM' },
      { sender: 'Mannat Gupta', avatar: 'M', text: 'GPS module + IMU fusion is giving us ±2cm positioning accuracy. Navigation is solid.', time: '2:22 PM', fire: true },
      { sender: 'Siddharth Singh', avatar: 'Si', text: 'Autonomous mode handled the obstacle course perfectly. Zero human intervention needed 🤖', time: '2:28 PM', fire: true },
      { sender: 'Neha Sharma', avatar: 'N', text: 'NDRF officers are visiting next week to evaluate AmphibiX for flood deployment. This could be huge! 🔥', time: '2:35 PM', fire: true },
    ]
  },
  'neural-lens': {
    name: 'NeuralLens — AI Diagnostic Scanner',
    club: 'DataRTU',
    college: 'Global Institute of Technology, Jaipur',
    status: 'Beta Testing',
    description: 'A portable AI-powered retinal scanner that detects diabetic retinopathy with 96.3% accuracy using a fine-tuned Vision Transformer model.',
    emoji: '🧠',
    color: 'text-violet-400',
    bg: 'from-violet-500/10',
    members: [
      { name: 'Amit Verma', avatar: 'A', role: 'ML Lead' },
      { name: 'Avani Sharma', avatar: 'Av', role: 'Data Engineer' },
      { name: 'Varun Meena', avatar: 'V', role: 'Backend' },
      { name: 'Kavya Gupta', avatar: 'Ka', role: 'UI/UX' },
      { name: 'Manish Singh', avatar: 'Ma', role: 'Hardware' },
    ],
    messages: [
      { sender: 'Amit Verma', avatar: 'A', text: 'NeuralLens v2.1 just hit 96.3% accuracy on the validation set. We beat the benchmark! 🎯', time: '4:05 PM', fire: true },
      { sender: 'Avani Sharma', avatar: 'Av', text: 'The augmented dataset from AIIMS is making a huge difference. 15,000 annotated retinal scans.', time: '4:10 PM' },
      { sender: 'Varun Meena', avatar: 'V', text: 'API latency is down to 180ms per inference. Running on a Jetson Nano — fully portable.', time: '4:15 PM' },
      { sender: 'Kavya Gupta', avatar: 'Ka', text: 'Redesigned the report screen — doctors can now see heatmaps overlaid on the scan. Looks cool 🎨', time: '4:20 PM' },
      { sender: 'Manish Singh', avatar: 'Ma', text: 'The 3D-printed housing is ready. Battery lasts 6 hours continuous use. Ready for field testing!', time: '4:25 PM', fire: true },
      { sender: 'Amit Verma', avatar: 'A', text: 'We\'re deploying to 3 rural clinics in Udaipur next month. This will change lives. 💜', time: '4:30 PM', fire: true },
    ]
  },
  'solar-drone': {
    name: 'SolWing — Solar-Powered Survey Drone',
    club: 'GreenRTU',
    college: 'Poornima Institute of Engineering, Jaipur',
    status: 'Field Testing',
    description: 'A fixed-wing solar drone for agricultural land surveying with 8-hour flight time. Uses multispectral imaging for crop health analysis.',
    emoji: '☀️',
    color: 'text-emerald-400',
    bg: 'from-emerald-500/10',
    members: [
      { name: 'Rohan Das', avatar: 'Ro', role: 'Aero Lead' },
      { name: 'Divya Meena', avatar: 'D', role: 'Solar Systems' },
      { name: 'Piyush Joshi', avatar: 'P', role: 'Imaging' },
      { name: 'Megha Verma', avatar: 'Me', role: 'Control Systems' },
    ],
    messages: [
      { sender: 'Rohan Das', avatar: 'Ro', text: 'SolWing completed a 6-hour non-stop flight today! Solar cells generated enough to keep 15% battery reserve 🌞', time: '11:00 AM', fire: true },
      { sender: 'Divya Meena', avatar: 'D', text: 'The new monocrystalline panels are amazing. 22% conversion efficiency even with cloud cover.', time: '11:05 AM' },
      { sender: 'Piyush Joshi', avatar: 'P', text: 'Multispectral camera captured NDVI data over 200 acres. Crop stress patterns clearly visible 🌾', time: '11:12 AM', fire: true },
      { sender: 'Megha Verma', avatar: 'Me', text: 'PID controller v3 handled 25 km/h crosswind. Stability is rock solid now.', time: '11:18 AM' },
      { sender: 'Rohan Das', avatar: 'Ro', text: '3 farmers in Sikar already want to use it next season. This is the future of precision agriculture! 🚁', time: '11:25 AM', fire: true },
    ]
  },
  'chain-vote': {
    name: 'ChainVote — Blockchain Voting Protocol',
    club: 'BlockRTU',
    college: 'Arya College of Engineering, Jaipur',
    status: 'Testnet Live',
    description: 'A zero-knowledge proof based voting system on Ethereum L2. Ensures voter privacy while maintaining full auditability.',
    emoji: '🗳️',
    color: 'text-fuchsia-400',
    bg: 'from-fuchsia-500/10',
    members: [
      { name: 'Vikram Patel', avatar: 'Vi', role: 'Solidity Lead' },
      { name: 'Shubham Sharma', avatar: 'Sh', role: 'ZK Circuits' },
      { name: 'Anjali Verma', avatar: 'An', role: 'Frontend' },
      { name: 'Kartik Gupta', avatar: 'Kr', role: 'Backend' },
    ],
    messages: [
      { sender: 'Vikram Patel', avatar: 'Vi', text: 'ChainVote smart contract deployed to Polygon testnet! Gas cost per vote: $0.002 ⛓️', time: '9:00 AM', fire: true },
      { sender: 'Shubham Sharma', avatar: 'Sh', text: 'ZK proof generation time: 800ms. Verification on-chain: 50ms. Privacy is bulletproof 🔒', time: '9:08 AM', fire: true },
      { sender: 'Anjali Verma', avatar: 'An', text: 'Voter dashboard is live. QR code scan → Cast vote → See proof. Clean UX flow.', time: '9:15 AM' },
      { sender: 'Kartik Gupta', avatar: 'Kr', text: 'Running a mock election with 500 test voters. Results tally matches perfectly. Zero discrepancies ✅', time: '9:22 AM' },
      { sender: 'Vikram Patel', avatar: 'Vi', text: 'RTU Student Council wants to use ChainVote for actual elections next semester! Let\'s make it happen 🏛️', time: '9:30 AM', fire: true },
    ]
  }
};

const FireParticle = () => (
  <motion.span
    className="inline-block text-xs"
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: Math.random() * 2 }}
  >
    🔥
  </motion.span>
);

const ProjectChat = () => {
  const { projectId } = useParams();
  const project = PROJECTS[projectId];
  const [newMsg, setNewMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (project) setMsgs(project.messages);
  }, [projectId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setMsgs(prev => [...prev, { sender: 'You', avatar: 'Y', text: newMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setNewMsg('');
  };

  if (!project) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/projects" className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-white">Project Labs</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(PROJECTS).map(([id, p]) => (
            <Link key={id} to={`/projects/${id}`} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-violet-500/30 transition-all overflow-hidden">
              <div className={`p-5 relative`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${p.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                      p.status === 'Prototype Ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      p.status === 'Beta Testing' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                      p.status === 'Testnet Live' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' :
                      p.status === 'Field Testing' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    } uppercase tracking-wider`}>{p.status}</span>
                  </div>
                  <h3 className={`text-base font-bold text-white mb-1 group-hover:${p.color} transition-colors`}>{p.name}</h3>
                  <p className="text-[11px] text-zinc-600 mb-3">
                    <span className={p.color}>{p.club}</span> · {p.college}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex -space-x-2">
                      {p.members.slice(0, 4).map((m, i) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-400">{m.avatar}</div>
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-zinc-600">{p.members.length} members</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="rounded-xl border border-zinc-800 p-4 mb-4 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Link to="/projects" className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-500">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{project.emoji}</span>
                <h2 className="text-base font-bold text-white">{project.name}</h2>
                {['🔥', '🔥'].map((f, i) => <FireParticle key={i} />)}
              </div>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                <span className={project.color}>{project.club}</span>
                <span className="mx-1.5 text-zinc-800">·</span>
                {project.college}
                <span className="mx-1.5 text-zinc-800">·</span>
                <span className={`${
                  project.status === 'Prototype Ready' ? 'text-emerald-400' :
                  project.status === 'Beta Testing' ? 'text-violet-400' :
                  project.status === 'Testnet Live' ? 'text-fuchsia-400' :
                  project.status === 'Field Testing' ? 'text-cyan-400' :
                  'text-amber-400'
                }`}>{project.status}</span>
              </p>
            </div>
          </div>
          <div className="flex -space-x-2">
            {project.members.map((m, i) => (
              <div key={i} title={`${m.name} — ${m.role}`} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-zinc-300 hover:scale-110 hover:z-10 transition-transform cursor-pointer">
                {m.avatar}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 space-y-1 mb-4">
        <div className="text-center py-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-full text-[10px] font-mono text-zinc-600">
            <Wrench size={10} /> PROJECT LAB · ENCRYPTED CHANNEL
          </div>
        </div>
        
        <AnimatePresence>
          {msgs.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 py-2.5 group"
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                msg.sender === 'You' 
                  ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white' 
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-zinc-200">{msg.sender}</span>
                  <span className="text-[10px] font-mono text-zinc-700">{msg.time}</span>
                  {msg.fire && <span className="text-xs animate-pulse">🔥</span>}
                </div>
                <p className="text-[13px] text-zinc-400 leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input 
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
        />
        <button type="submit" className="btn-primary px-5 rounded-xl flex items-center gap-2 text-sm">
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default ProjectChat;
