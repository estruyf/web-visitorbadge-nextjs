import * as React from 'react';
import { Line } from "react-chartjs-2";
import { DailyResult } from '../../models';

export interface IDailyChartProps {
  stats: DailyResult[];
  onDateSelect?: (date: string, data: DailyResult) => void;
  selectedDate?: string;
}

export const DailyChart: React.FunctionComponent<IDailyChartProps> = ({
  stats,
  onDateSelect,
  selectedDate
}: React.PropsWithChildren<IDailyChartProps>) => {
  // Sort data from old to new (chronological order)
  const sortedStats = React.useMemo(() => {
    if (!stats || stats.length === 0) return [];
    return [...stats].sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
  }, [stats]);

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className='space-y-4'>
      <div className="flex items-center justify-between">
        <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
          Daily visitors
        </h3>
        {onDateSelect && (
          <p className="text-sm text-gray-500">
            Click on a data point to view daily details
          </p>
        )}
      </div>

      <Line
        height={120}
        options={{
          responsive: true,
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
            tooltip: {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              titleColor: '#374151',
              bodyColor: '#374151',
              borderColor: '#CC8312',
              borderWidth: 1,
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
              title: {
                display: true,
                text: 'Date'
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Visitors'
              },
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)',
              }
            }
          }
        }}
        data={{
          labels: sortedStats.map(r => r.title),
          datasets: [
            {
              label: 'Daily visitors',
              data: sortedStats.map(r => r.total),
              fill: true,
              borderWidth: 2,
              borderColor: '#CC8312',
              backgroundColor: "rgba(252, 242, 225, 0.6)",
              pointRadius: 6,
              pointHoverRadius: 8,
              pointBackgroundColor: '#CC8312',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              tension: 0.1,
            }
          ]
        }}
      />
    </section>
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
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data.browsers]);

  const topCountries = React.useMemo(() => {
    return Object.entries(data.countries || {})
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data.countries]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto transform transition-all duration-300 scale-100 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-heading font-bold text-gray-900">
                Daily Analytics
              </h3>
              <p className="text-lg text-gray-600 mt-1">{date}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{data.total}</div>
              <div className="text-sm text-blue-600 font-medium">Total Visitors</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{topBrowsers.length}</div>
              <div className="text-sm text-green-600 font-medium">Different Browsers</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{topCountries.length}</div>
              <div className="text-sm text-purple-600 font-medium">Different Countries</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Browsers</h4>
              <div className="space-y-3">
                {topBrowsers.map(({ browser, count }, index) => (
                  <div key={browser} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold text-sm mr-3">
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{browser}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Countries</h4>
              <div className="space-y-3">
                {topCountries.map(({ country, count }, index) => (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3">
                        {index + 1}
                      </div>
                      <span className="text-gray-900">{country}</span>
                    </div>
                    <span className="font-semibold text-gray-700">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};