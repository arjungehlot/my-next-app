"use client";
import { useState } from 'react';
import { CalendarDays, Plus, FileText, CheckCircle, AlertCircle, X, ChevronRight } from 'lucide-react';
import { applyLeave } from '@/app/actions';

const LEAVE_TYPES = ['Casual Leave','Sick Leave','Earned Leave','Maternity Leave','Paternity Leave','Unpaid Leave','Compensatory Leave'];
const DEPARTMENTS = ['Engineering','Sales','HR','Finance','Marketing','Operations','Design'];
const MANAGERS    = ['Rahul Yadav','Madhavi Joshi','Nikita Sharma'];

function StatusBadge({ status }) {
  const map = {
    'Pending':  ['#fef9c3','#a16207'],
    'Approved': ['#dcfce7','#15803d'],
    'Rejected': ['#fee2e2','#b91c1c'],
  };
  const [bg, color] = map[status] || ['#f1f5f9','#475569'];
  return (
    <span style={{ background:bg, color, padding:'3px 12px', borderRadius:999, fontSize:'0.7rem', fontWeight:700, display:'inline-block' }}>
      {status || '—'}
    </span>
  );
}

const inputStyle = {
  width:'100%', padding:'9px 13px', border:'1.5px solid #e2e8f0',
  borderRadius:10, background:'#f8fafc', fontSize:'0.8125rem',
  color:'#1e293b', fontFamily:'inherit', outline:'none',
  transition:'all 0.2s', boxSizing:'border-box',
};

const labelStyle = { fontSize:'0.7rem', fontWeight:700, color:'#64748b', letterSpacing:'0.04em', textTransform:'uppercase', display:'block', marginBottom:5 };

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function LeaveActionsPage({ leaveHistory = [] }) {
  const [showModal, setShowModal]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [success, setSuccess]       = useState(false);
  const [startDate, setStartDate]   = useState('');
  const [endDate, setEndDate]       = useState('');
  const [declared, setDeclared]     = useState(false);
  const [error, setError]           = useState('');

  const totalDays = (() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate), e = new Date(endDate);
    return e < s ? 0 : Math.ceil((e - s) / 86400000) + 1;
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!declared) { setError('Please accept the declaration.'); return; }
    setIsLoading(true); setError('');
    const result = await applyLeave(new FormData(e.target));
    if (result.success) {
      setSuccess(true);
      setTimeout(() => { setShowModal(false); setSuccess(false); setDeclared(false); setStartDate(''); setEndDate(''); }, 1800);
    } else {
      setError(result.error || 'Failed to submit. Try again.');
      setIsLoading(false);
    }
  };

  const focusInput  = e => { e.target.style.borderColor='#6366f1'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px rgba(99,102,241,0.1)'; };
  const blurInput   = e => { e.target.style.borderColor='#e2e8f0'; e.target.style.background='#f8fafc'; e.target.style.boxShadow='none'; };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24, fontFamily:"'Inter',system-ui,sans-serif" }}>

      {/* ── Page Header ── */}
      <div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:900, color:'#0f172a', letterSpacing:'-0.03em', margin:0 }}>Leave Actions</h1>
        <p style={{ color:'#94a3b8', fontSize:'0.8125rem', marginTop:4, fontWeight:500 }}>Apply for leave and track your approvals in real time.</p>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        background:'linear-gradient(135deg,#1e1b4b 0%,#3730a3 60%,#4f46e5 100%)',
        borderRadius:20, padding:'24px 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        boxShadow:'0 8px 32px rgba(79,70,229,0.3)',
        position:'relative', overflow:'hidden',
      }}>
        <div style={{
          position:'absolute', right:-30, top:-30, width:180, height:180,
          borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none',
        }}/>
        <div style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ color:'#fff', fontSize:'1.5rem', fontWeight:900, margin:0, letterSpacing:'-0.02em' }}>Leave Management</h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8125rem', marginTop:6, fontWeight:500 }}>Apply for leaves and track approvals.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display:'flex', alignItems:'center', gap:8,
            background:'rgba(255,255,255,0.12)', backdropFilter:'blur(12px)',
            border:'1px solid rgba(255,255,255,0.2)', color:'#fff',
            fontWeight:700, fontSize:'0.8125rem', padding:'10px 20px',
            borderRadius:12, cursor:'pointer', transition:'all 0.2s',
            position:'relative', zIndex:1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.2)'; }}
          onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
        >
          <Plus size={18} /> Apply New Leave
        </button>
      </div>

      {/* ── My History Table ── */}
      <div style={{
        background:'#fff', borderRadius:20,
        border:'1px solid rgba(99,102,241,0.08)',
        boxShadow:'0 1px 3px rgba(0,0,0,0.04)',
        overflow:'hidden',
      }}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ background:'#ede9fe', borderRadius:8, padding:6 }}>
              <CalendarDays size={16} style={{ color:'#7c3aed' }} />
            </div>
            <span style={{ fontWeight:800, fontSize:'0.9375rem', color:'#0f172a' }}>My History</span>
          </div>
          <span style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:600 }}>{leaveHistory.length} records</span>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }} className="data-table">
            <thead>
              <tr>
                {['Type','Dates','Days','My Reason','Status'].map(h => (
                  <th key={h} style={{ textAlign:'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign:'center', padding:'60px 24px' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                      <div style={{ background:'#f1f5f9', borderRadius:'50%', padding:20 }}>
                        <CalendarDays size={36} style={{ color:'#cbd5e1' }} />
                      </div>
                      <div style={{ fontWeight:700, color:'#334155', fontSize:'0.875rem' }}>No leave records yet</div>
                      <div style={{ color:'#94a3b8', fontSize:'0.75rem' }}>Your leave history will appear here after applying.</div>
                    </div>
                  </td>
                </tr>
              ) : leaveHistory.map((rec, i) => (
                <tr key={i}>
                  <td style={{ fontWeight:700, color:'#1e293b' }}>{rec.type}</td>
                  <td style={{ color:'#64748b', fontFamily:'monospace', fontSize:'0.8rem' }}>{rec.dates}</td>
                  <td><span style={{ background:'#ede9fe', color:'#7c3aed', padding:'2px 10px', borderRadius:6, fontWeight:800, fontSize:'0.8rem' }}>{rec.days}</span></td>
                  <td style={{ color:'#64748b', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{rec.reason}</td>
                  <td><StatusBadge status={rec.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, zIndex:100,
          background:'rgba(15,17,23,0.7)',
          backdropFilter:'blur(8px)', WebkitBackdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} className="animate-fade-in">
          <div className="animate-scale-in" style={{
            background:'#fff', borderRadius:24,
            boxShadow:'0 32px 64px rgba(0,0,0,0.2)',
            width:'100%', maxWidth:560,
            maxHeight:'90vh', overflowY:'auto',
            border:'1px solid rgba(99,102,241,0.1)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding:'20px 24px', borderBottom:'1px solid #f1f5f9',
              display:'flex', alignItems:'center', justifyContent:'space-between',
              position:'sticky', top:0, background:'#fff', zIndex:10,
              borderRadius:'24px 24px 0 0',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ background:'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius:10, padding:8 }}>
                  <FileText size={18} color="#fff" />
                </div>
                <div>
                  <div style={{ fontWeight:800, fontSize:'1rem', color:'#0f172a' }}>Apply For Leave</div>
                  <div style={{ fontSize:'0.7rem', color:'#94a3b8', fontWeight:500, marginTop:1 }}>Fill all required fields</div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{
                width:32, height:32, borderRadius:'50%', border:'1px solid #e2e8f0',
                background:'#f8fafc', cursor:'pointer', display:'flex',
                alignItems:'center', justifyContent:'center', color:'#64748b',
                transition:'all 0.2s',
              }}>
                <X size={16} />
              </button>
            </div>

            {success ? (
              <div style={{ padding:'64px 32px', textAlign:'center' }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🎉</div>
                <CheckCircle size={48} style={{ color:'#10b981', marginBottom:12, display:'block', margin:'0 auto 12px' }} />
                <div style={{ fontWeight:800, fontSize:'1.25rem', color:'#0f172a', marginBottom:8 }}>Request Submitted!</div>
                <div style={{ color:'#64748b', fontSize:'0.875rem' }}>Your leave request is pending approval from your manager.</div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding:24, display:'flex', flexDirection:'column', gap:24 }}>

                {/* Employee Details */}
                <section>
                  <div className="section-label">Employee Details</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                    <Field label="Designation">
                      <input name="designation" type="text" placeholder="e.g. Software Engineer" required
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </Field>
                    <Field label="Department">
                      <select name="department" required style={{...inputStyle, appearance:'none',
                        backgroundImage:"url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', backgroundSize:16, paddingRight:36,
                      }} onFocus={focusInput} onBlur={blurInput}>
                        <option value="">Select Department...</option>
                        {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="Reporting Manager">
                      <select name="manager" required style={{...inputStyle, appearance:'none',
                        backgroundImage:"url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', backgroundSize:16, paddingRight:36,
                      }} onFocus={focusInput} onBlur={blurInput}>
                        <option value="">Select Manager...</option>
                        {MANAGERS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </Field>
                    <Field label="Contact During Absence">
                      <input name="emergencyContact" type="text" placeholder="Mobile Number"
                        style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                    </Field>
                    <div style={{ gridColumn:'1/-1' }}>
                      <Field label="Replacement Person (who will cover your work)">
                        <input name="replacementPerson" type="text" placeholder="Colleague's name"
                          style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      </Field>
                    </div>
                  </div>
                </section>

                {/* Leave Details */}
                <section>
                  <div className="section-label">Leave Details</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <Field label="Type of Leave">
                      <select name="leaveType" required style={{...inputStyle, appearance:'none',
                        backgroundImage:"url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', backgroundSize:16, paddingRight:36,
                      }} onFocus={focusInput} onBlur={blurInput}>
                        <option value="">Select Type...</option>
                        {LEAVE_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </Field>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 100px', gap:14, alignItems:'end' }}>
                      <Field label="Start Date">
                        <input name="startDate" type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
                          style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      </Field>
                      <Field label="End Date">
                        <input name="endDate" type="date" required value={endDate} onChange={e => setEndDate(e.target.value)}
                          style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      </Field>
                      <div>
                        <label style={labelStyle}>Total Days</label>
                        <div style={{
                          padding:'9px 13px', borderRadius:10, textAlign:'center',
                          background:'linear-gradient(135deg,#ede9fe,#ddd6fe)',
                          border:'1.5px solid #c4b5fd', fontWeight:900, fontSize:'1rem', color:'#5b21b6'
                        }}>{totalDays}</div>
                        <input type="hidden" name="totalDays" value={totalDays} />
                      </div>
                    </div>

                    <Field label="Reason for Leave">
                      <textarea name="reason" rows={3} required placeholder="Please provide a brief reason…"
                        style={{...inputStyle, resize:'none'}} onFocus={focusInput} onBlur={blurInput} />
                    </Field>

                    <Field label="Are you available for urgent work queries?">
                      <select name="availability" required style={{...inputStyle, appearance:'none',
                        backgroundImage:"url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                        backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', backgroundSize:16, paddingRight:36,
                      }} onFocus={focusInput} onBlur={blurInput}>
                        <option>Yes, I am available via Call/Email</option>
                        <option>No, I will be fully unavailable</option>
                        <option>Partially available on certain days</option>
                      </select>
                    </Field>
                  </div>
                </section>

                {/* Declaration */}
                <div style={{
                  display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px',
                  borderRadius:12, border:`1.5px solid ${declared ? '#a7f3d0' : '#e2e8f0'}`,
                  background: declared ? '#f0fdf4' : '#f8fafc',
                  transition:'all 0.2s', cursor:'pointer',
                }} onClick={() => setDeclared(v => !v)}>
                  <div style={{
                    width:18, height:18, borderRadius:5, border:`2px solid ${declared ? '#10b981' : '#cbd5e1'}`,
                    background: declared ? '#10b981' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    flexShrink:0, marginTop:1, transition:'all 0.2s',
                  }}>
                    {declared && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l3 3 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <p style={{ fontSize:'0.8rem', color:'#374151', fontWeight:500, margin:0, lineHeight:1.5 }}>
                    <input type="checkbox" name="declaration" checked={declared} onChange={e => setDeclared(e.target.checked)} style={{ display:'none' }} />
                    I hereby declare that the information provided above is <strong>true and correct</strong>.
                  </p>
                </div>

                {error && (
                  <div style={{
                    display:'flex', alignItems:'center', gap:10,
                    background:'#fef2f2', border:'1px solid #fecaca',
                    borderRadius:12, padding:'12px 16px', color:'#b91c1c',
                    fontSize:'0.8125rem', fontWeight:600,
                  }}>
                    <AlertCircle size={16} style={{ flexShrink:0 }} />
                    {error}
                  </div>
                )}

                <div style={{ display:'flex', gap:12 }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{
                    flex:1, padding:'12px', borderRadius:12, border:'1.5px solid #e2e8f0',
                    background:'#f8fafc', color:'#374151', fontWeight:700, fontSize:'0.875rem',
                    cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit',
                  }}>Cancel</button>
                  <button type="submit" disabled={isLoading} style={{
                    flex:1, padding:'12px', borderRadius:12, border:'none',
                    background:'linear-gradient(135deg,#6366f1,#4f46e5)',
                    color:'#fff', fontWeight:800, fontSize:'0.875rem', cursor:'pointer',
                    boxShadow:'0 4px 14px rgba(99,102,241,0.4)',
                    transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                    opacity: isLoading ? 0.7 : 1, fontFamily:'inherit',
                  }}>
                    {isLoading
                      ? <><div style={{ width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.8s linear infinite' }}/> Submitting…</>
                      : 'Submit Request'
                    }
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
