"use client";
import { List, Search, RefreshCw, Archive, FileText } from 'lucide-react';

export default function AttendanceHistory({ records }) {
  return (
    <div className="flex flex-col h-full w-full bg-white">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-200 gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
              <List size={22} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Records</h3>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors tooltip flex shrink-0 active:scale-95">
             <RefreshCw size={18} />
          </button>
        </div>
      </div>
      
      {/* Table Area */}
      <div className="flex-1 overflow-auto rounded-b-2xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm border-b border-slate-200">
            <tr>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hours</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Location & Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="bg-slate-50 p-4 rounded-full">
                       <Archive size={40} className="text-slate-300" />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 mt-2">No Records Yet</span>
                    <span className="text-xs">Punch in today to see your attendance history here.</span>
                  </div>
                </td>
              </tr>
            ) : records.map((record, idx) => {

              return (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors animate-slide-up bg-white group" style={{ animationDelay: `${idx * 0.03}s` }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="text-sm font-semibold text-slate-900">{record.date}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-900">{record.name}</span>
                        <span className="text-xs text-slate-500">{record.empId}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{record.inTime}</span>
                        <span className="text-slate-300">-</span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded border ${
                            record.outTime !== '-' 
                              ? 'text-slate-700 bg-slate-50 border-slate-200' 
                              : 'text-slate-400 bg-transparent border-transparent'
                        }`}>
                           {record.outTime}
                        </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`text-sm font-bold ${record.hours === '-' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {record.hours}
                     </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      record.status === 'On Time'      ? 'bg-emerald-100 text-emerald-700' :
                      record.status === 'Late Mark'    ? 'bg-orange-100 text-orange-700' :
                      record.status === 'Short Leave'  ? 'bg-yellow-100 text-yellow-700' :
                      record.status === 'Half Day'     ? 'bg-amber-100 text-amber-700' :
                      record.status === 'LWP'          ? 'bg-rose-100 text-rose-700' :
                      record.status === 'Present'      ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-0.5 max-w-[200px]">
                        <span className="text-xs text-slate-600 truncate" title={record.location}>{record.location}</span>
                        <span className="text-[11px] text-slate-400 truncate" title={record.remark || 'No remark'}>{record.remark || 'No remark'}</span>
                     </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
