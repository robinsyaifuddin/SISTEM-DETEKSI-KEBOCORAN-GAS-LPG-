import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Sliders, 
  Flame, 
  CloudFog, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle,
  Info
} from 'lucide-react';

export default function ThresholdSettingsView({ thresholds, onSaveThresholds, onResetThresholds }) {
  const [gasThreshold, setGasThreshold] = useState(thresholds.gas);
  const [dustThreshold, setDustThreshold] = useState(thresholds.dust);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveThresholds({
      gas: Number(gasThreshold),
      dust: Number(dustThreshold),
    });
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 3500);
  };

  const handleReset = () => {
    setGasThreshold(800);
    setDustThreshold(150);
    onResetThresholds();
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Notifikasi Simpan Berhasil */}
      {savedNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">
              Parameter Ambang Batas Berhasil Diperbarui & Disinkronkan ke Logika Evaluasi!
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-mono">Sync Code: 200 OK</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Konfigurasi Ambang Batas (Threshold) Sistem
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Pengaturan batas toleransi konsentrasi gas LPG dan kepekatan asap untuk klasifikasi tingkat bahaya (Level 1–4)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Reset ke Default TA
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Threshold Gas MQ-5 */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Flame className="w-6 h-6 text-rose-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Ambang Batas Gas LPG (MQ-5)</h3>
                  <p className="text-[11px] text-slate-400">Satuan Part Per Million (PPM)</p>
                </div>
              </div>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded text-xs border border-rose-200">
                {gasThreshold} PPM
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nilai Titik Picu Peringatan (Alarm Level 3):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="200"
                    max="2000"
                    step="50"
                    value={gasThreshold}
                    onChange={(e) => setGasThreshold(e.target.value)}
                    className="flex-1 accent-rose-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    value={gasThreshold}
                    onChange={(e) => setGasThreshold(e.target.value)}
                    className="w-24 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-700">Rekomendasi Standar Skripsi:</div>
                <p>• Nilai default: <strong>800 PPM</strong> (Batas awal bahaya kebocoran tabung LPG).</p>
                <p>• Jika sensor membaca &ge; nilai ini, buzzer seketika membunyikan peringatan darurat.</p>
              </div>
            </div>
          </div>

          {/* Card Threshold Asap GP2Y */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <CloudFog className="w-6 h-6 text-blue-600 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Ambang Batas Kepekatan Asap (GP2Y)</h3>
                  <p className="text-[11px] text-slate-400">Satuan Mikrogram per Meter Kubik (µg/m³)</p>
                </div>
              </div>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded text-xs border border-blue-200">
                {dustThreshold} µg/m³
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nilai Titik Picu Kipas Exhaust (Level 2):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="10"
                    value={dustThreshold}
                    onChange={(e) => setDustThreshold(e.target.value)}
                    className="flex-1 accent-blue-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    value={dustThreshold}
                    onChange={(e) => setDustThreshold(e.target.value)}
                    className="w-24 px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 text-slate-800 font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-700">Rekomendasi Standar Skripsi:</div>
                <p>• Nilai default: <strong>150 µg/m³</strong> (Indikasi kepulan asap kebakaran / masakan hangus).</p>
                <p>• Jika sensor membaca &ge; nilai ini, exhaust fan otomatis aktif menyedot udara keluar.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Matrix Matriks Keputusan 4 Level */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-slate-800 text-sm">Matriks Kebijakan Keputusan Keselamatan 4 Level (Decision Logic Matrix)</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Kondisi MQ-5 Gas</th>
                  <th className="py-2.5 px-3">Kondisi GP2Y Asap</th>
                  <th className="py-2.5 px-3">Respon Kipas Exhaust</th>
                  <th className="py-2.5 px-3">Respon Alarm Buzzer</th>
                  <th className="py-2.5 px-3">Status Sistem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-emerald-700">Level 1</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">&lt; {gasThreshold} PPM</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">&lt; {dustThreshold} µg/m³</td>
                  <td className="py-2.5 px-3 text-slate-500">OFF (Standby)</td>
                  <td className="py-2.5 px-3 text-slate-500">OFF (Hening)</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">NORMAL</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-amber-700">Level 2</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">&lt; {gasThreshold} PPM</td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 font-bold">&ge; {dustThreshold} µg/m³</td>
                  <td className="py-2.5 px-3 text-indigo-700 font-bold">ON (Ventilasi)</td>
                  <td className="py-2.5 px-3 text-slate-500">OFF (Hening)</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px]">WASPADA ASAP</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-rose-700">Level 3</td>
                  <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">&ge; {gasThreshold} PPM</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">&lt; {dustThreshold} µg/m³</td>
                  <td className="py-2.5 px-3 text-indigo-700 font-bold">ON (Buang Gas)</td>
                  <td className="py-2.5 px-3 text-rose-700 font-bold animate-pulse">ON (BUNYI ALARM)</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">BAHAYA GAS</span></td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-red-900">Level 4</td>
                  <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">&ge; {gasThreshold} PPM</td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 font-bold">&ge; {dustThreshold} µg/m³</td>
                  <td className="py-2.5 px-3 text-indigo-700 font-bold">ON (Maksimal)</td>
                  <td className="py-2.5 px-3 text-red-700 font-bold animate-pulse">ON (DARURAT KONTINU)</td>
                  <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-red-100 text-red-900 font-bold text-[10px]">DARURAT TOTAL</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Simpan & Terapkan Perubahan Ambang Batas
          </button>
        </div>
      </form>
    </div>
  );
}
