"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { loginUser } from '@/app/actions';

export default function Login() {
  const [error, setError]       = useState('');
  const [isLoading, setLoading] = useState(false);
  const router                  = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    const result = await loginUser(new FormData(e.target));
    if (result.success) { router.push('/'); router.refresh(); }
    else { setError(result.error); setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(135deg,#0f1117 0%,#1e1b4b 40%,#0f172a 100%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'2rem', position:'relative', overflow:'hidden',
      fontFamily:"'Inter',system-ui,sans-serif",
    }}>
      {/* Ambient glows */}
      <div style={{
        position:'absolute', top:'10%', left:'15%', width:500, height:500,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)',
        pointerEvents:'none', filter:'blur(40px)',
      }}/>
      <div style={{
        position:'absolute', bottom:'5%', right:'10%', width:400, height:400,
        borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,0.14) 0%,transparent 70%)',
        pointerEvents:'none', filter:'blur(40px)',
      }}/>
      {/* Grid texture */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)',
        backgroundSize:'40px 40px',
      }}/>

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:440 }} className="animate-scale-in">
        {/* Card */}
        <div style={{
          background:'rgba(255,255,255,0.04)',
          backdropFilter:'blur(40px)',
          WebkitBackdropFilter:'blur(40px)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:24,
          padding:'44px 40px',
          boxShadow:'0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              width:60, height:60, borderRadius:18,
              background:'linear-gradient(135deg,#6366f1,#8b5cf6)',
              boxShadow:'0 8px 32px rgba(99,102,241,0.5)',
              marginBottom:20,
            }}>
              <Sparkles size={28} color="#fff" />
            </div>
            <h1 style={{
              color:'#fff', fontSize:'1.75rem', fontWeight:900,
              letterSpacing:'-0.03em', margin:0, lineHeight:1.2,
            }}>Aura HRMS</h1>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.8125rem', marginTop:8, fontWeight:500 }}>
              Sign in to access your workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              display:'flex', alignItems:'center', gap:10,
              background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.25)',
              borderRadius:12, padding:'12px 16px', marginBottom:20,
              color:'#fca5a5', fontSize:'0.8125rem', fontWeight:600,
            }}>
              <AlertCircle size={16} style={{ flexShrink:0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Name */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.05em' }}>
                USERNAME
              </label>
              <div style={{ position:'relative' }}>
                <User size={16} style={{
                  position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                  color:'rgba(255,255,255,0.25)', pointerEvents:'none',
                }}/>
                <input type="text" name="name" required autoComplete="username"
                  placeholder="e.g. krishna Pawar"
                  style={{
                    width:'100%', padding:'12px 14px 12px 40px',
                    background:'rgba(255,255,255,0.06)',
                    border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:12, color:'#fff', fontSize:'0.875rem',
                    fontFamily:'inherit', outline:'none', transition:'all 0.2s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.6)'; e.target.style.background='rgba(99,102,241,0.08)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={e =>  { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; e.target.style.boxShadow='none'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.05em' }}>
                PASSWORD
              </label>
              <div style={{ position:'relative' }}>
                <Lock size={16} style={{
                  position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
                  color:'rgba(255,255,255,0.25)', pointerEvents:'none',
                }}/>
                <input type="password" name="password" required autoComplete="current-password"
                  placeholder="••••••••"
                  style={{
                    width:'100%', padding:'12px 14px 12px 40px',
                    background:'rgba(255,255,255,0.06)',
                    border:'1px solid rgba(255,255,255,0.1)',
                    borderRadius:12, color:'#fff', fontSize:'0.875rem',
                    fontFamily:'inherit', outline:'none', transition:'all 0.2s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => { e.target.style.borderColor='rgba(99,102,241,0.6)'; e.target.style.background='rgba(99,102,241,0.08)'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.15)'; }}
                  onBlur={e =>  { e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.background='rgba(255,255,255,0.06)'; e.target.style.boxShadow='none'; }}
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} style={{
              marginTop:8, width:'100%', padding:'13px',
              background: isLoading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#4f46e5)',
              color:'#fff', fontSize:'0.875rem', fontWeight:800,
              borderRadius:12, border:'none', cursor: isLoading ? 'not-allowed' : 'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:'0 4px 20px rgba(99,102,241,0.4)',
              transition:'all 0.2s', letterSpacing:'0.01em',
            }}>
              {isLoading
                ? <><div style={{ width:18,height:18,border:'2.5px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> Authenticating…</>
                : <><ArrowRight size={18} /> Sign In</>
              }
            </button>
          </form>

          <p style={{ textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:'0.7rem', marginTop:24, fontWeight:500 }}>
            Access restricted to authorized personnel only
          </p>
        </div>

        {/* Tagline */}
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:'0.7rem', marginTop:20, fontWeight:500 }}>
          Powered by D-Table Analytics · Aura HRMS v2.0
        </p>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
