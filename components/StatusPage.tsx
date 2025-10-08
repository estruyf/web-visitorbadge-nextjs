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

      {loading && <Loading />}

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
          <section className={`bg-gradient-to-r from-gray-50 to-blue-50 mb-12 border-t border-b border-gray-200 shadow-sm`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
              <div className="text-center mb-8">
                <h2 className="font-heading text-4xl leading-8 font-bold text-gray-900 mb-4">
                  Analytics Overview
                </h2>
                <p className="text-lg text-gray-600">
                  Comprehensive statistics for the last {days} days
                </p>
              </div>

              <Statistics
                total={total}
                today={today}
                dailyStats={daily}
                pagesStats={pages}
                bestBrowser={mostUsedBrowser}
                bestCountry={mostVisitedCountry}
                days={days} />
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

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <DailyChart
                  stats={daily}
                  onDateSelect={handleDateSelect}
                  selectedDate={selectedDailyData?.date}
                />
              </div>

              <div className={`grid grid-cols-12 gap-8`}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12 sm:col-span-6">
                  <CommonChart
                    title={`Top 10 Browsers`}
                    label={`Browsers`}
                    stats={allBrowsers}
                    height={commonStatsHeight}
                    fullWidth={showBrowserFullWidth} />
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12 sm:col-span-6">
                  <CommonChart
                    title={`Top 12 Countries`}
                    label={`Countries`}
                    stats={allCountries}
                    height={commonStatsHeight}
                    fullWidth={showCountriesFullWidth} />
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 col-span-12">
                  <CommonChart
                    title={`Most Popular Pages ${pages.length > 25 ? "(Top 25)" : ""}`}
                    label={`Pages/Slug`}
                    stats={(sortedPages || []).map(page => ({ title: page.url, value: page.count }))}
                    height={pagesHeight}
                    fullWidth />
                </div>
              </div>
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