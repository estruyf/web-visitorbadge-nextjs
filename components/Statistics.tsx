import * as React from 'react';
import { DailyResult } from '../hooks/useStatus';
import { Statistic } from './Statistic';

export interface IStatisticsProps {
  total: number;
  today: number;
  dailyStats: DailyResult[];
  bestCountry: { title: string; value: number } | null;
  bestBrowser: { title: string; value: number } | null;
}

export const Statistics: React.FunctionComponent<IStatisticsProps> = ({dailyStats, total, today, bestCountry, bestBrowser}: React.PropsWithChildren<IStatisticsProps>) => {
  
  let bestDay: DailyResult | undefined;
  
  let allCountries = {} as { [country: string]: number };
  let allBrowsers = {} as { [country: string]: number };

  if (dailyStats.length > 0) {
    const best = Math.max(...dailyStats.map(d => d.total));

    if (best) {
      bestDay = dailyStats.find(d => d.total === best);
    }
  }

  return (
    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
      {total && <Statistic title={`Total hits`} total={total} />}

      {today && <Statistic title={`Today`} total={today} />}

      {(dailyStats && dailyStats.length > 0) && <Statistic title={`Hits the last 7 days`} total={dailyStats.map(d => d.total).reduce((a, b) => (a + b))} />}

      {(bestDay && bestDay.total) && <Statistic title={`Best day: ${bestDay.title}`} total={bestDay.total} />}

      {(bestCountry && bestCountry.title) && <Statistic title={`Country: ${bestCountry.title}`} total={bestCountry.value} />}

      {(bestBrowser && bestBrowser.title) && <Statistic title={`Browser: ${bestBrowser.title}`} total={bestBrowser.value} />}
    </dl>
  );
};