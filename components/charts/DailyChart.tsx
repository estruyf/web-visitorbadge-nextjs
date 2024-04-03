import * as React from 'react';
import { Line } from "react-chartjs-2";
import { DailyResult } from '../../models';

export interface IDailyChartProps {
  stats: DailyResult[];
}

export const DailyChart: React.FunctionComponent<IDailyChartProps> = ({
  stats
}: React.PropsWithChildren<IDailyChartProps>) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <section className='space-y-4'>
      <h3 className='font-heading text-xl leading-6 font-medium text-blue-500'>
        Daily visitors
      </h3>

      <Line
        height={100}
        data={{
          labels: stats.map(r => r.title),
          datasets: [
            {
              label: 'Daily visitors',
              data: stats.map(r => r.total),
              fill: true,
              borderWidth: 1,
              borderColor: '#CC8312',
              backgroundColor: "#FCF2E1",
              pointRadius: 5,
            }
          ]
        }}
      />
    </section>
  );
};