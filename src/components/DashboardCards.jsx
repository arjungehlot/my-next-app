"use client";
import { Clock, Umbrella, FileText, Calendar, ArrowUpRight, Zap, History, LayoutDashboard } from "lucide-react";
import Link from 'next/link';

function MetricCard({ gradient, icon: Icon, title, value, sub, border, shadow }) {
  return (
    <div className={`relative overflow-hidden rounded-[32px] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${shadow} group cursor-pointer border border-white/10`} 
         style={{ background: gradient }}>
      
      {/* Decorative internal glass border */}
      <div className="absolute inset-[1px] rounded-[31px] border border-white/10 pointer-events-none" />
      
      {/* Large background icon for texture */}
      <Icon size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12 group-hover:rotate-0 transition-transform duration-700" strokeWidth={1} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 shadow-sm group-hover:scale-110 transition-transform duration-500">
            <Icon size={20} className="text-white" />
          </div>
          <div className="p-1.5 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-white" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-3xl font-black text-white tracking-tight">{value}</div>
          <div className="text-xs font-black text-white/90 uppercase tracking-widest">{title}</div>
          <div className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">{sub}</div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, color, bg }) {
  return (
    <Link href={href} className="group relative flex flex-col items-center justify-center gap-5 p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 hover:border-indigo-100 transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
           style={{ background: `linear-gradient(135deg, ${bg}, ${color})`, boxShadow: `0 8px 25px ${color}40` }}>
        <Icon size={28} className="text-white drop-shadow-sm" />
      </div>
      
      <div className="text-center">
        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Action</span>
        <h3 className="text-sm font-black text-slate-800 tracking-tight">{label}</h3>
      </div>
    </Link>
  );
}

export default function DashboardCards() {
  return (
    <div className="space-y-12">
      {/* ── Status Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          gradient="linear-gradient(135deg, #f59e0b, #d97706)" 
          icon={Clock} value="Absent" title="Attendance" sub="Today's Current Status" 
          shadow="shadow-orange-100" />
        <MetricCard 
          gradient="linear-gradient(135deg, #6366f1, #4338ca)" 
          icon={Umbrella} value="0" title="Leave Balance" sub="Casual/Sick Remaining" 
          shadow="shadow-indigo-100" />
        <MetricCard 
          gradient="linear-gradient(135deg, #f43f5e, #e11d48)" 
          icon={FileText} value="0" title="Pending Expenses" sub="Claims Processing" 
          shadow="shadow-rose-100" />
        <MetricCard 
          gradient="linear-gradient(135deg, #06b6d4, #0891b2)" 
          icon={Calendar} value="Dec 25" title="Next Holiday" sub="Christmas Celebration" 
          shadow="shadow-cyan-100" />
      </div>

      {/* ── Quick Workspaces ── */}
      <div>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Zap size={18} fill="currentColor" />
          </div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Quick Workspaces</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction href="/attendance" icon={Clock}    label="Clock In/Out" color="#6366f1" bg="#818cf8" />
          <QuickAction href="/leave"      icon={Calendar} label="Apply Leave"  color="#10b981" bg="#34d399" />
          <QuickAction href="/calendar"   icon={LayoutDashboard} label="My Calendar"  color="#f59e0b" bg="#fbbf24" />
        </div>
      </div>
    </div>
  );
}
