import Link from 'next/link';
import * as React from 'react';
import useStatus, { DailyResult } from '../hooks/useStatus';
import { Line } from "react-chartjs-2";
import { Statistic } from './Statistic';
import { Footer } from './Footer';
import { Issue } from './Issue';
import { Header } from './Header';
import Head from 'next/head';
import { Loading } from './Loading';
import { DEFAULTS } from '../constants/Defaults';

export interface IStatusPageProps {
  url?: string;
  user?: string;
  repo?: string;
}

export const StatusPage: React.FunctionComponent<IStatusPageProps> = ({ url, user, repo }: React.PropsWithChildren<IStatusPageProps>) => {
  const { loading, total, today, daily } = useStatus(url, user, repo);

  let bestDay: DailyResult | undefined;
  if (daily.length > 0) {
    const best = Math.max(...daily.map(d => d.total));
    if (best) {
      bestDay = daily.find(d => d.total === best);
    }
  }

  const getPath = () => {
    if (url) {
      return url;
    } else if (user && repo) {
      return `${user}/${repo}`;
    } else {
      return DEFAULTS.url;
    }
  }

  return (
    <>
      <Head>
        <title>Visitor overview for {user}/{repo}</title>
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
              
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                {total && <Statistic title={`Total hits`} total={total} />}

                {today && <Statistic title={`Today`} total={today} />}

                {(daily && daily.length > 0) && <Statistic title={`Hits the last 7 days`} total={daily.map(d => d.total).reduce((a, b) => (a + b))} />}

                {(bestDay && bestDay.total) && <Statistic title={`Best day: ${bestDay.title}`} total={bestDay.total} />}
              </dl>
            </div>
          </section>

          <section>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
              <h3 className="font-heading text-2xl leading-6 font-medium text-blue-500">Weekly chart</h3>

              {
                (daily && daily.length > 0) && (
                  <Line
                    height={100}
                    data={{
                      labels: daily.map(r => r.title),
                      datasets: [
                        {
                          label: 'Weekly overview',
                          
                          data: daily.map(r => r.total),
                          lineTension: 0.1,
                          fill: true,
                          borderColor: '#CC8312',
                          backgroundColor: "#FCF2E1",
                          pointRadius: 5,
                        }
                      ]
                    }}
                  />   
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