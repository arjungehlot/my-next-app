"use client";
import { List, Search, RefreshCw, Archive, MapPin, Clock, Calendar, ArrowUpRight } from 'lucide-react';

export default function AttendanceHistory({ records }) {
  return (
    <div className="flex flex-col h-full w-full bg-white relative">
      
      {/* ── Header Area ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-8 border-b border-slate-50 gap-6 shrink-0 relative bg-slate-50/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
              <Calendar size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">Activity Log</h3>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Last 30 Sessions</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          <div className="relative w-full sm:w-72 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by date or status..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all placeholder:text-slate-300"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all active:scale-95 shrink-0">
             <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* ── Table Area ── */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Timeline</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Punch Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Work Hours</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Context</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                       <Archive size={48} className="text-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Activity Yet</h4>
                      <p className="text-xs font-bold text-slate-300">Your attendance logs will appear here after your first punch.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : records.map((record, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-all group animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ transitionDelay: `${idx * 40}ms` }}>
                
                {/* Date */}
                <td className="px-8 py-6 whitespace-nowrap">
                   <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-900 leading-none mb-1.5">{record.date}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Session Day</span>
                   </div>
                </td>

                {/* Time */}
                <td className="px-8 py-6 whitespace-nowrap">
                   <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter mb-1">IN</span>
                        <span className="text-[12px] font-black text-slate-700 tabular-nums">{record.inTime}</span>
                      </div>
                      <div className="h-6 w-px bg-slate-100 mx-1" />
                      <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${record.outTime !== '-' ? 'text-rose-500' : 'text-slate-300'}`}>OUT</span>
                        <span className={`text-[12px] font-black tabular-nums ${record.outTime !== '-' ? 'text-slate-700' : 'text-slate-300'}`}>{record.outTime}</span>
                      </div>
                   </div>
                </td>

                {/* Hours */}
                <td className="px-8 py-6 whitespace-nowrap">
                   <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-xs tabular-nums ${
                     record.hours === '-' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100/50 shadow-sm shadow-indigo-50'
                   }`}>
                      <Clock size={12} className={record.hours !== '-' ? 'text-indigo-400' : 'text-slate-300'} />
                      {record.hours}
                   </div>
                </td>

                {/* Status Badge */}
                <td className="px-8 py-6 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors ${
                    record.status === 'On Time'      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    record.status === 'Late Mark'    ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    record.status === 'Short Leave'  ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    record.status === 'Half Day'     ? 'bg-orange-50 text-orange-600 border-orange-100' :
                    record.status === 'LWP'          ? 'bg-red-50 text-red-600 border-red-100' :
                    record.status === 'Present'      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    {record.status}
                  </span>
                </td>

                {/* Context */}
                <td className="px-8 py-6">
                   <div className="flex items-center justify-between gap-4 max-w-[240px]">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                           <MapPin size={10} className="text-slate-300 shrink-0" />
                           <span className="text-[11px] font-bold text-slate-500 truncate" title={record.location}>{record.location}</span>
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 italic truncate" title={record.remark || 'N/A'}>
                           {record.remark || 'No system remarks'}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                           <ArrowUpRight size={14} />
                         </div>
                      </div>
                   </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
