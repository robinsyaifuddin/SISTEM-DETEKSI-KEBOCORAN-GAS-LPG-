import React from 'react';
import { 
  Flame, 
  CloudFog, 
  Fan, 
  Volume2, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';

export default function MetricCardsGrid({ telemetry, thresholds }) {
  // Ambil data terkini
  const { 
    mq5_ppm = 0, 
    gp2y_dust_density = 0, 
    fan_status = 'OFF', 
    buzzer_status = 'OFF', 
    security_level = 1,
    security_status = 'STATUS: AMAN (NORMAL)'
  } = telemetry || {};

  const isGasExceeded = mq5_ppm >= thresholds.gas;
  const isDustExceeded = gp2y_dust_density >= thresholds.dust;

  // Level config helper
  const getLevelBadge = (level) => {
    switch (level) {
      case 1:
        return {
          bg: 'bg-emerald-50/50',
          border: 'border-emerald-200/80',
          text: 'text-emerald-700',
          dot: 'bg-emerald-500',
          title: 'LEVEL 1: AMAN',
          desc: 'Semua Parameter Normal'
        };
      case 2:
        return {
          bg: 'bg-amber-50/50',
          border: 'border-amber-200/80',
          text: 'text-amber-800',
          dot: 'bg-amber-500',
          title: 'LEVEL 2: WASPADA',
          desc: 'Kepekatan Asap Dapur Tinggi'
        };
      case 3:
        return {
          bg: 'bg-rose-50/50',
          border: 'border-rose-200/80',
          text: 'text-rose-700',
          dot: 'bg-rose-500',
          title: 'LEVEL 3: BAHAYA GAS',
          desc: 'Bocoran Gas LPG Terdeteksi'
        };
      case 4:
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-300',
          text: 'text-red-900',
          dot: 'bg-red-600',
          title: 'LEVEL 4: DARURAT',
          desc: 'Gas & Asap Melebihi Batas Kritis'
        };
    }
  };

  const levelInfo = getLevelBadge(security_level);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Konsentrasi Gas LPG (MQ-5) */}
      <div className={`p-3.5 rounded-xl bg-white border transition-all ${isGasExceeded ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-300'} shadow-sm flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase truncate text-black">Gas LPG</span>
            <Flame className={`w-4 h-4 shrink-0 ${isGasExceeded ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-black">{mq5_ppm.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-800">PPM</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-black font-medium gap-1">
          <span className="truncate text-black font-semibold">MQ-5</span>
          <span className="font-mono text-black font-bold shrink-0">Maks: {thresholds.gas} ppm</span>
        </div>
      </div>

      {/* 2. Kepekatan Partikel Debu/Asap (GP2Y1010AU0F) */}
      <div className={`p-3.5 rounded-xl bg-white border transition-all ${isDustExceeded ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-300'} shadow-sm flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase truncate text-black">Kepekatan Asap</span>
            <CloudFog className={`w-4 h-4 shrink-0 ${isDustExceeded ? 'text-amber-600' : 'text-slate-700'}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black font-mono tracking-tight text-black">{gp2y_dust_density.toFixed(1)}</span>
            <span className="text-xs font-bold text-slate-800">µg/m³</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-black font-medium gap-1">
          <span className="truncate text-black font-semibold">GP2Y1010</span>
          <span className="font-mono text-black font-bold shrink-0">Maks: {thresholds.dust} µg/m³</span>
        </div>
      </div>

      {/* 3. Kipas Exhaust (Relay 5V) */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase truncate text-black">Kipas Exhaust</span>
            <Fan className={`w-4 h-4 shrink-0 ${fan_status === 'ON' ? 'text-blue-600 animate-spin' : 'text-slate-700'}`} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-2xl font-black font-mono tracking-tight ${fan_status === 'ON' ? 'text-blue-600' : 'text-black'}`}>
              {fan_status}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${fan_status === 'ON' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-200 text-black border border-slate-300'}`}>
              {fan_status === 'ON' ? 'Aktif' : 'Standby'}
            </span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-black font-medium flex justify-between gap-1">
          <span className="truncate text-black font-semibold">Relay 5V</span>
          <span className="shrink-0 font-mono font-bold text-black">Pin D5</span>
        </div>
      </div>

      {/* 4. Alarm Buzzer 5V */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-300 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase truncate text-black">Alarm Buzzer</span>
            <Volume2 className={`w-4 h-4 shrink-0 ${buzzer_status === 'ON' ? 'text-rose-600 animate-pulse' : 'text-slate-700'}`} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-2xl font-black font-mono tracking-tight ${buzzer_status === 'ON' ? 'text-rose-600' : 'text-black'}`}>
              {buzzer_status}
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${buzzer_status === 'ON' ? 'bg-rose-100 text-rose-900 border border-rose-300 animate-pulse' : 'bg-slate-200 text-black border border-slate-300'}`}>
              {buzzer_status === 'ON' ? 'Bunyi' : 'Hening'}
            </span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200 text-[11px] text-black font-medium flex justify-between gap-1">
          <span className="truncate text-black font-semibold">Buzzer 5V</span>
          <span className="shrink-0 font-mono font-bold text-black">Pin D4</span>
        </div>
      </div>

      {/* 5. Tingkat Keamanan (Security Level 1 - 4) */}
      <div className={`p-3.5 rounded-xl border shadow-sm transition-all ${levelInfo.bg} ${levelInfo.border} flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between text-black mb-1.5">
            <span className="text-[11px] font-bold tracking-wide uppercase truncate text-black">Keamanan</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot} ${security_level > 1 ? 'animate-ping' : ''}`}></span>
              <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot}`}></span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black tracking-tight truncate ${levelInfo.text}`}>{levelInfo.title}</span>
            <span className="text-[10px] font-bold text-black mt-0.5 truncate">{levelInfo.desc}</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[10px] font-bold text-black flex justify-between items-center">
          <span className="truncate">{security_status}</span>
        </div>
      </div>
    </div>
  );
}
