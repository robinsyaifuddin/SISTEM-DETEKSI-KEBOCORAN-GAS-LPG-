import React from 'react';
import { Activity, Radio, Sparkles } from 'lucide-react';

export default function TopHeader({ lastSync, isLive }) {
  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-black tracking-tight flex items-center gap-2">
          Dashboard Pemantauan Kebocoran Gas LPG & Kualitas Udara
        </h1>
        <p className="text-xs text-black font-medium mt-0.5">
          Laboratorium Teknik Telekomunikasi ITERA • Interval Polling: 3 Detik
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Tech Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium text-slate-600 bg-slate-100 border border-slate-200">
          <span>React 18 + Vite</span>
          <span className="text-slate-300">|</span>
          <span>REST API</span>
        </div>

        {/* Watchdog Status Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200/80 bg-emerald-50/70 text-emerald-800 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>SISTEM AKTIF (ONLINE)</span>
        </div>
      </div>
    </header>
  );
}
