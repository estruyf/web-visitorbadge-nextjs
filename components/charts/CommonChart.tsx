import * as React from 'react';
import { Bar } from 'react-chartjs-2';

export interface ICommonChartProps {
  title: string;
  label: string;
  stats: {
    title: string;
    value: number;
  }[];
  height: number;
  fullWidth?: boolean;
}

export const CommonChart: React.FunctionComponent<ICommonChartProps> = ({
  title,
  label,
  stats,
  height,
  fullWidth,
}: React.PropsWithChildren<ICommonChartProps>) => {


  if (!stats || stats.length === 0) {
    return (
      <section className={`space-y-4 col-span-12 sm:mt-0 ${fullWidth ? '' : 'sm:col-span-6'}`}>
        <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
          {title}
        </h3>
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
            <p className="mt-1 text-sm text-gray-500">Data will appear here once available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`space-y-4 col-span-12 sm:mt-0 ${fullWidth ? '' : 'sm:col-span-6'}`}>
      <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
        {title}
      </h3>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: Math.max(250, stats.length * 18), // Increased height multiplier and minimum height
          minHeight: 250,
        }}
      >
        <Bar
          options={{
            indexAxis: 'y',
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: '#CC8312',
                borderWidth: 1,
              },
              legend: {
                display: false, // Hide legend for cleaner look
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)',
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  font: {
                    size: 11,
                  },
                  maxRotation: 0,
                },
              },
            },
          }}
          data={{
            labels: stats.map(r => r.title),
            datasets: [
              {
                label,
                data: stats.map(r => r.value),
                borderWidth: 1,
                borderColor: '#CC8312',
                backgroundColor: "#FCF2E1",
                borderRadius: 4,
                borderSkipped: false,
              }
            ]
          }}
        />
      </div>
    </section>
  );
};