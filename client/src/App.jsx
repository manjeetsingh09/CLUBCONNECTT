import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { AuthProvider, useAuth } from './context/AuthContext';

const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

const AnalyticsTracker = () => {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.send({ 
      hitType: "pageview", 
      page: location.pathname + location.search 
    });
  }, [location]);

  return null;
};

import { SocketProvider } from './context/SocketContext';
import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClubDetail from './pages/ClubDetail';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import Chat from './pages/Chat';
import Test from './pages/Test';
import SubBranchRequest from './pages/SubBranchRequest';
import Events from './pages/Events';
import ProjectChat from './pages/ProjectChat';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { useSocket } from './context/SocketContext';
import { toast } from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-rtu-deep flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const RoleRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-rtu-deep flex items-center justify-center text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) {
    toast.error('Unauthorized access denied.');
    return <Navigate to="/dashboard" />;
  }
  return children;
};

import Requests from './pages/Requests';

function AppContent() {
  const { user } = useAuth();
  const socket = useSocket();

  React.useEffect(() => {
    if (socket) {
      socket.on('message', (msg) => {
        if (msg.roomId === 'global' && window.location.pathname !== '/chat/global') {
          toast(`${msg.senderName}: ${msg.content}`, {
            icon: <MessageSquare size={20} className="text-rtu-orange" />,
            style: {
              background: '#0a0f1e',
              color: '#d1d5db',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              fontSize: '0.8rem',
              fontWeight: '600'
            }
          });
        }
      });
      return () => socket.off('message');
    }
  }, [socket]);

  return (
    <div className="min-h-screen bg-rtu-deep text-rtu-light flex flex-col">
      <AnalyticsTracker />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar />}
        <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${user ? 'ml-0 md:ml-0' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/club/:id" element={<ProtectedRoute><ClubDetail /></ProtectedRoute>} />
            <Route path="/chat/:roomId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/test/:type" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/test/quiz/:quizId" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/request-subbranch/:clubId" element={<ProtectedRoute><SubBranchRequest /></ProtectedRoute>} />
            <Route path="/requests" element={<RoleRoute roles={['SUPER_ADMIN', 'CLUB_COORDINATOR']}><Requests /></RoleRoute>} />
            <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectChat /></ProtectedRoute>} />
            <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectChat /></ProtectedRoute>} />
            <Route path="/admin" element={<RoleRoute roles={['SUPER_ADMIN']}><Dashboard /></RoleRoute>} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
