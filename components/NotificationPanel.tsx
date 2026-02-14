
import React from 'react';
import { Bell, X, Trash2, Calendar, Pill, Activity } from 'lucide-react';

interface NotificationPanelProps {
  notifications: any[];
  onClose: () => void;
  onClear: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onClear }) => {
  return (
    <div className="fixed top-0 right-0 w-96 h-screen bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-8 flex items-center justify-between border-b border-gray-100 bg-pink-50/50">
        <div className="flex items-center gap-3">
          <Bell className="text-pink-500" />
          <h3 className="text-xl font-black text-gray-900">Notifications</h3>
        </div>
        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-gray-300">
             <Bell size={64} opacity={0.2} />
             <p className="font-bold">All clear! No new alerts.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-2 hover:border-pink-200 transition-colors cursor-pointer group">
               <div className="flex justify-between items-start">
                  <h4 className="font-black text-gray-800 text-sm">{n.title}</h4>
                  <span className="text-[10px] font-bold text-gray-400">{n.time}</span>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed">{n.text}</p>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-8 border-t border-gray-100">
          <button 
            onClick={onClear}
            className="w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 rounded-3xl flex items-center justify-center gap-3 font-bold text-sm hover:border-red-200 hover:text-red-400 transition-all"
          >
            <Trash2 size={18} /> Clear All History
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
