import { Zap, Megaphone, Bell, Calendar as CalendarIcon, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getSessionUser } from '@/app/actions';
import DashboardCards from '@/components/DashboardCards';

export default async function Dashboard() {
  const sessionUser = await getSessionUser();
  const userName = sessionUser?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* ── Welcome Hero ── */}
      <div className="relative overflow-hidden rounded-[40px] px-10 py-12 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 shadow-2xl shadow-indigo-200 group">
        
        {/* Decorative Glassmorphic Shapes */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all duration-700" />
        <div className="absolute -bottom-24 right-32 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700 delay-150" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="p-1 px-2.5 rounded-full bg-indigo-500/20 border border-indigo-400/20 backdrop-blur-md">
                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles size={10} className="text-indigo-400" /> {greeting}
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">
              Welcome back, <span className="text-indigo-300 drop-shadow-sm">{userName}!</span>
            </h1>
            <p className="text-indigo-100/60 text-base md:text-lg font-medium max-w-xl">
              Here is your financial overview and pending actions for today. You have <span className="text-white font-bold">3 actions</span> remaining.
            </p>
          </div>

          {/* Date Widget */}
          <div className="flex flex-col items-center gap-2 p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl min-w-[140px] hover:bg-white/10 transition-all cursor-default group/date">
            <div className="text-[10px] font-black text-indigo-300 uppercase tracking-widest group-hover/date:text-white transition-colors">Today</div>
            <div className="text-2xl font-black text-white">
              {new Date().toLocaleDateString('en-IN',{ day:'numeric' })}
            </div>
            <div className="text-sm font-bold text-indigo-100/60 uppercase tracking-widest flex items-center gap-1">
               {new Date().toLocaleDateString('en-IN',{ month:'short', weekday:'short' })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Status Metrics & Quick Actions (Handled Unified by Component) ── */}
      <DashboardCards />

      {/* ── Bottom Section: Timeline & Highlights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* News / Announcements */}
        <div className="lg:col-span-12 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-50">
          
          {/* Header Area */}
          <div className="p-8 md:min-w-[300px] bg-slate-50/30 flex flex-col justify-between overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 shadow-sm border border-orange-200">
                  <Megaphone size={18} />
                </div>
                <div>
                   <h2 className="text-lg font-black text-slate-900 leading-tight">Timeline</h2>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aura HRMS Updates</div>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8">
                Stay updated with the latest company events, holidays, and system news directly in your feed.
              </p>
            </div>
            <button className="relative z-10 flex items-center justify-center gap-2 py-3 px-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all shadow-sm group/btn">
              Explore All <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Timeline List */}
          <div className="flex-1 p-8">
            <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
              {[
                { date:'2025-12-25', status:'Holiday', title:'Christmas Celebration', body:'Season\'s greetings! The office will remain closed for the holiday.', type:'holiday' },
                { date:'2026-01-01', status:'Event', title:'New Year Kickoff',     body:'Join us at the lounge area for the 2026 roadmap presentation.', type:'event' },
                { date:'2026-03-31', status:'System', title:'Profile Upload Update', body:'You can now upload professional documents directly from your profile tab.', type:'news' },
              ].map((a, i) => (
                <div key={i} className="relative pl-10 group/item">
                  <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 transition-all group-hover/item:scale-125 ${
                    a.type === 'holiday' ? 'bg-orange-500 shadow-orange-100' : 
                    a.type === 'event' ? 'bg-indigo-500 shadow-indigo-100' : 'bg-emerald-500 shadow-emerald-100'
                  }`} />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{a.date}</span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      a.type === 'holiday' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      a.type === 'event' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>{a.status}</span>
                  </div>
                  <h3 className="text-sm font-black text-slate-800 mb-1 group-hover/item:text-indigo-600 transition-colors">{a.title}</h3>
                  <p className="text-xs font-medium text-slate-500 leading-normal">{a.body}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
