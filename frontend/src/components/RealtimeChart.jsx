import React, { useState } from 'react';
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
import { Download, SlidersHorizontal } from 'lucide-react';

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

export default function RealtimeChart({ historyData, onExportCSV }) {
  const [activeRange, setActiveRange] = useState('1m');

  // Siapkan data 15-20 data point terkini
  const slicedData = [...historyData].slice(-15);
  const labels = slicedData.map(d => d.timeLabel || d.created_at?.slice(11, 19) || '');
  const gasValues = slicedData.map(d => d.mq5_ppm);
  const dustValues = slicedData.map(d => d.gp2y_dust_density);

  const data = {
    labels,
    datasets: [
      {
        label: 'Gas MQ-5 (PPM)',
        data: gasValues,
        borderColor: '#ef4444', // Red 500
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'yGas',
      },
      {
        label: 'Asap GP2Y (µg/m³)',
        data: dustValues,
        borderColor: '#2563eb', // Blue 600
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        borderWidth: 2,
        borderDash: [4, 4],
        tension: 0.35,
        fill: false,
        pointRadius: 2,
        pointHoverRadius: 5,
        yAxisID: 'yDust',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 400,
    },
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
          boxHeight: 12,
          usePointStyle: true,
          font: {
            family: 'Plus Jakarta Sans',
            size: 11,
            weight: 500,
          },
          color: '#475569',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Plus Jakarta Sans', size: 12 },
        bodyFont: { family: 'JetBrains Mono', size: 11 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: 'JetBrains Mono', size: 10 },
          color: '#94a3b8',
        },
      },
      yGas: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Konsentrasi Gas (PPM)',
          color: '#ef4444',
          font: { size: 10, weight: 600 },
        },
        grid: {
          color: '#f1f5f9',
        },
        ticks: {
          font: { family: 'JetBrains Mono', size: 10 },
          color: '#ef4444',
        },
      },
      yDust: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Kepekatan Asap (µg/m³)',
          color: '#2563eb',
          font: { size: 10, weight: 600 },
        },
        grid: {
          display: false, // cegah garis grid tumpang tindih
        },
        ticks: {
          font: { family: 'JetBrains Mono', size: 10 },
          color: '#2563eb',
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-800 tracking-tight">Grafik Fluktuasi Sensor Real-time</h2>
          <p className="text-xs text-slate-400 mt-0.5">Dua kurva parameter: MQ-5 (Gas) & GP2Y1010AU0F (Asap)</p>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            {['1m', '5m', '15m', '1h'].map((r) => (
              <button
                key={r}
                onClick={() => setActiveRange(r)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeRange === r ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={onExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-72 w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
