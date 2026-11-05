import * as React from 'react';
import { Line } from "react-chartjs-2";
import { DailyResult } from '../../models';
import { DEFAULTS } from '../../constants/Defaults';
import { ChartCard, chartColors, chartGridColor, chartTooltip } from './ChartCard';

export interface IDailyChartProps {
  stats: DailyResult[];
  onDateSelect?: (date: string, data: DailyResult) => void;
  selectedDate?: string;
  chartId?: string;
  actions?: React.ReactNode;
}

export const DailyChart: React.FunctionComponent<IDailyChartProps> = ({
  stats,
  onDateSelect,
  selectedDate,
  chartId = 'daily-chart',
  actions
}: React.PropsWithChildren<IDailyChartProps>) => {
  // Sort data from old to new (chronological order)
  const sortedStats = React.useMemo(() => {
    if (!stats || stats.length === 0) return [];
    return [...stats].sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
  }, [stats]);

  return (
    <ChartCard
      title="Daily hits"
      hint={onDateSelect && sortedStats.length > 0 ? 'Click on a data point to view daily details' : undefined}
      actions={actions}
      isEmpty={sortedStats.length === 0}
    >
      <div id={chartId} className={`relative h-72 sm:h-80 ${onDateSelect ? 'cursor-pointer' : ''}`}>
        <Line
          options={{
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              mode: 'index',
              intersect: false,
            },
            onClick: (event, elements) => {
              if (elements.length > 0 && onDateSelect) {
                const index = elements[0].index;
                const selectedData = sortedStats[index];
                onDateSelect(selectedData.title, selectedData);
              }
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                ...chartTooltip,
                callbacks: {
                  afterBody: () => {
                    return onDateSelect ? ['', 'Click to view daily details'] : [];
                  }
                }
              },
            },
            scales: {
              x: {
                display: true,
                grid: {
                  display: false,
                }
              },
              y: {
                display: true,
                beginAtZero: true,
                border: {
                  display: false,
                },
                grid: {
                  color: chartGridColor,
                }
              }
            }
          }}
          data={{
            labels: sortedStats.map(r => r.title),
            datasets: [
              {
                label: 'Daily hits',
                data: sortedStats.map(r => r.total),
                fill: true,
                borderWidth: 2,
                borderColor: chartColors.primary,
                backgroundColor: ({ chart }) => {
                  if (!chart.chartArea) {
                    return 'transparent';
                  }

                  const gradient = chart.ctx.createLinearGradient(0, chart.chartArea.top, 0, chart.chartArea.bottom);
                  gradient.addColorStop(0, 'rgba(185, 119, 15, 0.28)');
                  gradient.addColorStop(1, 'rgba(185, 119, 15, 0)');
                  return gradient;
                },
                pointRadius: 4,
                pointHoverRadius: 7,
                pointHitRadius: 16,
                pointBackgroundColor: chartColors.primary,
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                tension: 0.3,
              }
            ]
          }}
        />
      </div>
    </ChartCard>
  );
};

// Component to display daily details
export interface IDailyDetailsProps {
  date: string;
  data: DailyResult;
  onClose: () => void;
}

export const DailyDetails: React.FunctionComponent<IDailyDetailsProps> = ({
  date,
  data,
  onClose
}: React.PropsWithChildren<IDailyDetailsProps>) => {
  // Add keyboard support for closing the modal
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const topBrowsers = React.useMemo(() => {
    return Object.entries(data.browsers || {})
      .filter(([title]) => title !== DEFAULTS.githubProxy)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data.browsers]);

  const topCountries = React.useMemo(() => {
    return Object.entries(data.countries || {})
      .map(([country, count]) => ({ title: country === '-' ? 'Unknown' : country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data.countries]);

  const githubHits = data.browsers?.[DEFAULTS.githubProxy] || 0;

  const totals = [
    { title: 'Total Hits', value: data.total },
    { title: 'Different Browsers', value: Object.keys(data.browsers || {}).filter(title => title !== DEFAULTS.githubProxy).length },
    { title: 'Different Countries', value: Object.keys(data.countries || {}).length },
  ];

  return (
    <div
      className="fixed inset-0 bg-ink-950 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-details-title"
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 id="daily-details-title" className="font-heading text-3xl font-bold text-ink-900">
                Daily Analytics
              </h3>
              <p className="font-mono text-sm text-ink-500 mt-1">{date}</p>
            </div>
            <button
              autoFocus
              onClick={onClose}
              className="text-ink-400 hover:text-ink-900 hover:bg-paper-dark rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <dl className={`grid grid-cols-1 sm:grid-cols-3 gap-3 ${githubHits > 0 ? 'mb-3' : 'mb-8'}`}>
            {totals.map(({ title, value }) => (
              <div key={title} className="bg-paper border border-line rounded-xl p-4">
                <dt className="text-sm font-medium text-ink-500">{title}</dt>
                <dd className="mt-1 font-mono text-3xl font-bold text-ink-900">{value.toLocaleString()}</dd>
              </div>
            ))}
          </dl>

          {
            githubHits > 0 && (
              <p className="mb-8 text-sm text-ink-500">
                {githubHits.toLocaleString()} hits came through GitHub&apos;s image proxy, which hides the reader&apos;s browser.
              </p>
            )
          }

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RankedList title="Top Browsers" items={topBrowsers} />
            <RankedList title="Top Countries" items={topCountries} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RankedList: React.FunctionComponent<{ title: string; items: { title: string; count: number }[] }> = ({ title, items }) => {
  const max = items.length > 0 ? items[0].count : 0;

  return (
    <div>
      <h4 className="font-heading text-lg font-bold text-ink-900 mb-3">{title}</h4>
      <ol className="space-y-3">
        {items.map((item) => (
          <li key={item.title}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-ink-900">{item.title}</span>
              <span className="font-mono font-medium text-ink-700">{item.count.toLocaleString()}</span>
            </div>
            <div className="mt-1 h-1.5 bg-paper-dark rounded-full overflow-hidden" aria-hidden="true">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${max ? (item.count / max) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
