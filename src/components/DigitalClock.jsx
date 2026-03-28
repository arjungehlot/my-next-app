"use client";
import { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h3 style={{ margin: '0 0 1rem 0', opacity: 0.7, fontSize: '0.95rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Current Time</h3>
      <div style={{ fontSize: '4.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em', color: 'var(--primary)', lineHeight: 1 }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </div>
      <div style={{ fontSize: '1.2rem', marginTop: '1rem', fontWeight: 500, opacity: 0.8 }}>
        {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
