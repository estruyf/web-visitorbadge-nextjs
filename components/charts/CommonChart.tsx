import * as React from 'react';
import { Bar } from 'react-chartjs-2';

export interface ICommonChartProps {
  title: string;
  label: string;
  stats: {
    title: string;
    value: number;
  }[];
  fullWidth?: boolean;
}

export const CommonChart: React.FunctionComponent<ICommonChartProps> = ({
  title,
  label,
  stats,
  fullWidth,
}: React.PropsWithChildren<ICommonChartProps>) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className={`space-y-4 col-span-12 sm:mt-0 ${fullWidth ? '' : 'sm:col-span-6'}`}>
      <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
        {title}
      </h3>

      <Bar
        height={fullWidth ? 100 : 200}
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
      />
    </section>
  );
};