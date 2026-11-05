import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartCard, chartColors, chartGridColor, chartTooltip, formatShare } from './ChartCard';

export interface ITrafficSplitChartProps {
  days: {
    title: string;
    github: number;
    other: number;
  }[];
  chartId?: string;
  actions?: React.ReactNode;
}

export const TrafficSplitChart: React.FunctionComponent<ITrafficSplitChartProps> = ({
  days,
  chartId,
  actions
}: React.PropsWithChildren<ITrafficSplitChartProps>) => {
  const githubHits = days.reduce((total, day) => total + day.github, 0);
  const totalHits = days.reduce((total, day) => total + day.github + day.other, 0);

  return (
    <ChartCard
      title="GitHub READMEs vs other traffic"
      hint={`${formatShare(githubHits, totalHits)} of hits came through GitHub's image proxy.`}
      actions={actions}
    >
      <div id={chartId} className="relative h-64">
        <Bar
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            plugins: {
              legend: {
                align: 'start',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'rectRounded',
                  boxHeight: 8,
                },
              },
              tooltip: {
                ...chartTooltip,
                displayColors: true,
                callbacks: {
                  label: ({ dataset, raw, dataIndex }) => {
                    const day = days[dataIndex];
                    const value = raw as number;
                    return `${dataset.label}: ${value.toLocaleString()} (${formatShare(value, day.github + day.other)})`;
                  },
                },
              },
            },
            scales: {
              x: {
                stacked: true,
                grid: {
                  display: false,
                },
              },
              y: {
                stacked: true,
                beginAtZero: true,
                border: {
                  display: false,
                },
                grid: {
                  color: chartGridColor,
                },
              },
            },
          }}
          data={{
            labels: days.map(day => day.title),
            datasets: [
              {
                label: 'Other traffic',
                data: days.map(day => day.other),
                backgroundColor: chartColors.primary,
                maxBarThickness: 24,
              },
              {
                label: 'GitHub READMEs',
                data: days.map(day => day.github),
                backgroundColor: chartColors.secondary,
                // The bottom border is the gap between the two segments
                borderColor: '#FFFFFF',
                borderWidth: { bottom: 2 },
                borderRadius: { topLeft: 4, topRight: 4 },
                borderSkipped: false,
                maxBarThickness: 24,
              },
            ],
          }}
        />
      </div>

      <details className="mt-4 text-sm text-ink-500">
        <summary className="cursor-pointer font-medium text-ink-700">View as table</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="py-1.5 pr-4 font-medium">Date</th>
                <th className="py-1.5 pr-4 font-medium text-right">GitHub READMEs</th>
                <th className="py-1.5 font-medium text-right">Other traffic</th>
              </tr>
            </thead>
            <tbody className="font-mono text-ink-900">
              {days.map(day => (
                <tr key={day.title} className="border-b border-line last:border-0">
                  <td className="py-1.5 pr-4">{day.title}</td>
                  <td className="py-1.5 pr-4 text-right">{day.github.toLocaleString()}</td>
                  <td className="py-1.5 text-right">{day.other.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </ChartCard>
  );
};
