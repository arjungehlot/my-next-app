"use client";
import {
  LayoutDashboard, Calendar, FileText, Settings,
  LogOut, CheckSquare, Bell, User, ChevronRight,
  Building2, Wallet, Plane
} from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useState } from 'react';
import Link from 'next/link';
import { logoutUser } from '@/app/actions';

const NAV = [
  {
    group: null,
    items: [{ href: '/', icon: LayoutDashboard, label: 'Dashboard' }]
  },
  {
    group: 'WORKSPACE',
    items: [
      { href: '/attendance', icon: CheckSquare, label: 'Attendance' },
      { href: '/leave',       icon: Calendar,    label: 'Leave Actions' },
      { href: '#',            icon: Calendar,    label: 'My Calendar' },
    ]
  },
  {
    group: 'PERSONAL',
    items: [
      { href: '#', icon: User,     label: 'My Profile' },
      { href: '#', icon: Plane,    label: 'Travel Expense' },
      { href: '#', icon: Wallet,   label: 'Advance Salary' },
    ]
  },
];

export default function DashboardLayoutClient({ children, user }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [hovered, setHovered] = useState(null);

  const handleLogout = () => startTransition(async () => {
    await logoutUser();
    router.push('/login');
  });

  const initials    = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
  const displayName = user?.name || 'Unknown User';
  const displayRole = user?.role || 'Employee';
  const isActive    = (href) => href !== '#' && (pathname === href || pathname.startsWith(href + '/'));

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f8]">

      {/* ─────────────────── SIDEBAR ─────────────────── */}
      <aside className="flex flex-col w-[240px] shrink-0 h-full overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d0f1a 0%, #111827 100%)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 4px 14px rgba(99,102,241,0.5)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M4 4h4v16H4V4zm6 0h4l6 8-6 8h-4l6-8-6-8z"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-black text-[0.75rem] tracking-wide leading-none">D-TABLE</div>
            <div className="text-[0.6rem] font-semibold tracking-widest mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>AURA HRMS</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-0.5">
          {NAV.map(({ group, items }) => (
            <div key={group || 'main'} className={group ? 'mt-5' : ''}>
              {group && (
                <div className="px-3 mb-2 text-[0.6rem] font-bold tracking-[0.15em]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  {group}
                </div>
              )}
              {items.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <Link key={label} href={href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[0.8125rem] font-medium transition-all duration-200 relative group"
                    style={{
                      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                      background: active
                        ? 'rgba(99,102,241,0.2)'
                        : hovered === label ? 'rgba(255,255,255,0.05)' : 'transparent',
                      borderLeft: `2px solid ${active ? '#6366f1' : 'transparent'}`,
                      marginLeft: 0,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={() => setHovered(label)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {active && (
                      <div className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.15) 0%, transparent 100%)' }} />
                    )}
                    <Icon size={16} className="shrink-0" style={{ color: active ? '#a5b4fc' : 'inherit' }} />
                    <span className="flex-1">{label}</span>
                    {active && <ChevronRight size={13} style={{ color: '#a5b4fc', opacity: 0.7 }} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-black text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: '0 0 0 2px rgba(99,102,241,0.4)',
              }}>{initials}</div>
            <div className="overflow-hidden flex-1">
              <div className="text-[0.75rem] font-bold text-white truncate">{displayName}</div>
              <div className="text-[0.65rem] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>{displayRole}</div>
            </div>
          </div>
          <button onClick={handleLogout} disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[0.75rem] font-semibold transition-all duration-200"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
              cursor: isPending ? 'not-allowed' : 'pointer',
              opacity: isPending ? 0.5 : 1,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
          >
            <LogOut size={13} />
            {isPending ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ─────────────────── MAIN ─────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6"
          style={{
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(99,102,241,0.08)',
            boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
          }}>

          {/* Left: Tab nav */}
          <div className="flex items-center h-full gap-1">
            {[
              { href: '/', label: 'HRMS', icon: CheckSquare },
              { href: '/operations', label: 'Operations', icon: Settings },
            ].map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-1.5 h-full px-4 text-[0.8125rem] font-bold transition-all duration-200"
                  style={{
                    color: active ? '#6366f1' : '#9ca3af',
                    borderBottom: `2px solid ${active ? '#6366f1' : 'transparent'}`,
                    textDecoration: 'none',
                  }}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}>
              <Bell size={16} className="text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" style={{ border: '1.5px solid white' }} />
            </button>

            <div className="w-px h-6 bg-slate-200" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[0.7rem] font-black text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 0 2.5px rgba(99,102,241,0.25)',
                }}>{initials}</div>
              <div className="hidden sm:block">
                <div className="text-[0.8125rem] font-bold text-slate-700 leading-none">{displayName}</div>
                <div className="text-[0.65rem] text-slate-400 font-medium mt-0.5">{displayRole}</div>
              </div>
            </div>

            <button onClick={handleLogout} disabled={isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.75rem] font-bold text-white transition-all duration-200"
              style={{
                background: isPending ? '#f87171' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                border: 'none', cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}>
              <LogOut size={13} />
              {isPending ? '…' : 'Logout'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
