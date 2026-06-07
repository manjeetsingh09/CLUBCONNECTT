import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, ExternalLink, X } from 'lucide-react';

const NotificationDropdown = ({ 
  notifications, 
  onMarkRead, 
  onClearAll, 
  onClose 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-14 right-0 w-80 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-[60]"
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-violet-400" />
          <h3 className="text-sm font-bold text-white">Notifications</h3>
          {notifications.filter(n => !n.isRead).length > 0 && (
            <span className="px-1.5 py-0.5 bg-violet-500 text-[10px] font-bold text-white rounded-full">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={onClearAll}
            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Clear all"
          >
            <Trash2 size={14} />
          </button>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto divide-y divide-zinc-800/50 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-3 border border-zinc-800">
              <Bell size={20} className="text-zinc-700" />
            </div>
            <p className="text-sm text-zinc-500 font-medium">All caught up!</p>
            <p className="text-[11px] text-zinc-600 mt-1">No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id} 
              className={`p-4 hover:bg-zinc-900/50 transition-colors relative group ${!n.isRead ? 'bg-violet-500/[0.02]' : ''}`}
            >
              {!n.isRead && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
              )}
              <div className="flex flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-[13px] leading-relaxed ${n.isRead ? 'text-zinc-400' : 'text-zinc-200 font-medium'}`}>
                    {n.message}
                  </p>
                  {!n.isRead && (
                    <button 
                      onClick={() => onMarkRead(n.id)}
                      className="shrink-0 p-1 text-zinc-600 hover:text-emerald-400 rounded transition-all opactiy-0 group-hover:opacity-100"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-zinc-600 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {n.link && (
                    <a 
                      href={n.link} 
                      className="text-[10px] text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1"
                    >
                      Details <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-3 bg-zinc-900/30 border-t border-zinc-800">
          <button className="w-full py-2 text-center text-[11px] font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">
            View All History
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationDropdown;
