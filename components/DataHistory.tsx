
import React from 'react';
import { X, ShieldCheck, Calendar, Droplet, Moon, Pill, Activity, Trash2, Edit2, Info, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HealthLog, UserProfile } from '../types';

interface DataHistoryProps {
  logs: HealthLog[];
  profile: UserProfile;
  onClose: () => void;
  onDeleteLog?: (id: string) => void;
}

const DataHistory: React.FC<DataHistoryProps> = ({ logs, profile, onClose, onDeleteLog }) => {
  const [activeTab, setActiveTab] = React.useState<'health' | 'granny'>('health');
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 lg:p-12"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-8 lg:p-12 border-b border-slate-50 flex justify-between items-center shrink-0">
          <div className="space-y-2">
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Health Records</h3>
            <p className="text-slate-400 font-medium italic flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              End-to-end private. Data remains within this circle.
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="px-8 lg:px-12 py-4 border-b border-slate-50 flex gap-4">
          <button 
            onClick={() => setActiveTab('health')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'health' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Health Logs
          </button>
          <button 
            onClick={() => setActiveTab('granny')}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'granny' ? 'bg-[#8B5E3C] text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            Granny Check-In
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-8">
          {activeTab === 'health' ? (
            logs.length === 0 ? (
              <div className="text-center py-20 space-y-4">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Calendar size={40} />
                </div>
                <p className="text-slate-400 font-medium">No records found yet. Start logging to see the journey here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {logs.slice().reverse().map((log) => (
                  <div key={log.id} className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 lg:p-8 space-y-6 hover:border-slate-200 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-900 font-bold">
                          {new Date(log.timestamp).getDate()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{new Date(log.timestamp).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors"><Edit2 size={16} /></button>
                        {onDeleteLog && (
                          <button 
                            onClick={() => onDeleteLog(log.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Droplet size={10} className="text-blue-500" /> Hydration</p>
                        <p className="text-lg font-bold text-slate-900">{log.waterIntake} Glasses</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Moon size={10} className="text-indigo-400" /> Rest</p>
                        <p className="text-lg font-bold text-slate-900">{log.sleepHours} Hours</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Activity size={10} className="text-rose-500" /> Pelvic</p>
                        <p className="text-lg font-bold text-slate-900">{log.kegelCount} Sets</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Pill size={10} className="text-emerald-500" /> Self-care</p>
                        <p className="text-lg font-bold text-slate-900">{log.medicationsTaken ? 'Completed' : 'Pending'}</p>
                      </div>
                    </div>

                    {(log.symptoms.length > 0 || log.notes) && (
                      <div className="pt-4 border-t border-slate-100 space-y-4">
                        {log.symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {log.symptoms.map(s => (
                              <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{s}</span>
                            ))}
                          </div>
                        )}
                        {log.notes && (
                          <p className="text-xs text-slate-500 font-medium italic leading-relaxed">"{log.notes}"</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            (!profile.grannyLogs || profile.grannyLogs.length === 0) ? (
              <div className="text-center py-20 space-y-4">
                <div className="h-20 w-20 bg-[#FFF9F5] rounded-full flex items-center justify-center mx-auto text-[#F3E5D8]">
                  <Sparkles size={40} />
                </div>
                <p className="text-slate-400 font-medium">No granny check-ins found yet. Share a whisper with Nani to see it here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {profile.grannyLogs.slice().reverse().map((log) => (
                  <div key={log.id} className="bg-[#FFF9F5]/50 border border-[#F3E5D8] rounded-3xl p-6 lg:p-8 space-y-6 hover:border-[#EAD7C5] transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#8B5E3C] font-bold">
                          {new Date(log.timestamp).getDate()}
                        </div>
                        <div>
                          <p className="font-bold text-[#5D4037]">{new Date(log.timestamp).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                          <p className="text-[10px] font-bold text-[#A1887F] uppercase tracking-widest">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-2xl border border-[#F3E5D8] space-y-2">
                        <p className="text-[8px] font-bold text-[#A1887F] uppercase tracking-widest">Question</p>
                        <p className="text-sm font-medium text-[#5D4037] italic">"{log.question}"</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-[#F3E5D8] space-y-2">
                          <p className="text-[8px] font-bold text-[#A1887F] uppercase tracking-widest">Your Response</p>
                          <p className="text-lg font-bold text-[#8B5E3C]">{log.answer}</p>
                        </div>
                        <div className="p-4 bg-[#8B5E3C]/5 rounded-2xl border border-[#F3E5D8] space-y-2">
                          <p className="text-[8px] font-bold text-[#A1887F] uppercase tracking-widest">Nani's Whisper</p>
                          <p className="text-xs font-medium text-[#5D4037] italic">"{log.reaction}"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center gap-4 shrink-0">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl"><Info size={20} /></div>
          <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider">
            Data is encrypted and stored locally. Health information is never shared with third parties without explicit consent.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DataHistory;
