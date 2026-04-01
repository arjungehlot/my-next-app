"use client";
import { useState, useEffect, useRef } from 'react';
import { LogIn, LogOut, MapPin, Clock, CheckCircle, AlertTriangle, Loader2, Sparkles, Navigation } from 'lucide-react';
import { punchIn, punchOut, autoPunchOut } from '@/app/actions';

function getLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ ok: false, msg: 'Geolocation not supported', coords: null });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        ok: true,
        msg: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
        coords: `${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`,
        accuracy: Math.round(pos.coords.accuracy),
      }),
      (err) => {
        const msg = err.code === 1 ? 'Permission denied — please allow location'
                  : err.code === 2 ? 'Position unavailable'
                  : 'Location timeout';
        resolve({ ok: false, msg, coords: null });
      },
      { timeout: 10000, maximumAge: 30000, enableHighAccuracy: false }
    );
  });
}

export default function PunchSystem({ isInitialWorking, activeRecordId, sessionStart }) {
  const [isWorking,       setIsWorking]       = useState(isInitialWorking);
  const [currentRecordId, setCurrentRecordId] = useState(activeRecordId);
  const [isLoading,       setIsLoading]       = useState(false);
  const [currentTime,     setCurrentTime]     = useState('');
  const [locStatus,       setLocStatus]       = useState('idle'); // idle | requesting | granted | denied
  const [locMsg,          setLocMsg]          = useState('Enable location tagging for security.');
  const [locCoords,       setLocCoords]       = useState(null);
  const [autoMsg,         setAutoMsg]         = useState('');
  const autoPunchedRef = useRef(false);

  useEffect(() => {
    const tick = () => setCurrentTime(
      new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })
    );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setIsWorking(isInitialWorking);
    setCurrentRecordId(activeRecordId);
  }, [isInitialWorking, activeRecordId]);

  useEffect(() => {
    const AUTO_HOUR = 18;
    const check = async () => {
      if (autoPunchedRef.current) return;
      const istH = parseInt(new Date().toLocaleString('en-IN', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }));
      if (istH >= AUTO_HOUR && isWorking && currentRecordId) {
        autoPunchedRef.current = true;
        setAutoMsg('⏰ Auto Punch-Out triggered (6:00 PM)');
        const result = await autoPunchOut(currentRecordId, sessionStart);
        if (result.success) {
          setIsWorking(false);
          setCurrentRecordId(null);
          setAutoMsg(`✅ Auto Punch-Out done at ${result.outTime}`);
        } else {
          autoPunchedRef.current = false;
          setAutoMsg('⚠ Auto Punch-Out failed');
        }
      }
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [isWorking, currentRecordId, sessionStart]);

  const requestLocation = async () => {
    setLocStatus('requesting');
    const result = await getLocation();
    if (result.ok) {
      setLocStatus('granted');
      setLocMsg(`📍 ${result.msg}`);
      setLocCoords(result.coords);
    } else {
      setLocStatus('denied');
      setLocMsg(result.msg);
    }
  };

  const handlePunchIn = async () => {
    if (isWorking || isLoading) return;
    setIsLoading(true);
    let locationTag = locCoords || 'Web Punch';
    const fresh = await getLocation();
    if (fresh.ok) {
      locationTag = fresh.coords;
      setLocStatus('granted');
      setLocMsg(`📍 ${fresh.msg}`);
      setLocCoords(fresh.coords);
    }
    const now = new Date();
    const record = await punchIn({
      date:     now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
      inTime:   now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }),
      location: locationTag,
      remark:   'Web Punch',
    });
    setIsWorking(true);
    setCurrentRecordId(record.id);
    autoPunchedRef.current = false;
    setAutoMsg('');
    setIsLoading(false);
  };

  const handlePunchOut = async () => {
    if (!isWorking || isLoading || !currentRecordId) return;
    setIsLoading(true);
    const now = new Date();
    const outTime = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
    let hoursString = '00:00';
    if (sessionStart && sessionStart !== '-') {
      const start = new Date(sessionStart);
      if (!isNaN(start)) {
        const diffMs   = now - start;
        const diffHrs  = Math.floor(diffMs / 3600000);
        const diffMins = Math.floor((diffMs % 3600000) / 60000);
        hoursString = `${diffHrs.toString().padStart(2, '0')}:${diffMins.toString().padStart(2, '0')}`;
      }
    }
    await punchOut(currentRecordId, outTime, hoursString);
    setIsWorking(false);
    setCurrentRecordId(null);
    setIsLoading(false);
  };

  const locConfig = {
    idle:       { icon: Navigation, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100', btn: 'bg-slate-900', label: 'Enable' },
    requesting: { icon: Loader2,    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', btn: 'bg-indigo-400', label: 'Wait' },
    granted:    { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', btn: 'bg-emerald-600', label: 'Active' },
    denied:     { icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', btn: 'bg-rose-600', label: 'Retry' },
  };
  const lc = locConfig[locStatus];

  return (
    <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-indigo-100/50 border border-slate-100 relative overflow-hidden flex flex-col gap-8 transition-all duration-500 group">
      
      {/* ── Status Glow ── */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] transition-all duration-1000 ${
        isWorking ? 'bg-emerald-400/20' : 'bg-indigo-400/20'
      }`} />

      {/* ── Circular Timer View ── */}
      <div className="relative flex flex-col items-center">
        <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-700 shadow-inner overflow-hidden ${
          isWorking ? 'border-emerald-100 bg-emerald-50/30 ring-8 ring-emerald-50' : 'border-indigo-100 bg-indigo-50/30 ring-8 ring-indigo-50'
        }`}>
          {/* Animated pulsing ring */}
          <div className={`absolute inset-0 rounded-full border-4 animate-ping opacity-20 ${
            isWorking ? 'border-emerald-400' : 'border-indigo-400'
          }`} style={{ animationDuration: '3s' }} />

          <div className="relative z-10 flex flex-col items-center">
             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Time</div>
             <div className="text-3xl font-black text-slate-900 tabular-nums tracking-tighter leading-none mb-1">
               {currentTime.split(' ')[0]}
             </div>
             <div className="text-[10px] font-black text-slate-500 uppercase">{currentTime.split(' ')[1]}</div>
          </div>
        </div>
        
        {/* Active Pill */}
        <div className={`absolute -bottom-4 px-4 py-1.5 rounded-full border shadow-sm transition-all duration-500 flex items-center gap-2 ${
           isWorking ? 'bg-emerald-600 border-emerald-500 text-white scale-110' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50'
        }`}>
           <div className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest">
             {isWorking ? 'Shift Active' : 'Offline'}
           </span>
        </div>
      </div>

      {/* ── Context Details ── */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${lc.bg} ${lc.border}`}>
           <div className="flex items-center gap-3">
             <div className={`p-2 rounded-xl bg-white shadow-sm ring-1 ${lc.border} ${lc.color}`}>
                <lc.icon size={16} className={locStatus === 'requesting' ? 'animate-spin' : ''} />
             </div>
             <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">GPS Status</div>
                <div className={`text-[11px] font-bold leading-none truncate max-w-[140px] ${lc.color}`}>{locMsg}</div>
             </div>
           </div>
           {locStatus !== 'granted' && (
             <button onClick={requestLocation} className={`px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-lg transition-all active:scale-95 ${lc.btn}`}>
               {lc.label}
             </button>
           )}
        </div>
      </div>

      {/* ── Interaction Buttons ── */}
      <div className="grid grid-cols-1 gap-4">
        {!isWorking ? (
          <button
            onClick={handlePunchIn}
            disabled={isLoading}
            className="group relative flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl bg-slate-900 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              Punch In Today
            </div>
          </button>
        ) : (
          <button
            onClick={handlePunchOut}
            disabled={isLoading}
            className="group relative flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white shadow-xl bg-rose-600 transition-all hover:bg-rose-700 hover:shadow-rose-200 active:scale-95 overflow-hidden ring-4 ring-rose-50"
          >
            <div className="relative z-10 flex items-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
              Complete Shift
            </div>
          </button>
        )}
      </div>

      {/* ── Auto Status Notification ── */}
      {(autoMsg || isWorking) && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
             <Clock size={12} />
          </div>
          <p className="text-[10px] font-bold text-slate-500 leading-tight">
            {autoMsg ? autoMsg : "Tracking session. Automatic log-out scheduled at 18:00 IST."}
          </p>
        </div>
      )}

    </div>
  );
}
