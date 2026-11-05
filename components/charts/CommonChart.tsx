import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { ChartCard, chartColors, chartGridColor, chartTooltip, formatShare } from './ChartCard';

export interface ICommonChartProps {
  title: string;
  hint?: string;
  label: string;
  stats: {
    title: string;
    value: number;
  }[];
  height: number;
  chartId?: string;
  actions?: React.ReactNode;
  className?: string;
}

const MAX_LABEL_LENGTH = 36;

export const CommonChart: React.FunctionComponent<ICommonChartProps> = ({
  title,
  hint,
  label,
  stats,
  height,
  chartId,
  actions,
  className
}: React.PropsWithChildren<ICommonChartProps>) => {
  const isEmpty = !stats || stats.length === 0;
  const totalHits = (stats || []).reduce((total, stat) => total + stat.value, 0);

  return (
    <ChartCard title={title} hint={hint} actions={actions} isEmpty={isEmpty} className={className}>
      <div
        id={chartId}
        style={{
          position: 'relative',
          width: '100%',
          height,
        }}
      >
        <Bar
          options={{
            indexAxis: 'y',
            maintainAspectRatio: false,
            responsive: true,
            interaction: {
              mode: 'nearest',
              axis: 'y',
              intersect: false,
            },
            plugins: {
              tooltip: {
                ...chartTooltip,
                callbacks: {
                  label: ({ raw }) => `${(raw as number).toLocaleString()} (${formatShare(raw as number, totalHits)} of those shown)`,
                },
              },
              legend: {
                display: false, // Hide legend for cleaner look
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                border: {
                  display: false,
                },
                grid: {
                  color: chartGridColor,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  maxRotation: 0,
                  // Long URLs would squeeze the bars, the tooltip shows the full value
                  callback: function (value) {
                    const text = this.getLabelForValue(value as number);
                    return text.length > MAX_LABEL_LENGTH ? `${text.slice(0, MAX_LABEL_LENGTH - 1)}…` : text;
                  },
                },
              },
            },
          }}
          data={{
            labels: (stats || []).map(r => r.title),
            datasets: [
              {
                label,
                data: (stats || []).map(r => r.value),
                backgroundColor: chartColors.primary,
                hoverBackgroundColor: chartColors.primaryHover,
                borderRadius: 4,
                borderSkipped: 'start',
                maxBarThickness: 18,
              }
            ]
          }}
        />
      </div>
    </ChartCard>
  );
};
