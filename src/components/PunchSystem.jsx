"use client";
import { useState, useEffect } from 'react';
import { LogIn, LogOut, MapPin, Clock } from 'lucide-react';
import { punchIn, punchOut } from '@/app/actions';

export default function PunchSystem({ isInitialWorking, activeRecordId, sessionStart }) {
  const [isWorking, setIsWorking] = useState(isInitialWorking);
  const [currentRecordId, setCurrentRecordId] = useState(activeRecordId);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setIsWorking(isInitialWorking);
    setCurrentRecordId(activeRecordId);
  }, [isInitialWorking, activeRecordId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }));
    return () => clearInterval(timer);
  }, []);

  const handlePunchIn = async () => {
    if(isWorking || isLoading) return;
    setIsLoading(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    const dateString = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    
    let loc = 'Acquiring location...';
    if (navigator.geolocation) {
       try {
         const pos = await new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 }));
         loc = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
       } catch(e) {
         loc = 'Loc Error';
       }
    } else loc = 'Not Supported';

    const record = await punchIn({
      empId: 'EMP102',
      name: 'krishna Pawar',
      email: 'pawarkrishna285@gmail.com',
      date: dateString,
      inTime: timeString,
      location: loc,
      remark: 'Web Punch'
    });
    
    setIsWorking(true);
    setCurrentRecordId(record.id);
    setIsLoading(false);
  };

  const handlePunchOut = async () => {
    if(!isWorking || isLoading || !currentRecordId) return;
    setIsLoading(true);

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });

    let hoursString = '00:00';
    if (sessionStart && sessionStart !== '-') {
       const start = new Date(sessionStart);
       if(!isNaN(start)) {
         const diffMs = now - start;
         const diffHrs = Math.floor(diffMs / 3600000);
         const diffMins = Math.floor((diffMs % 3600000) / 60000);
         hoursString = `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
       }
    }

    await punchOut(currentRecordId, timeString, hoursString);
    setIsWorking(false);
    setCurrentRecordId(null);
    setIsLoading(false);
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      
      <div className="flex flex-col items-center justify-center mb-8 mt-2">
        <div className="p-3 bg-slate-50 text-indigo-600 rounded-2xl mb-4 border border-slate-100">
           <Clock size={32} strokeWidth={2} />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{currentTime || "Loading..."}</h3>
        <p className="text-slate-500 font-medium text-sm mt-1">{todayStr}</p>
      </div>

      <div className="bg-slate-50 rounded-xl p-4 mb-8 flex items-start gap-3 border border-slate-100">
        <MapPin size={18} className="text-slate-400 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">Location Status</span>
          <span className="text-xs font-medium text-slate-500 mt-0.5">Location access required for valid attendance tagging.</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={handlePunchIn}
          disabled={isWorking || isLoading}
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
            isWorking || isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-500 hover:text-white hover:border-emerald-600 shadow-sm hover:shadow'
          }`}
        >
          <LogIn size={20} /> PUNCH IN
        </button>
        <button 
          onClick={handlePunchOut}
          disabled={!isWorking || isLoading}
          className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
            !isWorking || isLoading 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
              : 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-600 shadow-sm hover:shadow'
          }`}
        >
          <LogOut size={20}/> PUNCH OUT
        </button>
      </div>

      {isWorking && (
        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 py-2 px-4 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Active Session
        </div>
      )}
    </div>
  );
}
