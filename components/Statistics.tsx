import * as React from 'react';
import { Statistic } from './Statistic';
import { CommonStatistic, DailyResult, PageResult } from '../models';

export interface IStatisticsProps {
  total: number;
  today: number;
  days: number;
  dailyStats: DailyResult[];
  pagesStats: PageResult[];
  bestCountry: CommonStatistic | undefined;
  bestBrowser: CommonStatistic | undefined;
}

export const Statistics: React.FunctionComponent<IStatisticsProps> = ({ dailyStats, pagesStats, days, total, today, bestCountry, bestBrowser }: React.PropsWithChildren<IStatisticsProps>) => {

  let bestDay: DailyResult | undefined;
  let bestPage: PageResult | undefined;

  if (dailyStats.length > 0) {
    const best = Math.max(...dailyStats.map(d => d.total));

    if (best) {
      bestDay = dailyStats.find(d => d.total === best);
    }
  }

  if (pagesStats.length > 0) {
    const best = Math.max(...pagesStats.map(d => d.count));

    if (best) {
      bestPage = pagesStats.find(d => d.count === best);
    }
  }

  return (
    <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {(total !== undefined && total !== null) && <Statistic title={`Total Visitors`} total={total} />}

      {(today !== undefined && today !== null) && <Statistic title={`Today's Visitors`} total={today} />}

      {(dailyStats && dailyStats.length > 0) && <Statistic title={`Last ${days} Days`} total={dailyStats.map(d => d.total).reduce((a, b) => (a + b))} />}

      {(bestDay && bestDay.total) && <Statistic title={`Peak Day`} subTitle={bestDay.title} total={bestDay.total} />}

      {(bestCountry && bestCountry.title) && <Statistic title={`Top Country`} subTitle={bestCountry.title} total={bestCountry.value} />}

      {(bestBrowser && bestBrowser.title) && <Statistic title={`Top Browser`} subTitle={bestBrowser.title} total={bestBrowser.value} />}

      {(bestPage && bestPage.url) && <Statistic title={`Most Popular Page`} subTitle={bestPage.url} total={bestPage.count} />}
    </dl>
  );
};