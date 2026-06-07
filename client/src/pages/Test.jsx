import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Timer, ClipboardList, CheckCircle, AlertCircle, ArrowRight, Brain, Briefcase, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const Test = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0); 
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/tests/quiz/${quizId}`);
        setQuiz(res.data);
        setTimeLeft(res.data.timeLimit * 60);
      } catch (err) {
        toast.error('Failed to load recruitment test');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted && quiz) {
      handleSubmit();
    }
  }, [timeLeft, submitted, quiz]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (submitted) return;
    
    setSubmitted(true);
    const initialTime = quiz.timeLimit * 60;
    const timeTaken = initialTime - timeLeft;

    try {
      const res = await axios.post(`http://localhost:5000/api/tests/quiz/${quizId}/submit`, { 
        answers, 
        timeTaken 
      });
      setResult(res.data);
      if (res.data.passed) {
        toast.success(`Excellent! You passed with ${res.data.score}%`);
      } else {
        toast.error(`Did not meet passing criteria. Score: ${res.data.score}%`);
      }
    } catch (err) {
      toast.error('Submission failed');
      setSubmitted(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TECHNICAL': return <Zap size={14} className="text-blue-400" />;
      case 'MANAGEMENT': return <Briefcase size={14} className="text-amber-400" />;
      case 'APTITUDE': return <Brain size={14} className="text-emerald-400" />;
      default: return <ClipboardList size={14} className="text-zinc-400" />;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-rtu-orange border-t-transparent rounded-full animate-spin"></div>
      <p className="text-zinc-500 font-mono tracking-tighter text-sm uppercase">Synchronizing Test Core...</p>
    </div>
  );

  if (result) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-10">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-32 h-32 rounded-[2rem] flex items-center justify-center mx-auto border-4 ${
            result.passed 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {result.passed ? <CheckCircle size={64} strokeWidth={1} /> : <AlertCircle size={64} strokeWidth={1} />}
        </motion.div>
        
        <div className="space-y-4">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">
            {result.passed ? 'Recruitment Passed' : 'Test Unsuccessful'}
          </h2>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">Final Score</p>
              <p className="text-4xl font-black text-white leading-none">{result.score}%</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">XP Earned</p>
              <p className="text-4xl font-black text-emerald-400 leading-none">+{result.result.pointsEarned}</p>
            </div>
          </div>
          <p className="text-zinc-500 font-medium pt-4 italic">Result has been recorded in the club leaderboard.</p>
        </div>

        <div className="pt-10">
          <button 
            onClick={() => navigate(`/club/${quiz.clubId}`)}
            className="btn-primary px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm active:scale-95 transition-all"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32 pt-10 px-4">
      {/* Dynamic Header */}
      <div className="glass p-8 rounded-[2.5rem] border border-white/5 sticky top-24 z-30 flex flex-col md:flex-row items-center justify-between shadow-2xl gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-rtu-orange/10 rounded-2xl flex items-center justify-center text-rtu-orange border border-rtu-orange/20 shadow-[0_0_20px_rgba(251,146,60,0.1)]">
            <ClipboardList size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase italic leading-tight tracking-tight">{quiz.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{quiz.questions?.length} Questions</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
              <span className="text-[10px] text-rtu-orange font-black uppercase tracking-widest">Passing: {quiz.passingScore}%</span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl border-2 transition-all ${
          timeLeft < 300 
            ? 'bg-red-500/10 border-red-500/50 text-red-400' 
            : 'bg-white/5 border-white/10 text-white shadow-inner'
        }`}>
          <Timer size={24} className={timeLeft < 300 ? 'animate-pulse' : ''} />
          <span className="text-3xl font-black font-mono tracking-tight leading-none">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions?.map((q, index) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-[2.5rem] border border-white/5 space-y-8 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] text-white">
              {getCategoryIcon(q.category)}
            </div>

            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center gap-2">
                <span className="w-10 h-10 rounded-xl bg-rtu-orange/10 text-rtu-orange flex items-center justify-center font-black text-sm border border-rtu-orange/20 shrink-0">
                  {index + 1}
                </span>
                <div className="w-px h-full bg-gradient-to-b from-rtu-orange/20 to-transparent"></div>
              </div>
              
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(q.category)}
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">{q.category}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white leading-relaxed tracking-tight">{q.text}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {q.options.map((option, optIdx) => (
                    <label 
                      key={optIdx} 
                      className={`
                        p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 group/opt active:scale-95
                        ${answers[q.id] === option 
                          ? 'bg-rtu-orange/10 border-rtu-orange text-rtu-orange shadow-[0_0_20px_rgba(251,146,60,0.05)]' 
                          : 'bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/20 hover:bg-white/5'}
                      `}
                    >
                      <input 
                        type="radio" 
                        name={q.id} 
                        className="hidden" 
                        value={option}
                        disabled={submitted}
                        onChange={() => setAnswers({...answers, [q.id]: option})}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        answers[q.id] === option ? 'border-rtu-orange bg-rtu-orange shadow-lg' : 'border-zinc-800'
                      }`}>
                        {answers[q.id] === option && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                      </div>
                      <span className="font-bold text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="flex flex-col md:flex-row items-center justify-between p-10 glass rounded-[3rem] border border-white/5 gap-8">
          <div className="flex items-center gap-5">
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-xl border-2 border-[#09090b] bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-700">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm text-white font-black uppercase tracking-tight italic">Protocol Verification</p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Automated submission enabled on timer expiry</p>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={submitted || Object.keys(answers).length < (quiz.questions?.length || 0)}
            className={`
              px-16 py-6 text-sm font-black uppercase tracking-[0.3em] rounded-2xl flex items-center transition-all active:scale-95
              ${Object.keys(answers).length < (quiz.questions?.length || 0)
                ? 'bg-white/5 text-zinc-700 cursor-not-allowed border border-white/5'
                : 'bg-rtu-orange text-[#09090b] hover:shadow-[0_0_40px_rgba(251,146,60,0.3)] hover:-translate-y-1'}
            `}
          >
            Finalize Mission <ArrowRight className="ml-3" strokeWidth={3} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Test;
