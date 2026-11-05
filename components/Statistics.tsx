import * as React from 'react';
import { Statistic } from './Statistic';
import { CommonStatistic, DailyResult, PageResult } from '../models';
import { formatShare } from './charts/ChartCard';

export interface IStatisticsProps {
  total: number;
  today: number;
  days: number;
  dailyStats: DailyResult[];
  pagesStats: PageResult[];
  bestCountry: CommonStatistic | undefined;
  bestBrowser: CommonStatistic | undefined;
  countryHits: number;
  browserHits: number;
  onTodaySelect?: () => void;
}

export const Statistics: React.FunctionComponent<IStatisticsProps> = ({ dailyStats, pagesStats, days, total, today, bestCountry, bestBrowser, countryHits, browserHits, onTodaySelect }: React.PropsWithChildren<IStatisticsProps>) => {

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

  const periodHits = dailyStats.reduce((sum, day) => sum + day.total, 0);
  const pageHits = pagesStats.reduce((sum, page) => sum + page.count, 0);

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

    return {
      periodGrowth: growth,
      averageDaily: sortedStats.reduce((sum, day) => sum + day.total, 0) / sortedStats.length
    };
  }, [dailyStats]);

  // The API doesn't include today in the daily stats, so the latest day is yesterday
  const yesterday = React.useMemo(() => {
    const dates = dailyStats.map(d => d.title).sort();
    return dailyStats.find(d => d.title === dates[dates.length - 1]);
  }, [dailyStats]);

  return (
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {(total !== undefined && total !== null) &&
        <Statistic
          title={`Total Hits`}
          total={total}
          featured
          className="sm:col-span-2 lg:row-span-2"
        />
      }

      {(today !== undefined && today !== null) &&
        <Statistic
          title={`Today's Hits`}
          total={today}
          subTitle={yesterday ? `Yesterday: ${yesterday.total.toLocaleString()}` : undefined}
          action={onTodaySelect && (
            <button type="button" className="text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-ink-900" onClick={onTodaySelect}>
              View today&apos;s breakdown
            </button>
          )}
        />
      }

      {(dailyStats && dailyStats.length > 0) &&
        <Statistic
          title={`Last ${days} Days`}
          total={periodHits}
          growth={growthData.periodGrowth}
          growthLabel="vs earlier days"
          trend={growthData.periodGrowth ? (growthData.periodGrowth > 2 ? 'up' : growthData.periodGrowth < -2 ? 'down' : 'stable') : undefined}
          subTitle={`Avg: ${Math.round(growthData.averageDaily || 0)} hits/day`}
        />
      }

      {(bestDay && bestDay.total) && <Statistic title={`Peak Day`} subTitle={`${bestDay.title}, ${formatShare(bestDay.total, periodHits)} of this period`} total={bestDay.total} />}

      {(bestCountry && bestCountry.title) && <Statistic title={`Top Country`} subTitle={`${bestCountry.title}, ${formatShare(bestCountry.value, countryHits)} of hits`} total={bestCountry.value} />}

      {(bestBrowser && bestBrowser.title) && <Statistic title={`Top Browser`} subTitle={`${bestBrowser.title}, ${formatShare(bestBrowser.value, browserHits)} of known browsers`} total={bestBrowser.value} />}

      {(bestPage && bestPage.url) && <Statistic title={`Most Popular Page`} subTitle={`${bestPage.url}, ${formatShare(bestPage.count, pageHits)} of page hits`} total={bestPage.count} className="lg:col-span-3" />}
    </dl>
  );
};
