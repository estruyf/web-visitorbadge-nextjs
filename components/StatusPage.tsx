import * as React from 'react';
import useStatus from '../hooks/useStatus';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Title, Legend } from "chart.js";
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './Status';
import Head from 'next/head';
import { API } from '../constants/API';
import { DEFAULTS } from '../constants/Defaults';
import { Statistics } from './Statistics';
import { DailyChart, DailyDetails } from './charts/DailyChart';
import { CommonChart } from './charts/CommonChart';
import { TrafficSplitChart } from './charts/TrafficSplitChart';
import { ExportCsvButton } from './ExportCsvButton';
import { TrendingPages } from './TrendingPages';
import { formatShare } from './charts/ChartCard';
import { SponsorButton } from './SponsorButton';
import useStatistics from '../hooks/useStatistics';

// Export Button Component
const ExportButton: React.FC<{ chartId: string; filename: string }> = ({ chartId, filename }) => {
  const handleExport = React.useCallback(() => {
    const canvas = document.querySelector(`#${chartId} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      link.click();
    }
  }, [chartId, filename]);

  return (
    <button
      onClick={handleExport}
      className="inline-flex flex-shrink-0 items-center px-2.5 py-1.5 text-sm font-medium text-ink-700 bg-white border border-line rounded-lg hover:border-ink-300 hover:text-ink-900 transition-colors"
      title="Export chart as PNG"
    >
      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export
    </button>
  );
};

// Data Freshness Indicator Component
const DataFreshnessIndicator: React.FC<{ loading: boolean; error: boolean }> = ({ loading, error }) => {
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  React.useEffect(() => {
    if (!loading) {
      setLastUpdated(new Date());
    }
  }, [loading]);

  const getTimeAgo = React.useCallback(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }, [lastUpdated]);

  const [timeAgo, setTimeAgo] = React.useState(getTimeAgo());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(getTimeAgo());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [getTimeAgo]);

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-ink-800 text-ink-100">
      <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-amber-400 animate-pulse' : 'bg-amber-300'}`}></div>
      {loading ? 'Updating...' : error ? 'Not updated' : `Updated ${timeAgo}`}
    </div>
  );
};

// Skeleton Components for Loading States
const StatisticSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`px-5 py-5 bg-white rounded-2xl border border-line ${className || ''}`}>
    <div className="animate-pulse">
      <div className="h-4 bg-paper-dark rounded w-24 mb-3"></div>
      <div className="h-8 bg-paper-dark rounded w-20 mb-2"></div>
      <div className="h-4 bg-paper-dark rounded w-32"></div>
    </div>
  </div>
);

const ChartSkeleton: React.FC<{ height?: number; className?: string }> = ({ height = 300, className }) => (
  <div className={`bg-white rounded-2xl border border-line p-5 sm:p-6 ${className || ''}`}>
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-5">
        <div className="h-6 bg-paper-dark rounded w-32"></div>
        <div className="h-8 bg-paper-dark rounded w-20"></div>
      </div>
      <div className="bg-paper-dark rounded-xl" style={{ height: `${height}px` }}></div>
    </div>
  </div>
);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Title, Legend);
ChartJS.defaults.font.family = "'Instrument Sans', system-ui, sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = '#56657C';

// Row height of the horizontal bar charts
const BAR_ROW_HEIGHT = 30;
const MIN_BAR_CHART_HEIGHT = 240;

export interface IStatusPageProps {
  url?: string;
  user?: string;
  repo?: string;
}

export const StatusPage: React.FunctionComponent<IStatusPageProps> = ({ url, user, repo }: React.PropsWithChildren<IStatusPageProps>) => {
  const { loading, error, total, today, todayStats, created, daily, pages, isSponsor, days } = useStatus(url, user, repo);
  const { mostUsedBrowser, mostVisitedCountry, allBrowsers, allCountries, browserHits, countryHits, trafficSplit, githubHits, sources, trendingPages, trendingWindow } = useStatistics(daily, pages);

  // State for daily details modal
  const [selectedDailyData, setSelectedDailyData] = React.useState<{ date: string; data: any } | null>(null);

  const sortedPages = React.useMemo(() => {
    return pages.sort((a, b) => b.count - a.count).slice(0, 25);
  }, [pages]);

  const trackingPath = React.useMemo(() => {
    if (url) {
      return url;
    } else if (user && repo) {
      return `${user}/${repo}`;
    } else {
      return DEFAULTS.url;
    }
  }, [url, user, repo]);

  const commonStatsHeight = React.useMemo(() => {
    return Math.max(MIN_BAR_CHART_HEIGHT, Math.max(allBrowsers.length, allCountries.length) * BAR_ROW_HEIGHT);
  }, [allBrowsers, allCountries]);

  const pagesHeight = React.useMemo(() => {
    return Math.max(MIN_BAR_CHART_HEIGHT, sortedPages.length * BAR_ROW_HEIGHT);
  }, [sortedPages]);

  const periodHits = React.useMemo(() => daily.reduce((sum, day) => sum + day.total, 0), [daily]);

  const handleTodaySelect = React.useCallback(() => {
    if (todayStats) {
      setSelectedDailyData({
        date: 'Today so far',
        data: { title: 'Today', total: today, browsers: todayStats.browsers, countries: todayStats.countries }
      });
    }
  }, [today, todayStats]);

  // Handler for date selection in daily chart
  const handleDateSelect = React.useCallback((date: string, data: any) => {
    setSelectedDailyData({ date, data });
  }, []);

  // Handler to close daily details modal
  const handleCloseDailyDetails = React.useCallback(() => {
    setSelectedDailyData(null);
  }, []);

  return (
    <>
      <Head>
        <title>Visitor overview for {trackingPath}</title>
        <meta name="description" content={`Visitor overview for ${trackingPath}`} />
        <meta property="og:description" content={`Visitor overview for ${trackingPath}`} />
        <meta property="twitter:description" content={`Visitor overview for ${trackingPath}`} />

        <link rel="preconnect" href={process.env.NEXT_PUBLIC_VISITOR_API} />

        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        <meta property="twitter:image" content={`https://visitorbadge.io/preview.png`} />
        <meta property="og:image" content={`https://visitorbadge.io/preview.png`} />

        <meta property="twitter:url" content="https://www.visitorbadge.io/status" />
        <meta property="og:url" content="https://www.visitorbadge.io/status" />

        <meta name="robots" content="noindex" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="bg-ink-900 text-white">
          <Header labelColor={`#555555`} countColor={`#263759`} badgeStyle={`default`} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-10 lg:pb-12 flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <DataFreshnessIndicator loading={loading} error={error} />
              <p className="mt-5 text-lg text-ink-200">Visitor Badge statistics for</p>
              <h1 className="mt-1 font-heading font-extrabold text-3xl sm:text-5xl break-words" style={{ overflowWrap: 'anywhere', lineHeight: 1.1 }}>
                {trackingPath}
              </h1>
            </div>

            {
              typeof isSponsor !== "undefined" && !isSponsor && (
                <SponsorButton />
              )
            }
          </div>

          <div className="ruler" aria-hidden="true" />
        </div>

        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-ink-900">
                {loading ? 'Loading your statistics' : error ? 'Statistics unavailable' : `The last ${days} days`}
              </h2>

              {!loading && !error && daily.length > 0 && <ExportCsvButton daily={daily} pages={pages} />}
            </div>

            {!loading && error && (
              <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 space-y-4" role="alert">
                <p className="text-base text-ink-500">
                  We couldn&apos;t load the statistics for this badge. Please try again in a moment.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-amber-400 px-3.5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-amber-300 transition-colors"
                  onClick={() => window.location.reload()}
                >
                  Try again
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatisticSkeleton className="sm:col-span-2 lg:row-span-2" />
                {[...Array(5)].map((_, i) => (
                  <StatisticSkeleton key={i} />
                ))}
                <StatisticSkeleton className="lg:col-span-3" />
              </div>
            ) : !error && (
              <Statistics
                total={total}
                today={today}
                created={created}
                dailyStats={daily}
                pagesStats={pages}
                bestBrowser={mostUsedBrowser}
                bestCountry={mostVisitedCountry}
                browserHits={browserHits}
                countryHits={countryHits}
                onTodaySelect={todayStats ? handleTodaySelect : undefined}
                days={days} />
            )}

            {loading ? (
              <>
                <ChartSkeleton height={320} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ChartSkeleton height={360} />
                  <ChartSkeleton height={360} />
                </div>
              </>
            ) : !error && (
              <>
                <DailyChart
                  stats={daily}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDailyData?.date}
                  chartId="daily-hits-chart"
                  actions={<ExportButton chartId="daily-hits-chart" filename="daily-hits" />}
                />

                {
                  githubHits > 0 && (
                    <TrafficSplitChart
                      days={trafficSplit}
                      chartId="traffic-split-chart"
                      actions={<ExportButton chartId="traffic-split-chart" filename="traffic-split" />}
                    />
                  )
                }

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CommonChart
                    title={`Top 10 Browsers`}
                    hint={githubHits > 0 ? `Without GitHub's image proxy, which hides the reader's browser.` : undefined}
                    label={`Browsers`}
                    stats={allBrowsers}
                    height={commonStatsHeight}
                    chartId="browsers-chart"
                    actions={<ExportButton chartId="browsers-chart" filename="top-browsers" />} />

                  <CommonChart
                    title={`Top 12 Countries`}
                    hint={githubHits > 0 ? `${formatShare(githubHits, periodHits)} of hits came through GitHub's image proxy, so some locations may be the proxy's.` : undefined}
                    label={`Countries`}
                    stats={allCountries}
                    height={commonStatsHeight}
                    chartId="countries-chart"
                    actions={<ExportButton chartId="countries-chart" filename="top-countries" />} />

                  {
                    sources.length > 0 && (
                      <CommonChart
                        title={`Top Sources`}
                        hint={`The sites that loaded your badge. GitHub doesn't pass this on.`}
                        label={`Sources`}
                        stats={sources}
                        height={Math.max(MIN_BAR_CHART_HEIGHT, sources.length * BAR_ROW_HEIGHT)}
                        chartId="sources-chart"
                        className={trendingPages.length > 0 ? '' : 'lg:col-span-2'}
                        actions={<ExportButton chartId="sources-chart" filename="top-sources" />} />
                    )
                  }

                  {
                    trendingPages.length > 0 && (
                      <TrendingPages
                        pages={trendingPages}
                        window={trendingWindow}
                        className={sources.length > 0 ? '' : 'lg:col-span-2'} />
                    )
                  }

                  <CommonChart
                    title={`Most Popular Pages ${pages.length > 25 ? "(Top 25)" : ""}`}
                    label={`Pages/Slug`}
                    stats={(sortedPages || []).map(page => ({ title: page.url, value: page.count }))}
                    height={pagesHeight}
                    chartId="pages-chart"
                    className="lg:col-span-2"
                    actions={<ExportButton chartId="pages-chart" filename="popular-pages" />} />
                </div>
              </>
            )}
          </div>
        </main>

        <Status
          username={trackingPath}
          isSponsor={isSponsor} />

        <Footer />

        <a className='hidden' href="https://visitorbadge.io/status?path=https%3A%2F%2Fwww.visitorbadge.io%2Fstatus" title="Status of status page" rel="nofollow" >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.visitors}?path=https%3A%2F%2Fwww.visitorbadge.io%2Fstatus&countColor=%23263759&slug=${trackingPath}`} alt="Status page visitor badge" />
        </a>

        {/* Daily Details Modal */}
        {selectedDailyData && (
          <DailyDetails
            date={selectedDailyData.date}
            data={selectedDailyData.data}
            onClose={handleCloseDailyDetails}
          />
        )}
      </div>
    </>
  );
};