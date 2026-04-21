import {
  CategoryScale, Chart as ChartJS, Legend, LinearScale,
  LineElement, PointElement, Title, Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { MeasurementItem } from '../types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Props = { measurements: MeasurementItem[] };

export function SensorChart({ measurements }: Props) {
  if (measurements.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        Aucune mesure disponible
      </div>
    );
  }

  const temps = measurements
    .filter((m) => m.sensor === 'temperature')
    .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));

  const humidities = measurements
    .filter((m) => m.sensor === 'humidity')
    .sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));

  const labels = temps.map((m) =>
    new Date(m.measuredAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Température (°C)',
        data: temps.map((m) => m.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.08)',
        yAxisID: 'y',
        tension: 0.4,
        pointRadius: 3,
      },
      {
        label: 'Humidité (%)',
        data: humidities.map((m) => m.value),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.08)',
        yAxisID: 'y2',
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index' as const, intersect: false },
    plugins: {
      legend: { position: 'bottom' as const, labels: { boxWidth: 12, font: { size: 11 } } },
    },
    scales: {
      x: { ticks: { font: { size: 10 }, maxTicksLimit: 8 } },
      y:  { type: 'linear' as const, position: 'left'  as const, title: { display: true, text: '°C', font: { size: 10 } }, ticks: { font: { size: 10 } } },
      y2: { type: 'linear' as const, position: 'right' as const, title: { display: true, text: '%',  font: { size: 10 } }, ticks: { font: { size: 10 } }, grid: { drawOnChartArea: false } },
    },
  };

  return <Line data={data} options={options} />;
}
