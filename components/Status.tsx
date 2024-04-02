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
    <div className="bg-white mt-12">
      <Sponsor isSponsor={isSponsor} />

      <div className="relative py-32 bg-gray-800">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
            alt=""
          />
          <div className="absolute inset-0 bg-blue-300 mix-blend-multiply" aria-hidden="true" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <h2 className="text-3xl font-extrabold text-white font-heading">
            Want to keep track of your visitors?
          </h2>

          <p className="mt-2 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
            You can keep track of your total hits and two day (or more if you become a sponsor) visitor overview on our status page:
          </p>

          <p className="mt-4 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
            <code >{process.env.NEXT_PUBLIC_SITE_URL}/status?path={`${username || "<URL>"}`}</code>
          </p>
        </div>
      </div>

      <Issue />
    </div>
  );
};