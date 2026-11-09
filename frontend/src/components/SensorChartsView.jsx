import React, { useState } from 'react';
import { 
  LineChart as LineChartIcon, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  Activity, 
  Flame, 
  CloudFog,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SensorChartsView({ historyData, onExportCSV, thresholds }) {
  const [timeRange, setTimeRange] = useState('all');
  const [activeMetric, setActiveMetric] = useState('both'); // 'both', 'mq5', 'gp2y'

  // Hitung statistik ringkasan dari historyData
  const gasValues = historyData.map(d => d.mq5_ppm || 0);
  const dustValues = historyData.map(d => d.gp2y_dust_density || 0);

  const avgGas = gasValues.length ? (gasValues.reduce((a, b) => a + b, 0) / gasValues.length).toFixed(1) : 0;
  const maxGas = gasValues.length ? Math.max(...gasValues).toFixed(1) : 0;
  const minGas = gasValues.length ? Math.min(...gasValues).toFixed(1) : 0;

  const avgDust = dustValues.length ? (dustValues.reduce((a, b) => a + b, 0) / dustValues.length).toFixed(1) : 0;
  const maxDust = dustValues.length ? Math.max(...dustValues).toFixed(1) : 0;
  const minDust = dustValues.length ? Math.min(...dustValues).toFixed(1) : 0;

  const labels = historyData.map((d) => d.timeLabel);

  const datasets = [];

  if (activeMetric === 'both' || activeMetric === 'mq5') {
    datasets.push({
      label: 'Gas MQ-5 (PPM)',
      data: gasValues,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.08)',
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 2.5,
      pointHoverRadius: 5,
      yAxisID: 'y',
      fill: true,
    });
  }

  if (activeMetric === 'both' || activeMetric === 'gp2y') {
    datasets.push({
      label: 'Asap GP2Y (µg/m³)',
      data: dustValues,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.08)',
      borderWidth: 2,
      borderDash: [4, 4],
      tension: 0.35,
      pointRadius: 2.5,
      pointHoverRadius: 5,
      yAxisID: 'y1',
      fill: true,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          font: { size: 12, family: 'system-ui' },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: '600' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(241, 245, 249, 1)' },
        ticks: { font: { size: 10 }, color: '#94a3b8', maxTicksLimit: 12 },
      },
      y: {
        type: 'linear',
        display: activeMetric === 'both' || activeMetric === 'mq5',
        position: 'left',
        title: {
          display: true,
          text: 'MQ-5 Gas (PPM)',
          color: '#ef4444',
          font: { size: 11, weight: '500' },
        },
        grid: { color: 'rgba(241, 245, 249, 1)' },
        ticks: { font: { size: 10 }, color: '#94a3b8' },
      },
      y1: {
        type: 'linear',
        display: activeMetric === 'both' || activeMetric === 'gp2y',
        position: 'right',
        title: {
          display: true,
          text: 'GP2Y Dust (µg/m³)',
          color: '#2563eb',
          font: { size: 11, weight: '500' },
        },
        grid: { drawOnChartArea: false },
        ticks: { font: { size: 10 }, color: '#94a3b8' },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-blue-600" />
            Analisis Grafik & Tren Sensor
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Visualisasi fluktuasi historis sensor MQ-5 dan GP2Y1010AU0F secara komparatif
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Ekspor CSV Telemetri
          </button>
        </div>
      </div>

      {/* Quick Summary Cards (Statistik Analitik) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" /> Rata-rata MQ-5
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 font-medium">PPM</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{avgGas}</div>
          <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>Min: {minGas}</span>
            <span>Maks: {maxGas}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CloudFog className="w-4 h-4 text-blue-500" /> Rata-rata GP2Y
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">µg/m³</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{avgDust}</div>
          <div className="mt-1 text-xs text-slate-400 flex items-center justify-between">
            <span>Min: {minDust}</span>
            <span>Maks: {maxDust}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-500" /> Total Sample
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">Live</span>
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900">{historyData.length}</div>
          <div className="mt-1 text-xs text-slate-400">
            Interval sampling: 3 detik (ESP32)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" /> Ambang Referensi
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-medium">Batas</span>
          </div>
          <div className="mt-2 text-xs space-y-1 font-mono">
            <div className="flex justify-between text-slate-700">
              <span>Ambang Gas:</span>
              <span className="font-semibold text-rose-600">{thresholds.gas} PPM</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span>Ambang Asap:</span>
              <span className="font-semibold text-blue-600">{thresholds.dust} µg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="p-5 bg-white border border-slate-200/80 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-800">Kurva Telemetri Dual-Sensor Real-time</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg p-0.5 bg-slate-100 text-xs font-medium text-slate-600">
              <button
                onClick={() => setActiveMetric('both')}
                className={`px-3 py-1 rounded-md transition ${
                  activeMetric === 'both' ? 'bg-white shadow-xs text-slate-900 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                Gabungan
              </button>
              <button
                onClick={() => setActiveMetric('mq5')}
                className={`px-3 py-1 rounded-md transition ${
                  activeMetric === 'mq5' ? 'bg-white shadow-xs text-rose-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                MQ-5 Gas
              </button>
              <button
                onClick={() => setActiveMetric('gp2y')}
                className={`px-3 py-1 rounded-md transition ${
                  activeMetric === 'gp2y' ? 'bg-white shadow-xs text-blue-600 font-semibold' : 'hover:text-slate-900'
                }`}
              >
                GP2Y Asap
              </button>
            </div>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
