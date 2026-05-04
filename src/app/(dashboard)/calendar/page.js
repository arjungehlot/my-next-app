import { getAttendanceRecords, getSessionUser } from '@/app/actions';
import CalendarView from '@/components/CalendarView';
import { Calendar, ChevronRight, Activity } from 'lucide-react';

export default async function CalendarPage() {
  const user = await getSessionUser();
  const attendance = await getAttendanceRecords();
  
  // Filter for current user only
  const myAttendance = attendance.filter(r => r.empId === user?.empId || r.email === user?.email);
  
  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ── Page Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Portal</span>
            <ChevronRight size={10} />
            <span className="text-indigo-600">My Calendar</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Attendance <span className="text-indigo-600">Timeline</span></h1>
            <p className="text-slate-500 font-medium text-base max-w-xl">
              Visualize your monthly performance, track shifts, and monitor <span className="text-slate-900 font-bold">attendance consistency</span> across the organization.
            </p>
          </div>
        </div>

        {/* Global Calendar Stats Pill */}
        <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-indigo-600 shadow-sm border border-indigo-50">
            <Activity size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Integration</div>
            <div className="text-xs font-black text-indigo-700 uppercase tracking-tighter">Real-time Sync Active</div>
          </div>
        </div>
      </div>

      {/* ── Calendar View Component ── */}
      <CalendarView 
        user={user} 
        attendance={myAttendance}
      />

    </div>
  );
}
