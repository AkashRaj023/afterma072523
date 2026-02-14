
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ShieldAlert, Phone, User, X, AlertTriangle } from 'lucide-react';
import { HELPLINES } from '../constants';

interface SOSProps {
  profile: UserProfile;
  onClose: () => void;
}

const SOSOverlay: React.FC<SOSProps> = ({ profile, onClose }) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] bg-red-600 flex items-center justify-center p-8 animate-in zoom-in duration-300">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X size={32} /></button>
        
        <div className="text-center space-y-4">
           <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldAlert size={48} />
           </div>
           <h2 className="text-4xl font-black text-gray-900 leading-tight">SOS Help System</h2>
           <p className="text-gray-500 text-lg">Your safety is our priority. How would you like to proceed?</p>
        </div>

        {!confirmed ? (
          <div className="space-y-6">
             <button 
                onClick={() => setConfirmed(true)}
                className="w-full py-6 bg-red-600 text-white rounded-full text-xl font-black shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-95 transition-all"
             >
                YES, I NEED HELP NOW
             </button>
             <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Confirming will notify contacts and display helplines</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
             <div className="p-8 bg-red-50 rounded-[2rem] border border-red-100 flex items-center gap-6">
                <AlertTriangle className="text-red-600 shrink-0" size={32} />
                <div>
                   <h4 className="font-bold text-red-900">Emergency Alert Active</h4>
                   <p className="text-sm text-red-700">SMS alert sent to your emergency contact: <span className="font-black underline">{profile.emergencyContact || 'Not Set'}</span></p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a href={`tel:${HELPLINES.emergency}`} className="p-8 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center gap-3 group hover:border-red-500 transition-all">
                   <Phone className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
                   <span className="text-2xl font-black">Call {HELPLINES.emergency}</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">Emergency Police/Ambulance</span>
                </a>
                <a href={`tel:${HELPLINES.india.number}`} className="p-8 rounded-[2rem] border-2 border-gray-100 flex flex-col items-center gap-3 group hover:border-red-500 transition-all">
                   <User className="text-red-500 group-hover:scale-110 transition-transform" size={32} />
                   <span className="text-2xl font-black">{HELPLINES.india.number}</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase">{HELPLINES.india.name}</span>
                </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOSOverlay;
