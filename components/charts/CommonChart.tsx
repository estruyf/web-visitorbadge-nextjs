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
    return null;
  }

  return (
    <section className={`space-y-4 col-span-12 ${fullWidth ? '' : 'lg:col-span-6'}`}>
      <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
        {title}
      </h3>

      <Bar
        height={height}
        data={{
          labels: stats.map(r => r.title),
          datasets: [
            {
              label,
              data: stats.map(r => r.value),
              borderWidth: 1,
              borderColor: '#CC8312',
              backgroundColor: "#FCF2E1",
              indexAxis: 'y'
            }
          ]
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              right: 20
            }
          },
          scales: {
            x: {
              ticks: {
                display: true
              }
            },
            y: {
              ticks: {
                display: true,
                maxRotation: 0,
                callback: function(value, index) {
                  const label = stats[index]?.title || '';
                  return label.length > 30 ? label.substring(0, 30) + '...' : label;
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }}
      />
    </section>
  );
};