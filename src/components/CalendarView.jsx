"use client";
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  CheckCircle2, Clock, AlertTriangle, User,
  CalendarDays, Filter, Download, ArrowRight, ShieldCheck, Sparkles, Activity
} from 'lucide-react';

export default function CalendarView({ user, attendance = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  // ── Date Logic ──────────────────────────────────────────────────────────────
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currYear  = currentDate.getFullYear();
  const currMonth = currentDate.getMonth();

  // ── Data Mapping ────────────────────────────────────────────────────────────
  const attendanceMap = useMemo(() => {
    const map = {};
    const currMonthName = monthNames[currMonth].substring(0, 3).toLowerCase(); 
    
    attendance.forEach(rec => {
       if (!rec.date) return;
       let dayNum = null;
       let monthMatch = false;
       let yearMatch  = true;

       if (rec.date.includes(' ')) {
          const parts = rec.date.toLowerCase().split(' '); 
          dayNum = parseInt(parts[1]);
          monthMatch = parts[2] === currMonthName;
       } 
       else if (rec.date.includes('-')) {
          const parts = rec.date.split('-'); 
          dayNum = parseInt(parts[0]);
          monthMatch = parseInt(parts[1]) === (currMonth + 1);
          yearMatch  = parseInt(parts[2]) === currYear;
       }

       if (!isNaN(dayNum) && monthMatch && yearMatch) {
          map[dayNum] = rec;
       }
    });
    return map;
  }, [attendance, currMonth, currYear]);

  // ── Stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
     let present = 0, late = 0, half = 0;
     Object.values(attendanceMap).forEach(r => {
        if (r.status === 'On Time') present++;
        if (r.status === 'Late Mark') late++;
        if (r.status === 'Half Day' || r.status === 'Short Leave') half++;
     });
     return { present, late, half };
  }, [attendanceMap]);

  // ── Rendering Grid ──────────────────────────────────────────────────────────
  const days = [];
  const totalDays      = daysInMonth(currMonth, currYear);
  const startOffset    = firstDayOfMonth(currMonth, currYear);
  const today          = new Date();
  const isCurrentMonth = today.getMonth() === currMonth && today.getFullYear() === currYear;

  for (let i = 0; i < startOffset; i++) {
    days.push(<div key={`empty-${i}`} className="h-32 border border-slate-50 bg-slate-50/20" />);
  }

  for (let d = 1; d <= totalDays; d++) {
    const record = attendanceMap[d];
    const isToday = isCurrentMonth && today.getDate() === d;
    
    let statusClass = "bg-white";
    let glowColor   = "";
    let statusIcon  = null;

    if (record) {
      if (record.status === 'On Time') {
        statusClass = "bg-emerald-50/20 border-emerald-100 hover:bg-emerald-50/40";
        glowColor   = "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]";
      } else if (record.status === 'Late Mark') {
        statusClass = "bg-amber-50/20 border-amber-100 hover:bg-amber-50/40";
        glowColor   = "bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]";
      } else if (record.status === 'Half Day' || record.status === 'Short Leave') {
        statusClass = "bg-orange-50/20 border-orange-100 hover:bg-orange-50/40";
        glowColor   = "bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.3)]";
      }
    }

    days.push(
      <div 
        key={d} 
        onClick={() => record && setSelectedDay(record)}
        className={`h-32 border border-slate-100 p-4 transition-all cursor-pointer relative group overflow-hidden ${isToday ? 'bg-indigo-50/30' : ''} ${statusClass}`}
      >
        {isToday && <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />}
        
        <div className="flex justify-between items-start relative z-10">
          <span className={`text-[13px] font-black tracking-tight ${isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-xl shadow-lg' : 'text-slate-400'}`}>
            {d}
          </span>
          {record && <div className={`w-2.5 h-2.5 rounded-full ${glowColor}`} />}
        </div>

        {record ? (
          <div className="mt-4 space-y-2 relative z-10 transition-transform group-hover:-translate-y-1">
             <div className="flex items-center gap-2">
                <Clock size={10} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-800 tabular-nums uppercase">{record.inTime}</span>
             </div>
             {record.outTime !== '-' && (
                <div className="flex items-center gap-2 opacity-50">
                   <div className="w-2.5 h-[1.5px] bg-slate-300 ml-1" />
                   <span className="text-[10px] font-bold text-slate-500 tabular-nums uppercase">{record.outTime}</span>
                </div>
             )}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest border border-slate-100 px-2 py-1 rounded-lg">No Log</span>
          </div>
        )}
        
        {/* Decorative corner indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-30 transition-opacity">
           <ArrowRight size={14} className="text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* ── Main Workspace Grid ── */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* Left: Calendar Main View (75%) */}
        <div className="flex-1 w-full bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-100/30 overflow-hidden flex flex-col">
           
           {/* Grid Header / Internal Header */}
           <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/30 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white shadow-xl shadow-indigo-100 rounded-2xl text-indigo-600 border border-slate-50 relative group">
                   <CalendarDays size={20} strokeWidth={2.5} />
                   <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">{monthNames[currMonth]}</h2>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{currYear} Production Schedule</div>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/80 p-1.5 border border-slate-100 rounded-[20px] shadow-inner">
                <button onClick={prevMonth} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600"><ChevronLeft size={18} /></button>
                <div className="h-4 w-px bg-slate-100 mx-2" />
                <button onClick={nextMonth} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-indigo-600"><ChevronRight size={18} /></button>
              </div>
           </div>

           <div className="grid grid-cols-7 border-b border-slate-50 bg-white">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
              <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 tracking-[0.2em] border-r border-slate-50 last:border-0 uppercase opacity-60">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-white">
            {days}
          </div>
        </div>

        {/* Right: Insights & Selected Details (25%) */}
        <div className="w-full xl:w-[360px] shrink-0 flex flex-col gap-6">
           
           {/* Month Insights Glass Card */}
           <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-[0_32px_64px_-16px_rgba(30,41,59,0.3)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-[60px] group-hover:bg-indigo-500/40 transition-all duration-700" />
              <div className="relative z-10 space-y-6">
                 <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Performance Audit</div>
                   <h3 className="text-2xl font-black tracking-tight">{user?.name || 'My Summary'}</h3>
                 </div>

                 <div className="space-y-4">
                    {[
                      { label: 'Consistency', value: stats.present + stats.late, total: 30, color: 'indigo' },
                      { label: 'On Time Rate', value: stats.present, total: stats.present + stats.late, color: 'emerald' },
                    ].map((metric, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                            <span>{metric.label}</span>
                            <span>{Math.round((metric.value / (metric.total || 1)) * 100)}%</span>
                         </div>
                         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full bg-${metric.color}-400 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(metric.value / (metric.total || 1)) * 100}%` }} />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">On-Time</div>
                       <div className="text-xl font-black text-emerald-400">{stats.present}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Delayed</div>
                       <div className="text-xl font-black text-amber-400">{stats.late}</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Selected Day Context - Glassmorphic */}
           <div className={`min-h-[260px] rounded-[40px] border transition-all duration-500 relative overflow-hidden flex flex-col items-center justify-center p-8 ${
             selectedDay ? 'bg-white border-slate-100 shadow-xl' : 'bg-slate-50/50 border-slate-100 border-dashed'
           }`}>
              {selectedDay ? (
                <div className="w-full space-y-6 animate-in slide-in-from-right-4 duration-500">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                         <Sparkles size={20} />
                      </div>
                      <div>
                         <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{selectedDay.date}</div>
                         <h4 className="text-lg font-black text-slate-900 leading-none">Session Intel</h4>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-2">
                            <Clock size={12} className="text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</span>
                         </div>
                         <span className="text-xs font-black text-slate-900 tabular-nums uppercase">{selectedDay.hours} hrs</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-indigo-600" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GPS Match</span>
                         </div>
                         <span className="text-[10px] font-black text-slate-900 truncate max-w-[120px] uppercase">{selectedDay.location}</span>
                      </div>
                   </div>

                   <div className="p-4 rounded-2xl border border-indigo-50 bg-indigo-50/30 flex items-start gap-4">
                      <div className="p-1.5 rounded-lg bg-indigo-600 text-white shrink-0"><ShieldCheck size={14} /></div>
                      <p className="text-[10px] font-bold text-indigo-900 leading-relaxed uppercase italic">
                         Verified session tagging compliant with corporate attendance policies.
                      </p>
                   </div>
                </div>
              ) : (
                <div className="text-center space-y-4 opacity-40">
                   <div className="w-14 h-14 rounded-[24px] bg-slate-200 flex items-center justify-center mx-auto">
                      <Activity size={24} className="text-slate-400" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select an active session</p>
                     <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">To view tagging intelligence</p>
                   </div>
                </div>
              )}
           </div>

        </div>

      </div>

    </div>
  );
}
