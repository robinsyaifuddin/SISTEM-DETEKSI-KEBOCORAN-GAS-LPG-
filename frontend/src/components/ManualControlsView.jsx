import React, { useState } from 'react';
import { 
  Sliders, 
  Fan, 
  Volume2, 
  VolumeX, 
  Power, 
  AlertCircle, 
  Info, 
  CheckCircle2, 
  ShieldAlert,
  Zap
} from 'lucide-react';

export default function ManualControlsView({ manualOverrides, setManualOverrides, currentTelemetry, onTriggerScenario }) {
  const [toastMessage, setToastMessage] = useState(null);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleFan = () => {
    if (!manualOverrides.overrideActive) {
      showNotification('Aktifkan mode "Manual Override" terlebih dahulu untuk mengontrol aktuator!');
      return;
    }
    const nextState = !manualOverrides.fan;
    setManualOverrides(prev => ({ ...prev, fan: nextState }));
    showNotification(`Perintah terkirim ke ESP32: Kipas Exhaust diatur ke ${nextState ? 'AKTIF (ON)' : 'MATI (OFF)'}`);
  };

  const handleToggleBuzzer = () => {
    if (!manualOverrides.overrideActive) {
      showNotification('Aktifkan mode "Manual Override" terlebih dahulu untuk mengontrol aktuator!');
      return;
    }
    const nextState = !manualOverrides.buzzer;
    setManualOverrides(prev => ({ ...prev, buzzer: nextState }));
    showNotification(`Perintah terkirim ke ESP32: Buzzer Alarm diatur ke ${nextState ? 'BUNYI (ON)' : 'SENYAP (OFF)'}`);
  };

  const handleToggleOverrideMode = () => {
    const nextMode = !manualOverrides.overrideActive;
    setManualOverrides(prev => ({
      ...prev,
      overrideActive: nextMode,
      // Jika dikembalikan ke auto, sinkronkan ke kondisi otomatis telemetri saat ini
      fan: nextMode ? prev.fan : (currentTelemetry?.fan_status === 'ON'),
      buzzer: nextMode ? prev.buzzer : (currentTelemetry?.buzzer_status === 'ON'),
    }));
    showNotification(nextMode 
      ? 'Mode Manual Override DIAKTIFKAN. Logika otomatis di-bypass untuk pengujian.' 
      : 'Kembali ke MODE OTOMATIS (ESP32 Autonomous Safety Logic).'
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            Kontrol Aktuator Manual & Uji Perangkat
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Bypass logika otomatis mikrokontroler untuk melakukan inspeksi relay, exhaust fan, dan buzzer piezokeramik
          </p>
        </div>
        <div>
          <button
            onClick={handleToggleOverrideMode}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-xs transition ${
              manualOverrides.overrideActive
                ? 'bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            {manualOverrides.overrideActive ? 'Mode Manual: AKTIF (Bypass)' : 'Aktifkan Manual Override'}
          </button>
        </div>
      </div>

      {/* Warning Alert Mode Manual */}
      {manualOverrides.overrideActive ? (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <div className="font-semibold text-amber-900">Perhatian: Mode Kontrol Manual Sedang Aktif</div>
            <div>Sistem saat ini tidak akan otomatis mematikan aktuator ketika sensor mendeteksi gas normal. Pastikan mengembalikan sistem ke <strong>Mode Otomatis</strong> setelah pengujian alat selesai.</div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 space-y-1">
            <div className="font-semibold text-blue-900">Sistem dalam Mode Otomatis (Autonomous IoT Controller)</div>
            <div>Status aktuator sepenuhnya dikendalikan oleh ambang batas telemetri sensor ESP32 (MQ-5 & GP2Y1010AU0F). Aktifkan tombol manual override di kanan atas jika ingin menyalakan aktuator secara paksa.</div>
          </div>
        </div>
      )}

      {/* Actuator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kipas Exhaust Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <Fan className={`w-7 h-7 shrink-0 ${
                  manualOverrides.fan ? 'text-indigo-600 animate-spin' : 'text-slate-400'
                }`} />
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Relay Kipas Exhaust 12V</h3>
                  <p className="text-[11px] text-slate-400">GPIO Pin D5 • Modul Relay 1-Channel Aktif Low</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                manualOverrides.fan ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-500'
              }`}>
                {manualOverrides.fan ? 'Status: ON' : 'Status: OFF'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Mode Kontrol:</span>
                <span className="font-medium text-slate-700">
                  {manualOverrides.overrideActive ? 'Manual Override' : 'Otomatis (Sistem)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Kondisi Trigger Otomatis:</span>
                <span className="font-medium text-slate-700">Level 2, 3, atau 4 (Asap / Gas Bocor)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Target Tindakan:</span>
                <span className="font-medium text-slate-700">Membuang akumulasi gas & asap ke luar ruangan</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Saklar Relay Kipas:</span>
            <button
              onClick={handleToggleFan}
              disabled={!manualOverrides.overrideActive}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                !manualOverrides.overrideActive
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : manualOverrides.fan
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              {manualOverrides.fan ? 'Matikan Kipas' : 'Nyalakan Kipas'}
            </button>
          </div>
        </div>

        {/* Buzzer Alarm Card */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {manualOverrides.buzzer ? (
                  <Volume2 className="w-7 h-7 text-rose-600 shrink-0 animate-pulse" />
                ) : (
                  <VolumeX className="w-7 h-7 text-slate-400 shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Alarm Buzzer Piezokeramik</h3>
                  <p className="text-[11px] text-slate-400">GPIO Pin D4 • Transduser Frekuensi 2.4 kHz</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                manualOverrides.buzzer ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-500'
              }`}>
                {manualOverrides.buzzer ? 'Status: BUNYI' : 'Status: SENYAP'}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Mode Kontrol:</span>
                <span className="font-medium text-slate-700">
                  {manualOverrides.overrideActive ? 'Manual Override' : 'Otomatis (Sistem)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Kondisi Trigger Otomatis:</span>
                <span className="font-medium text-slate-700">Level 3 atau Level 4 (Konsentrasi Gas Tinggi)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Target Tindakan:</span>
                <span className="font-medium text-slate-700">Peringatan suara evakuasi di lokasi pemasangan</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Saklar Alarm Suara:</span>
            <button
              onClick={handleToggleBuzzer}
              disabled={!manualOverrides.overrideActive}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2 ${
                !manualOverrides.overrideActive
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : manualOverrides.buzzer
                  ? 'bg-slate-700 hover:bg-slate-800 text-white shadow-sm'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
              }`}
            >
              {manualOverrides.buzzer ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {manualOverrides.buzzer ? 'Heningkan Buzzer' : 'Bunyikan Buzzer (Test)'}
            </button>
          </div>
        </div>
      </div>

      {/* Tombol Uji Respon Cepat (Skenario Demo Praktik) */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-slate-800 text-sm">Preset Pengujian Skenario Cepat (Demo Penguji / Dosen)</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Gunakan tombol di bawah untuk menginjeksi beban uji sensor dan mengamati respon simultan aktuator:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => onTriggerScenario(1)}
            className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition"
          >
            <div className="font-bold text-xs text-emerald-800">Uji Skenario 1 (Aman)</div>
            <div className="text-[11px] text-emerald-600 mt-1">Gas &lt; 800 PPM • Asap &lt; 150 µg/m³ (Semua Standby)</div>
          </button>
          <button
            onClick={() => onTriggerScenario(2)}
            className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left transition"
          >
            <div className="font-bold text-xs text-amber-800">Uji Skenario 2 (Asap Tebal)</div>
            <div className="text-[11px] text-amber-600 mt-1">Asap &gt; 150 µg/m³ (Relay Kipas Menyala Otomatis)</div>
          </button>
          <button
            onClick={() => onTriggerScenario(3)}
            className="p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-left transition"
          >
            <div className="font-bold text-xs text-rose-800">Uji Skenario 3 (Bocor Gas)</div>
            <div className="text-[11px] text-rose-600 mt-1">Gas &gt; 800 PPM (Kipas ON + Buzzer Alarm ON)</div>
          </button>
          <button
            onClick={() => onTriggerScenario(4)}
            className="p-3 rounded-lg border border-red-300 bg-red-100/60 hover:bg-red-100 text-left transition"
          >
            <div className="font-bold text-xs text-red-900">Uji Skenario 4 (Darurat Total)</div>
            <div className="text-[11px] text-red-700 mt-1">Kombinasi Ekstrem Gas & Asap (Proteksi Penuh)</div>
          </button>
        </div>
      </div>
    </div>
  );
}
