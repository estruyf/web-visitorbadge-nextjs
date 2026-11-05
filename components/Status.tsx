import * as React from 'react';
import { Issue } from './Issue';
import { Sponsor } from './Sponsor';

export interface IStatusProps {
  username?: string;
  isSponsor?: boolean;
}

export const Status: React.FunctionComponent<IStatusProps> = ({
  username,
  isSponsor
}: React.PropsWithChildren<IStatusProps>) => {
  return (
    <section className="bg-paper-dark border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 space-y-5">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink-900">
            Want to keep track of your visitors?
          </h2>

          <p className="max-w-2xl text-lg text-ink-500">
            You can keep track of your total hits and <b className="font-semibold text-ink-900">two day</b> visitor overview on our status page. By supporting the project, you can extend this to <b className="font-semibold text-ink-900">seven days</b>.
          </p>

          <div className="bg-white border border-line rounded-xl px-4 py-3 font-mono text-sm break-all">
            {
              username ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_SITE_URL}/status?path=${encodeURIComponent(username)}`}
                  className="text-amber-700 underline underline-offset-2 hover:text-ink-900"
                  title="Open status page in new tab"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {process.env.NEXT_PUBLIC_SITE_URL}/status?path={username}
                </a>
              ) : (
                <code className="text-ink-500">{process.env.NEXT_PUBLIC_SITE_URL}/status?path={`<URL>`}</code>
              )
            }
          </div>

          <Issue />
        </div>

        <div className="lg:col-span-5">
          <Sponsor isSponsor={isSponsor} />
        </div>
      </div>
    </section>
  );
};
