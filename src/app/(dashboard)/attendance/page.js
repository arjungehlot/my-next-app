import PunchSystem from '@/components/PunchSystem';
import AttendanceHistory from '@/components/AttendanceHistory';
import { getAttendanceRecords } from '@/app/actions';
import { ShieldCheck, MapPin, Sparkles, ChevronRight } from 'lucide-react';

export default async function AttendancePage() {
  const records = await getAttendanceRecords();
  
  // Find active session
  const lastRecord = records.length > 0 ? records[0] : null;
  const isCurrentlyWorking = lastRecord && lastRecord.outTime === '-';
  const activeRecordId = isCurrentlyWorking ? lastRecord.id : null;
  const activeSessionStart = isCurrentlyWorking ? lastRecord.rawIn : null;

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ── Page Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Portal</span>
            <ChevronRight size={10} />
            <span className="text-indigo-600">Attendance</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Attendance <span className="text-indigo-600">Workspace</span></h1>
            <p className="text-slate-500 font-medium text-base max-w-xl">
              Track your daily work hours, manage live punches, and view your detailed attendance timeline with <span className="text-slate-900 font-bold">real-time precision</span>.
            </p>
          </div>
        </div>

        {/* Security / Status Pill */}
        <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-indigo-600 shadow-sm border border-indigo-50">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Level</div>
            <div className="text-xs font-black text-indigo-700 uppercase tracking-tighter">Encrypted Taggings Active</div>
          </div>
        </div>
      </div>
      
      {/* ── Main Content Grid ── */}
      <div className="flex flex-col xl:flex-row gap-8 items-start">
         
         {/* Left Side: Punch System (33%) */}
         <div className="w-full xl:w-[380px] shrink-0">
           <PunchSystem 
             isInitialWorking={isCurrentlyWorking} 
             activeRecordId={activeRecordId} 
             sessionStart={activeSessionStart} 
           />
         </div>
         
         {/* Right Side: History (Remaining) */}
         <div className="flex-1 w-full bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[660px]">
           <AttendanceHistory records={records} />
         </div>

      </div>

    </div>
  );
}
