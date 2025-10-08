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

  // Calculate growth trends
  const growthData = React.useMemo(() => {
    if (!dailyStats || dailyStats.length < 2) return {};

    const sortedStats = [...dailyStats].sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime());
    const midPoint = Math.floor(sortedStats.length / 2);

    const firstHalf = sortedStats.slice(0, midPoint);
    const secondHalf = sortedStats.slice(midPoint);

    const firstHalfAvg = firstHalf.reduce((sum, day) => sum + day.total, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, day) => sum + day.total, 0) / secondHalf.length;

    const growth = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

    // Calculate yesterday vs today for today's growth
    const todayIndex = sortedStats.length - 1;
    const yesterdayIndex = todayIndex - 1;
    const todayGrowth = yesterdayIndex >= 0 && sortedStats[yesterdayIndex].total > 0
      ? ((sortedStats[todayIndex].total - sortedStats[yesterdayIndex].total) / sortedStats[yesterdayIndex].total) * 100
      : 0;

    return {
      periodGrowth: growth,
      todayGrowth: todayGrowth,
      averageDaily: sortedStats.reduce((sum, day) => sum + day.total, 0) / sortedStats.length
    };
  }, [dailyStats]);

  return (
    <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {(total !== undefined && total !== null) &&
        <Statistic
          title={`Total Visitors`}
          total={total}
          growth={growthData.periodGrowth}
          trend={growthData.periodGrowth ? (growthData.periodGrowth > 2 ? 'up' : growthData.periodGrowth < -2 ? 'down' : 'stable') : undefined}
        />
      }

      {(today !== undefined && today !== null) &&
        <Statistic
          title={`Today's Visitors`}
          total={today}
          growth={growthData.todayGrowth}
          trend={growthData.todayGrowth ? (growthData.todayGrowth > 5 ? 'up' : growthData.todayGrowth < -5 ? 'down' : 'stable') : undefined}
        />
      }

      {(dailyStats && dailyStats.length > 0) &&
        <Statistic
          title={`Last ${days} Days`}
          total={dailyStats.map(d => d.total).reduce((a, b) => (a + b))}
          subTitle={`Avg: ${Math.round(growthData.averageDaily || 0)} visits/day`}
        />
      }

      {(bestDay && bestDay.total) && <Statistic title={`Peak Day`} subTitle={bestDay.title} total={bestDay.total} />}

      {(bestCountry && bestCountry.title) && <Statistic title={`Top Country`} subTitle={bestCountry.title} total={bestCountry.value} />}

      {(bestBrowser && bestBrowser.title) && <Statistic title={`Top Browser`} subTitle={bestBrowser.title} total={bestBrowser.value} />}

      {(bestPage && bestPage.url) && <Statistic title={`Most Popular Page`} subTitle={bestPage.url} total={bestPage.count} />}
    </dl>
  );
};