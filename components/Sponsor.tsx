import * as React from 'react';
import { SponsorButton } from './SponsorButton';

export interface ISponsorProps {
  isSponsor?: boolean;
}

export const Sponsor: React.FunctionComponent<ISponsorProps> = ({
  isSponsor
}: React.PropsWithChildren<ISponsorProps>) => {
  return (
    <div className={`-mb-32 bg-white max-w-3xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-10 relative rounded-2xl space-y-4`}>
      <h2 className="text-gray-900 text-lg md:text-3xl xl:text-4xl tracking-tight font-extrabold">
        {isSponsor ? 'Thanks for sponsoring!' : 'Support the project'}
      </h2>

      {
        isSponsor ? (
          <p className="text-base text-gray-500">
            Your support helps me to keep this project alive.
          </p>
        ) : (
          <>
            <p className="text-base text-gray-500">
              If you like the project and want to extend the visitor tracking to <b>seven days</b>, you can support the project.
            </p>
            <p className="text-base text-gray-500">
              Each € 1.50 in sponsorship is equal to 1 URL to view 7 day analytics. If you want to track multiple URLs, you can increase the quantity and specify additional URLs.
            </p>

            <SponsorButton />
          </>
        )
      }
    </div>
  );
};