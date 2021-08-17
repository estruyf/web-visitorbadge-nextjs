import * as React from 'react';
import useStatus from '../hooks/useStatus';
import { Bar, Line, Pie } from "react-chartjs-2";
import { Footer } from './Footer';
import { Issue } from './Issue';
import { Header } from './Header';
import Head from 'next/head';
import { Loading } from './Loading';
import { DEFAULTS } from '../constants/Defaults';
import { Statistics } from './Statistics';

export interface IStatusPageProps {
  url?: string;
  user?: string;
  repo?: string;
}

export const StatusPage: React.FunctionComponent<IStatusPageProps> = ({ url, user, repo }: React.PropsWithChildren<IStatusPageProps>) => {
  const { loading, total, today, daily } = useStatus(url, user, repo);

  let bestCountry: string | undefined;
  let mostUsedBrowser: string | undefined;
  
  let allCountries = {} as { [country: string]: number };
  let allBrowsers = {} as { [country: string]: number };

  if (daily.length > 0) {    
    for (const day of daily) {
      for (const country in day.countries) {
        if (allCountries[country]) {
          allCountries[country] += day.countries[country];
        } else {
          allCountries[country] = day.countries[country];
        }
      }

      for (const browser in day.browsers) {
        if (allBrowsers[browser]) {
          allBrowsers[browser] += day.browsers[browser];
        } else {
          allBrowsers[browser] = day.browsers[browser];
        }
      }
    }

    bestCountry = Object.keys(allCountries).reduce((a, b) => allCountries[a] > allCountries[b] ? a : b);
    mostUsedBrowser = Object.keys(allBrowsers).reduce((a, b) => allBrowsers[a] > allBrowsers[b] ? a : b);
  }

  console.log(allBrowsers)

  const getPath = () => {
    if (url) {
      return url;
    } else if (user && repo) {
      return `${user}/${repo}`;
    } else {
      return DEFAULTS.url;
    }
  }

  const bestBrowser = mostUsedBrowser ? { title: mostUsedBrowser, value: allBrowsers[mostUsedBrowser] } : null;
  const bestCountryData = bestCountry ? { title: bestCountry, value: allCountries[bestCountry] } : null;
  const sortedBrowsers = Object.keys(allBrowsers).sort((a, b) => allBrowsers[b] - allBrowsers[a]).map(browser => ({ title: browser, value: allBrowsers[browser] }));
  const sortedCountries = Object.keys(allCountries).sort((a, b) => allCountries[b] - allCountries[a]).map(country => ({ title: country === "-" ? "Unknown" : country, value: allCountries[country] }));

  return (
    <>
      <Head>
        <title>Visitor overview for {getPath()}</title>
        <meta name="description" content={`Visitor overview for ${getPath()}`} />
        <meta property="og:description" content={`Visitor overview for ${getPath()}`} />
        <meta property="twitter:description" content={`Visitor overview for ${getPath()}`} />

        <link rel="preconnect" href={process.env.NEXT_PUBLIC_VISITOR_API} />
        
        <meta property="og:type" content="website" />
        <meta property="twitter:card" content="summary_large_image" />

        <meta property="twitter:image" content={`https://visitorbadge.io/preview.png`} />
        <meta property="og:image" content={`https://visitorbadge.io/preview.png`} />

        <meta property="twitter:url" content="https://www.visitorbadge.io/status" />
        <meta property="og:url" content="https://www.visitorbadge.io/status" />
      </Head>
      
      { loading && <Loading /> }
      
      <div className={`bg-white flex flex-col h-screen`}>
        <Header labelColor={`#555555`} countColor={`#263759`} badgeStyle={`default`} />
        
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center items-center pb-12">
              <h2 className={`text-3xl font-extrabold text-blue-500 font-heading`}>
                Visitor overview for {getPath()}
              </h2>
            </div>
          </div>
        </header>

        <div className={`flex-grow`}>
          <section className={`bg-gray-50 mb-12 border-t border-b border-gray-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
              <h3 className="font-heading text-2xl leading-6 font-medium text-blue-500">Weekly stats</h3>

              <Statistics total={total} 
                          today={today} 
                          dailyStats={daily}
                          bestBrowser={bestBrowser}
                          bestCountry={bestCountryData} />
            </div>
          </section>

          <section>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
              <h3 className="font-heading text-2xl leading-6 font-medium text-blue-500">Weekly charts</h3>

              {
                (daily && daily.length > 0) && (
                  <Line
                    height={100}
                    data={{
                      labels: daily.map(r => r.title),
                      datasets: [
                        {
                          label: 'Daily visitors',
                          
                          data: daily.map(r => r.total),
                          lineTension: 0.1,
                          fill: true,
                          borderWidth: 1,
                          borderColor: '#CC8312',
                          backgroundColor: "#FCF2E1",
                          pointRadius: 5,
                        }
                      ]
                    }}
                  />   
                )
              }

              {
                (sortedBrowsers && sortedBrowsers.length > 0) && (
                  <div className={`mt-12`}>
                    <Bar
                      height={100}
                      data={{
                        labels: sortedBrowsers.map(r => r.title),
                        datasets: [
                          {
                            label: 'Browsers',
                            data: sortedBrowsers.map(r => r.value),
                            borderWidth: 1,
                            borderColor: '#CC8312',
                            backgroundColor: "#FCF2E1"
                          }
                        ]
                      }}
                    /> 
                  </div>  
                )
              }
              
              {
                (sortedCountries && sortedCountries.length > 0) && (
                  <div className={`mt-14`}>
                    <Bar
                      height={100}
                      data={{
                        labels: sortedCountries.map(r => r.title),
                        datasets: [
                          {
                            label: 'Countries',
                            data: sortedCountries.map(r => r.value),
                            borderWidth: 1,
                            borderColor: '#CC8312',
                            backgroundColor: "#FCF2E1"
                          }
                        ]
                      }}
                    />   
                  </div>
                )
              }
            </div>
          </section>
        </div>

        <Issue disableTop />

        <Footer />  
      </div>
    </>
  );
};