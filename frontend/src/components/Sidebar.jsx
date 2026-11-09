import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  LineChart, 
  History, 
  Sliders, 
  Settings, 
  Cpu, 
  Radio, 
  Flame, 
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, deviceStatus }) {
  const [collapsed, setCollapsed] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Real-time', icon: LayoutDashboard },
    { id: 'charts', label: 'Grafik & Tren Sensor', icon: LineChart },
    { id: 'history', label: 'Log Histori & Audit', icon: History },
    { id: 'controls', label: 'Kontrol Aktuator Manual', icon: Sliders },
    { id: 'thresholds', label: 'Ambang Batas (Threshold)', icon: Settings },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 h-screen sticky top-0 select-none overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[width] ${
        collapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      <div className="flex flex-col min-w-0">
        {/* Brand Header & Toggle */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                <Flame className="w-7 h-7 text-blue-600 shrink-0" />
                <div className="min-w-0 flex flex-col">
                  <span className="font-bold text-slate-900 tracking-tight text-base leading-tight truncate">LPG-GUARD</span>
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">ITERA IoT System</span>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                title="Tutup Sidebar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <button
                onClick={() => setCollapsed(false)}
                title="Buka Sidebar"
                className="p-2 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation Items (Tanpa Teks Menu Utama) */}
        <div className="p-3 space-y-1.5 flex flex-col">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`group relative flex items-center h-10 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  collapsed ? 'justify-center px-0 w-full' : 'px-3 w-full gap-3'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'}`} />
                <span 
                  className={`whitespace-nowrap transition-all duration-200 overflow-hidden ${
                    collapsed ? 'w-0 opacity-0 pointer-events-none' : 'w-auto opacity-100'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Widget Device Status (Bawah) */}
      <div className="shrink-0">
        {!collapsed ? (
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 m-3 rounded-xl border border-slate-200/60 transition-opacity duration-200">
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
        ) : (
          <div className="p-3 mb-2 flex justify-center" title={`ESP32 Online (${deviceStatus.latency}ms)`}>
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center relative border border-slate-200/60">
              <Cpu className="w-4 h-4 text-slate-500" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse"></span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
