"use client";
import { Clock, Umbrella, FileText, Calendar, ArrowUpRight } from "lucide-react";
import Link from 'next/link';

function MetricCard({ gradient, icon: Icon, title, value, sub, border }) {
  return (
    <div style={{
      background: gradient, borderRadius: 20, padding: '1.5rem',
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      border: `1px solid ${border}`, boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    }}
    className="metric-card"
    >
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)' }}/>
      <Icon size={110} style={{ position:'absolute', right:-16, bottom:-20, opacity:0.12, color:'#fff', strokeWidth:1.2 }}/>
      <div style={{ position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:10, padding:8, backdropFilter:'blur(8px)' }}>
            <Icon size={18} color="#fff" />
          </div>
          <ArrowUpRight size={16} style={{ color:'rgba(255,255,255,0.6)' }} />
        </div>
        <div style={{ color:'#fff', fontSize:'2rem', fontWeight:900, lineHeight:1.1, marginBottom:6 }}>{value}</div>
        <div style={{ color:'rgba(255,255,255,0.85)', fontSize:'0.8125rem', fontWeight:700, marginBottom:4 }}>{title}</div>
        <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.7rem', fontWeight:500 }}>{sub}</div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label, color, bg }) {
  return (
    <Link href={href} style={{
      background:'#fff', borderRadius:16, padding:'28px 20px',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      gap:14, textDecoration:'none',
      border:'1px solid rgba(99,102,241,0.08)',
      boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
      transition:'all 0.25s', cursor:'pointer',
    }}
    className="quick-action-card"
    >
      <div style={{
        width:54, height:54, borderRadius:16,
        background:`linear-gradient(135deg,${bg},${color})`,
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:`0 6px 20px ${color}50`,
      }}>
        <Icon size={24} color="#fff" />
      </div>
      <span style={{ fontSize:'0.8125rem', fontWeight:700, color:'#334155' }}>{label}</span>
    </Link>
  );
}

export default function DashboardCards() {
  return (
    <>
      {/* Metric Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20 }}>
        <MetricCard gradient="linear-gradient(135deg,#f59e0b 0%,#d97706 100%)" border="rgba(245,158,11,0.3)" icon={Clock}    value="Absent" title="Attendance"       sub="Today's Status" />
        <MetricCard gradient="linear-gradient(135deg,#6366f1 0%,#4f46e5 100%)" border="rgba(99,102,241,0.3)"  icon={Umbrella} value="0"      title="Leave Balance"   sub="Casual/Sick Remaining" />
        <MetricCard gradient="linear-gradient(135deg,#f97316 0%,#ea580c 100%)" border="rgba(249,115,22,0.3)"  icon={FileText} value="0"      title="Pending Expenses" sub="Claims Processing" />
        <MetricCard gradient="linear-gradient(135deg,#06b6d4 0%,#0891b2 100%)" border="rgba(6,182,212,0.3)"   icon={Calendar} value="Dec 25" title="Holiday"          sub="Next Upcoming" />
      </div>

      {/* Quick Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        <QuickAction href="/attendance" icon={Clock}    label="Clock In/Out" color="#6366f1" bg="#818cf8" />
        <QuickAction href="/leave"      icon={Calendar} label="Apply Leave"  color="#10b981" bg="#34d399" />
        <QuickAction href="#"           icon={Calendar} label="My Calendar"  color="#06b6d4" bg="#22d3ee" />
      </div>
    </>
  );
}
