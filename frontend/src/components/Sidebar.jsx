import React from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  History, 
  Sliders, 
  Settings, 
  Cpu, 
  Radio, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, deviceStatus }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Real-time', icon: LayoutDashboard },
    { id: 'charts', label: 'Grafik & Tren Sensor', icon: LineChart },
    { id: 'history', label: 'Log Histori & Audit', icon: History },
    { id: 'controls', label: 'Kontrol Aktuator Manual', icon: Sliders },
    { id: 'thresholds', label: 'Ambang Batas (Threshold)', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center gap-3">
          <Flame className="w-7 h-7 text-blue-600 shrink-0" />
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-base leading-tight">LPG-GUARD</div>
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">ITERA IoT System</div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Utama
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget Device Status (Bawah) */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/60 m-3 rounded-xl border border-slate-200/60">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            Hardware Node
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between py-0.5 text-slate-600">
            <span className="text-slate-400">Node ID:</span>
            <span className="font-mono font-medium text-slate-700">{deviceStatus.nodeId}</span>
          </div>
          <div className="flex justify-between py-0.5 text-slate-600">
            <span className="text-slate-400">IP Node:</span>
            <span className="font-mono font-medium text-slate-700">{deviceStatus.ip}</span>
          </div>
          <div className="flex justify-between py-0.5 text-slate-600">
            <span className="text-slate-400">Latensi:</span>
            <span className="font-mono font-medium text-emerald-600 flex items-center gap-1">
              <Radio className="w-3 h-3" />
              {deviceStatus.latency} ms
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
