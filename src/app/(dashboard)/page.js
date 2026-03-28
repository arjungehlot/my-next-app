import { Zap, Megaphone } from "lucide-react";
import { getSessionUser } from '@/app/actions';
import DashboardCards from '@/components/DashboardCards';

export default async function Dashboard() {
  const sessionUser = await getSessionUser();
  const userName = sessionUser?.name?.split(' ')[0] || 'there';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:28, maxWidth:1280, fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* ── Welcome Hero ── */}
      <div style={{
        background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)',
        borderRadius:20, padding:'26px 32px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        position:'relative', overflow:'hidden',
        boxShadow:'0 8px 32px rgba(67,56,202,0.3)',
      }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-60, right:80, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.03)', pointerEvents:'none' }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.8125rem', fontWeight:600, marginBottom:6, letterSpacing:'0.02em' }}>
            {greeting} 👋
          </p>
          <h1 style={{ color:'#fff', fontSize:'1.875rem', fontWeight:900, letterSpacing:'-0.03em', margin:0, lineHeight:1.2 }}>
            Welcome back, <span style={{ color:'#a5b4fc' }}>{userName}</span>!
          </h1>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.875rem', marginTop:6, fontWeight:500 }}>
            Here is your financial overview and pending actions for today.
          </p>
        </div>
        <div style={{
          background:'rgba(255,255,255,0.1)', borderRadius:16, padding:'12px 20px',
          backdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.15)',
          textAlign:'center', position:'relative', zIndex:1,
        }}>
          <div style={{ color:'#a5b4fc', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Today</div>
          <div style={{ color:'#fff', fontSize:'0.9rem', fontWeight:800 }}>
            {new Date().toLocaleDateString('en-IN',{ weekday:'short', day:'numeric', month:'short' })}
          </div>
        </div>
      </div>

      {/* ── Metric Cards + Quick Actions (client component) ── */}
      <DashboardCards />

      {/* ── Bottom Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>

        {/* Quick Actions card */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(99,102,241,0.08)', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ background:'#fef3c7', borderRadius:8, padding:6 }}>
              <Zap size={16} style={{ color:'#d97706', fill:'#d97706' }} />
            </div>
            <span style={{ fontWeight:800, fontSize:'0.9375rem', color:'#1e293b' }}>Quick Actions</span>
          </div>
          <div style={{ padding:20 }}>
            {/* rendered by DashboardCards above */}
          </div>
        </div>

        {/* Announcements */}
        <div style={{ background:'#fff', borderRadius:20, border:'1px solid rgba(99,102,241,0.08)', boxShadow:'0 1px 3px rgba(0,0,0,0.04)', overflow:'hidden' }}>
          <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ background:'#fee2e2', borderRadius:8, padding:6 }}>
              <Megaphone size={16} style={{ color:'#ef4444', fill:'#ef4444' }} />
            </div>
            <span style={{ fontWeight:800, fontSize:'0.9375rem', color:'#1e293b' }}>Announcements</span>
          </div>
          <div style={{ padding:20, display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { date:'2025-12-25', title:'Holiday on Christmas', body:'Merry Christmas! Office will be closed.' },
              { date:'2026-01-01', title:'New Year Holiday',     body:'Wishing everyone a Happy New Year!' },
            ].map((a, i) => (
              <div key={i} style={{
                borderLeft:'3px solid #6366f1', paddingLeft:14, paddingTop:4, paddingBottom:4,
                background:'linear-gradient(90deg,rgba(99,102,241,0.04) 0%,transparent)',
                borderRadius:'0 8px 8px 0',
              }}>
                <div style={{ fontSize:'0.65rem', color:'#94a3b8', fontWeight:700, marginBottom:3 }}>{a.date}</div>
                <div style={{ fontSize:'0.8125rem', fontWeight:800, color:'#1e293b', marginBottom:2 }}>{a.title}</div>
                <div style={{ fontSize:'0.75rem', color:'#64748b' }}>{a.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
