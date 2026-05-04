import LeaveActions from '@/components/LeaveActions';
import { getLeaveHistory, getSessionUser } from '@/app/actions';
import { Plane, ChevronRight, Calculator } from 'lucide-react';

export default async function LeavePage() {
  const [leaveData, sessionUser] = await Promise.all([
    getLeaveHistory(),
    getSessionUser()
  ]);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* ── Page Header & Breadcrumbs ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <span>Portal</span>
            <ChevronRight size={10} />
            <span className="text-indigo-600">Leave Management</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">Leave <span className="text-indigo-600">Actions</span></h1>
            <p className="text-slate-500 font-medium text-base max-w-xl">
              Apply for leaves, track your balance, and manage team requests with <span className="text-slate-900 font-bold">automated approval workflows</span>.
            </p>
          </div>
        </div>

        {/* Global Leave Stats Pill */}
        <div className="flex items-center gap-3 p-3 px-5 rounded-2xl bg-indigo-50 border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-white text-indigo-600 shadow-sm border border-indigo-50">
            <Calculator size={18} />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Cycle</div>
            <div className="text-xs font-black text-indigo-700 uppercase tracking-tighter">Jan 2026 — Dec 2026</div>
          </div>
        </div>
      </div>

      {/* ── Leave Actions Component ── */}
      <LeaveActions 
        myHistory={leaveData.myHistory}
        teamPending={leaveData.teamPending}
        teamHistory={leaveData.teamHistory}
        sessionUser={sessionUser}
      />

    </div>
  );
}
