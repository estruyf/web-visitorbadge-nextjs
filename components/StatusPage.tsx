import * as React from 'react';
import useStatus from '../hooks/useStatus';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Title, Legend } from "chart.js";
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './Status';
import Head from 'next/head';
import { Loading } from './Loading';
import { DEFAULTS } from '../constants/Defaults';
import { Statistics } from './Statistics';
import { DailyChart, DailyDetails } from './charts/DailyChart';
import { CommonChart } from './charts/CommonChart';
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
      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 transition-colors duration-200"
      title="Export chart as PNG"
    >
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Export
    </button>
  );
};

// Data Freshness Indicator Component
const DataFreshnessIndicator: React.FC<{ loading: boolean }> = ({ loading }) => {
  const [lastUpdated, setLastUpdated] = React.useState<Date>(new Date());

  React.useEffect(() => {
    if (!loading) {
      setLastUpdated(new Date());
    }
  }, [loading]);

  const getTimeAgo = React.useCallback(() => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

    if (diff < 60) return 'Just now';
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
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
      <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
      {loading ? 'Updating...' : `Updated ${timeAgo}`}
    </div>
  );
};

// Skeleton Components for Loading States
const StatisticSkeleton: React.FC = () => (
  <div className="relative px-6 py-8 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
      <div className="h-10 bg-gray-200 rounded w-16 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 300 }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
      <div className={`bg-gray-200 rounded`} style={{ height: `${height}px` }}></div>
    </div>
  </div>
);

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Title, Legend);

export interface IStatusPageProps {
  url?: string;
  user?: string;
  repo?: string;
}

export const StatusPage: React.FunctionComponent<IStatusPageProps> = ({ url, user, repo }: React.PropsWithChildren<IStatusPageProps>) => {
  const { loading, total, today, daily, pages, isSponsor, days } = useStatus(url, user, repo);
  const { mostUsedBrowser, mostVisitedCountry, allBrowsers, allCountries } = useStatistics(daily);

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

  const showBrowserFullWidth = React.useMemo(() => {
    return !allCountries || allCountries.length === 0;
  }, [allCountries]);

  const showCountriesFullWidth = React.useMemo(() => {
    return !allBrowsers || allBrowsers.length === 0;
  }, [allBrowsers]);

  const commonStatsHeight = React.useMemo(() => {
    return Math.max(allBrowsers.length, allCountries.length) * 10;
  }, [allBrowsers, allCountries]);

  const pagesHeight = React.useMemo(() => {
    // More generous height calculation for better readability
    const baseHeight = 500;
    const perItemHeight = 25;
    return Math.max(baseHeight, sortedPages.length * perItemHeight);
  }, [sortedPages]);

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



      <div className={`bg-white flex flex-col h-screen`}>
        <Header labelColor={`#555555`} countColor={`#263759`} badgeStyle={`default`} />

        <div className="relative">
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
              alt="" />
            <div className="absolute inset-0 bg-blue-400 mix-blend-multiply" aria-hidden="true" />
          </div>

          <div className="relative max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 space-y-4">
            <h1 className="text-5xl font-extrabold text-white font-heading">
              Visitor Badge - Statistics
            </h1>
            <p className="text-xl leading-6 text-gray-200">
              Overview for {trackingPath}
            </p>

            {
              typeof isSponsor !== "undefined" && !isSponsor && (
                <SponsorButton isDark />
              )
            }
          </div>
        </div>

        <div className={`flex-grow`}>
          <section className={`bg-gradient-to-r from-gray-100 to-yellow-200 mb-12 border-t border-b border-gray-200 shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <DataFreshnessIndicator loading={loading} />
                </div>
                <h2 className="font-heading text-4xl leading-8 font-bold text-gray-900 mb-4">
                  Analytics Overview
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Comprehensive statistics for the last {days} days
                </p>
              </div>

              {loading ? (
                <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[...Array(7)].map((_, i) => (
                    <StatisticSkeleton key={i} />
                  ))}
                </dl>
              ) : (
                <Statistics
                  total={total}
                  today={today}
                  dailyStats={daily}
                  pagesStats={pages}
                  bestBrowser={mostUsedBrowser}
                  bestCountry={mostVisitedCountry}
                  days={days} />
              )}
            </div>
          </section>

          <section className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 space-y-8 py-16">
              <div className="text-center">
                <h2 className="font-heading text-4xl leading-8 font-bold text-gray-900 mb-4">
                  Interactive Charts
                </h2>
                <p className="text-lg text-gray-600">
                  Detailed analytics and trends for the last {days} days
                </p>
              </div>

              {loading ? (
                <ChartSkeleton height={320} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                  <div className="flex items-center justify-end mb-4">
                    <ExportButton chartId="daily-visitors-chart" filename="daily-visitors" />
                  </div>
                  <DailyChart
                    stats={daily}
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDailyData?.date}
                    chartId="daily-visitors-chart"
                  />
                </div>
              )}

              {loading ? (
                <div className={`grid grid-cols-12 gap-8`}>
                  <div className="col-span-12 sm:col-span-6">
                    <ChartSkeleton height={400} />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <ChartSkeleton height={400} />
                  </div>
                  <div className="col-span-12">
                    <ChartSkeleton height={600} />
                  </div>
                </div>
              ) : (
                <div className={`grid grid-cols-12 gap-8`}>
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12 sm:col-span-6">
                    <div className="flex items-center justify-end mb-4">
                      <ExportButton chartId="browsers-chart" filename="top-browsers" />
                    </div>
                    <CommonChart
                      title={`Top 10 Browsers`}
                      label={`Browsers`}
                      stats={allBrowsers}
                      height={commonStatsHeight}
                      fullWidth={showBrowserFullWidth}
                      chartId="browsers-chart" />
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12 sm:col-span-6">
                    <div className="flex items-center justify-end mb-4">
                      <ExportButton chartId="countries-chart" filename="top-countries" />
                    </div>
                    <CommonChart
                      title={`Top 12 Countries`}
                      label={`Countries`}
                      stats={allCountries}
                      height={commonStatsHeight}
                      fullWidth={showCountriesFullWidth}
                      chartId="countries-chart" />
                  </div>

                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12">
                    <div className="flex items-center justify-end mb-4">
                      <ExportButton chartId="pages-chart" filename="popular-pages" />
                    </div>
                    <CommonChart
                      title={`Most Popular Pages ${pages.length > 25 ? "(Top 25)" : ""}`}
                      label={`Pages/Slug`}
                      stats={(sortedPages || []).map(page => ({ title: page.url, value: page.count }))}
                      height={pagesHeight}
                      fullWidth
                      chartId="pages-chart" />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <Status
          username={trackingPath}
          isSponsor={isSponsor} />

        <Footer />

        <a className='hidden' href="https://visitorbadge.io/status?path=https%3A%2F%2Fwww.visitorbadge.io%2Fstatus" title="Status of status page" rel="nofollow" >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://api.visitorbadge.io/api/visitors?path=https%3A%2F%2Fwww.visitorbadge.io%2Fstatus&countColor=%23263759&slug=${trackingPath}`} alt="Status page visitor badge" />
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