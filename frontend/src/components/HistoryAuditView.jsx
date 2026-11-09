import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export default function HistoryAuditView({ historyData, onExportCSV, onClearLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Filter riwayat
  const filteredData = historyData.filter((item) => {
    const matchesSearch = 
      item.timeLabel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.security_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(item.mq5_ppm).includes(searchTerm) ||
      String(item.gp2y_dust_density).includes(searchTerm);

    const matchesLevel = 
      levelFilter === 'all' || 
      String(item.security_level) === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const getStatusBadge = (level, status) => {
    switch (level) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            L1 - Normal
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            L2 - Waspada Asap
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            L3 - Bahaya Gas
          </span>
        );
      case 4:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 text-red-900 border border-red-300 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
            L4 - Darurat
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-600">
            Unknown
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Log Histori & Audit Trail Sistem
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Daftar lengkap rekaman telemetri berkala dan jejak respon aktuator dari node IoT
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Unduh CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-xl shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan waktu, nilai ppm, asap, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter Status:</span>
          </div>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          >
            <option value="all">Semua Level (L1 - L4)</option>
            <option value="1">Level 1 - Normal</option>
            <option value="2">Level 2 - Waspada Asap</option>
            <option value="3">Level 3 - Bahaya Gas</option>
            <option value="4">Level 4 - Darurat</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50/80 sticky top-0 border-b border-slate-200 z-10 backdrop-blur-sm">
              <tr className="text-slate-500 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">MQ-5 Gas (PPM)</th>
                <th className="py-3 px-4">GP2Y Asap (µg/m³)</th>
                <th className="py-3 px-4">Tegangan (V)</th>
                <th className="py-3 px-4">Kipas Exhaust</th>
                <th className="py-3 px-4">Alarm Buzzer</th>
                <th className="py-3 px-4">Tingkat Keamanan</th>
                <th className="py-3 px-4">Keterangan Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredData.length > 0 ? (
                [...filteredData].reverse().map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-2.5 px-4 font-sans text-slate-700 font-medium whitespace-nowrap">
                      {item.timeLabel}
                    </td>
                    <td className="py-2.5 px-4 text-rose-600 font-semibold">
                      {item.mq5_ppm} <span className="text-[10px] text-slate-400 font-normal">PPM</span>
                    </td>
                    <td className="py-2.5 px-4 text-blue-600 font-semibold">
                      {item.gp2y_dust_density} <span className="text-[10px] text-slate-400 font-normal">µg/m³</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {item.gp2y_voltage || 0.85} V
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.fan_status === 'ON' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.fan_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold ${
                        item.buzzer_status === 'ON' ? 'bg-red-50 text-red-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.buzzer_status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-sans">
                      {getStatusBadge(item.security_level, item.security_status)}
                    </td>
                    <td className="py-2.5 px-4 font-sans text-slate-600 text-xs">
                      {item.security_status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-sans text-xs">
                    Tidak ada log telemetri yang cocok dengan kriteria filter saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Menampilkan <strong>{filteredData.length}</strong> dari total <strong>{historyData.length}</strong> entri rekaman</span>
          <span className="text-slate-400">Penyimpanan in-memory circular buffer (50 event terakhir)</span>
        </div>
      </div>
    </div>
  );
}
