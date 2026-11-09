import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MetricCardsGrid from './components/MetricCardsGrid';
import RealtimeChart from './components/RealtimeChart';
import AuditLogTable from './components/AuditLogTable';
import SensorChartsView from './components/SensorChartsView';
import HistoryAuditView from './components/HistoryAuditView';
import ManualControlsView from './components/ManualControlsView';
import ThresholdSettingsView from './components/ThresholdSettingsView';
import { Sliders } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Nilai ambang batas sistem (Default sesuai standar tugas akhir)
  const [thresholds, setThresholds] = useState({
    gas: 800, // ppm
    dust: 150, // ug/m3
  });

  // State hardware status
  const [deviceStatus, setDeviceStatus] = useState({
    nodeId: 'ESP32_LPG_01',
    ip: '192.168.1.105',
    latency: 18,
    status: 'ONLINE',
  });

  // Manual override status untuk aktuator
  const [manualOverrides, setManualOverrides] = useState({
    overrideActive: false,
    fan: false,
    buzzer: false,
  });

  // Riwayat data telemetri
  const [historyData, setHistoryData] = useState([]);
  const [currentTelemetry, setCurrentTelemetry] = useState(null);

  // Inisialisasi simulator/data awal
  useEffect(() => {
    const initialRecords = [];
    const now = new Date();

    // Buat 10 data awal yang realistis
    for (let i = 10; i >= 1; i--) {
      const time = new Date(now.getTime() - i * 3000);
      const timeStr = time.toTimeString().split(' ')[0];
      const gas = 360 + Math.random() * 40;
      const dust = 22 + Math.random() * 8;
      
      initialRecords.push({
        id: Date.now() - i * 3000,
        timeLabel: timeStr,
        mq5_raw: Math.round(gas * 2.1),
        mq5_ppm: parseFloat(gas.toFixed(1)),
        gp2y_voltage: 0.85,
        gp2y_dust_density: parseFloat(dust.toFixed(1)),
        fan_status: 'OFF',
        buzzer_status: 'OFF',
        security_level: 1,
        security_status: 'STATUS: AMAN (NORMAL)',
        created_at: time.toISOString(),
      });
    }

    setHistoryData(initialRecords);
    setCurrentTelemetry(initialRecords[initialRecords.length - 1]);

    // Interval simulasi streaming telemetri setiap 3 detik
    const interval = setInterval(() => {
      setHistoryData((prev) => {
        const last = prev[prev.length - 1] || {};
        const currentTime = new Date();
        const timeStr = currentTime.toTimeString().split(' ')[0];

        // Simulasi fluktuasi wajar
        let nextGas = (last.mq5_ppm || 380) + (Math.random() * 30 - 15);
        if (nextGas < 320) nextGas = 320;
        let nextDust = (last.gp2y_dust_density || 25) + (Math.random() * 6 - 3);
        if (nextDust < 15) nextDust = 15;

        // Evaluasi logika keselamatan 4 Level berdasarkan ambang batas dinamis
        let level = 1;
        let statusText = 'STATUS: AMAN (NORMAL)';
        let autoFan = 'OFF';
        let autoBuzzer = 'OFF';

        const isGasHigh = nextGas >= thresholds.gas;
        const isDustHigh = nextDust >= thresholds.dust;

        if (!isGasHigh && !isDustHigh) {
          level = 1;
          statusText = 'STATUS: AMAN (NORMAL)';
          autoFan = 'OFF';
          autoBuzzer = 'OFF';
        } else if (!isGasHigh && isDustHigh) {
          level = 2;
          statusText = 'STATUS: WASPADA ASAP';
          autoFan = 'ON';
          autoBuzzer = 'OFF';
        } else if (isGasHigh && !isDustHigh) {
          level = 3;
          statusText = 'STATUS: BAHAYA GAS';
          autoFan = 'ON';
          autoBuzzer = 'ON';
        } else {
          level = 4;
          statusText = 'STATUS: DARURAT';
          autoFan = 'ON';
          autoBuzzer = 'ON';
        }

        // Terapkan override manual jika sedang aktif
        const finalFan = manualOverrides.overrideActive ? (manualOverrides.fan ? 'ON' : 'OFF') : autoFan;
        const finalBuzzer = manualOverrides.overrideActive ? (manualOverrides.buzzer ? 'ON' : 'OFF') : autoBuzzer;

        const newRecord = {
          id: Date.now(),
          timeLabel: timeStr,
          mq5_raw: Math.round(nextGas * 2.1),
          mq5_ppm: parseFloat(nextGas.toFixed(1)),
          gp2y_voltage: 0.9,
          gp2y_dust_density: parseFloat(nextDust.toFixed(1)),
          fan_status: finalFan,
          buzzer_status: finalBuzzer,
          security_level: level,
          security_status: statusText,
          created_at: currentTime.toISOString(),
        };

        setCurrentTelemetry(newRecord);

        // Pertahankan maksimal 50 log terakhir di memori
        return [...prev.slice(-49), newRecord];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [thresholds, manualOverrides]);

  // Handler ekspor CSV
  const handleExportCSV = () => {
    const headers = ['ID,Waktu,MQ5_PPM,GP2Y_Dust,Fan,Buzzer,Security_Level,Status\n'];
    const rows = historyData.map((d) => 
      `${d.id},${d.timeLabel},${d.mq5_ppm},${d.gp2y_dust_density},${d.fan_status},${d.buzzer_status},${d.security_level},"${d.security_status}"`
    );
    const blob = new Blob([headers.concat(rows.join('\n'))], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lpg_telemetry_export_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Trigger uji manual skenario darurat untuk demonstrasi
  const triggerScenario = (scenarioLevel) => {
    let mockGas = 380;
    let mockDust = 25;

    if (scenarioLevel === 2) {
      mockDust = thresholds.dust + 35; // Melebihi ambang asap
    } else if (scenarioLevel === 3) {
      mockGas = thresholds.gas + 120; // Melebihi ambang gas
    } else if (scenarioLevel === 4) {
      mockGas = thresholds.gas + 350; // Keduanya tembus batas
      mockDust = thresholds.dust + 60;
    }

    setHistoryData((prev) => {
      const currentTime = new Date();
      const timeStr = currentTime.toTimeString().split(' ')[0];
      const fan = scenarioLevel >= 2 ? 'ON' : 'OFF';
      const buzzer = scenarioLevel >= 3 ? 'ON' : 'OFF';

      const statusMap = {
        1: 'STATUS: AMAN (NORMAL)',
        2: 'STATUS: WASPADA ASAP',
        3: 'STATUS: BAHAYA GAS',
        4: 'STATUS: DARURAT',
      };

      const customRecord = {
        id: Date.now(),
        timeLabel: timeStr,
        mq5_raw: Math.round(mockGas * 2.1),
        mq5_ppm: mockGas,
        gp2y_voltage: 1.2,
        gp2y_dust_density: mockDust,
        fan_status: fan,
        buzzer_status: buzzer,
        security_level: scenarioLevel,
        security_status: statusMap[scenarioLevel],
        created_at: currentTime.toISOString(),
      };

      setCurrentTelemetry(customRecord);
      return [...prev.slice(-49), customRecord];
    });
  };

  const handleSaveThresholds = (newThresholds) => {
    setThresholds(newThresholds);
  };

  const handleResetThresholds = () => {
    setThresholds({
      gas: 800,
      dust: 150,
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Navigasi */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        deviceStatus={deviceStatus} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Quick Simulation Bar (Tersedia di semua view untuk demo langsung) */}
          <div className="p-3 bg-white border border-slate-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 text-black font-semibold">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Simulasi Cepat Status Sensor (Uji Respon Sistem):</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerScenario(1)}
                className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-medium transition"
              >
                Normal (L1)
              </button>
              <button
                onClick={() => triggerScenario(2)}
                className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 font-medium transition"
              >
                Asap Tinggi (L2)
              </button>
              <button
                onClick={() => triggerScenario(3)}
                className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium transition"
              >
                Bocor Gas (L3)
              </button>
              <button
                onClick={() => triggerScenario(4)}
                className="px-2.5 py-1 rounded bg-red-100 text-red-900 hover:bg-red-200 border border-red-300 font-bold transition"
              >
                Darurat Total (L4)
              </button>
            </div>
          </div>

          {/* Render Dinamis Halaman Sesuai Tab Aktif */}
          {activeTab === 'dashboard' && (
            <>
              {/* 5 Parameter Cards */}
              <MetricCardsGrid 
                telemetry={currentTelemetry} 
                thresholds={thresholds} 
              />

              {/* Bento Grid 60/40 Visualisasi Utama */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 h-[420px]">
                  <RealtimeChart 
                    historyData={historyData} 
                    onExportCSV={handleExportCSV} 
                  />
                </div>
                <div className="lg:col-span-5 h-[420px]">
                  <AuditLogTable 
                    historyData={historyData} 
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'charts' && (
            <SensorChartsView
              historyData={historyData}
              onExportCSV={handleExportCSV}
              thresholds={thresholds}
            />
          )}

          {activeTab === 'history' && (
            <HistoryAuditView
              historyData={historyData}
              onExportCSV={handleExportCSV}
            />
          )}

          {activeTab === 'controls' && (
            <ManualControlsView
              manualOverrides={manualOverrides}
              setManualOverrides={setManualOverrides}
              currentTelemetry={currentTelemetry}
              onTriggerScenario={triggerScenario}
            />
          )}

          {activeTab === 'thresholds' && (
            <ThresholdSettingsView
              thresholds={thresholds}
              onSaveThresholds={handleSaveThresholds}
              onResetThresholds={handleResetThresholds}
            />
          )}
        </main>
      </div>
    </div>
  );
}
