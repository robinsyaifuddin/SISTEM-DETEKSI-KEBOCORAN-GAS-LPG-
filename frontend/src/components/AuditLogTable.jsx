import React from 'react';
import { Database, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function AuditLogTable({ historyData }) {
  // Ambil maksimal 8 data terakhir
  const recentLogs = [...historyData].slice(-8).reverse();

  const getStatusBadge = (level, status) => {
    switch (level) {
      case 1:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 2:
        return 'bg-amber-50 text-amber-800 border-amber-200/80';
      case 3:
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case 4:
      default:
        return 'bg-red-100 text-red-900 border-red-300 font-bold';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              Log Histori & Audit Trail
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Endpoint: <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-600">/api/v1/telemetry</code></p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
            Live Stream
          </span>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-2.5 font-medium">WAKTU</th>
                <th className="pb-2.5 font-medium">MQ-5 (PPM)</th>
                <th className="pb-2.5 font-medium">GP2Y (µg/m³)</th>
                <th className="pb-2.5 font-medium">AKTUATOR</th>
                <th className="pb-2.5 font-medium text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {recentLogs.map((log, index) => (
                <tr key={log.id || index} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 font-mono text-[11px] text-slate-500">
                    {log.timeLabel || log.created_at?.slice(11, 19) || '12:00:00'}
                  </td>
                  <td className="py-2.5 font-mono font-medium text-slate-800">
                    {log.mq5_ppm?.toFixed(1)}
                  </td>
                  <td className="py-2.5 font-mono font-medium text-slate-800">
                    {log.gp2y_dust_density?.toFixed(1)}
                  </td>
                  <td className="py-2.5 text-[11px]">
                    <span className="font-mono text-slate-500">
                      F:{log.fan_status} / B:{log.buzzer_status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(log.security_level, log.security_status)}`}>
                      L{log.security_level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Menampilkan {recentLogs.length} data rekaman</span>
        <button className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1">
          Lihat Semua
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
