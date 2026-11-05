import * as React from 'react';
import { SponsorButton } from './SponsorButton';

export interface ISponsorProps {
  isSponsor?: boolean;
}

export const Sponsor: React.FunctionComponent<ISponsorProps> = ({
  isSponsor
}: React.PropsWithChildren<ISponsorProps>) => {
  return (
    <div className="bg-white border border-line rounded-2xl p-6 sm:p-8 space-y-4">
      <h2 className="font-heading text-2xl font-bold text-ink-900">
        {isSponsor ? 'Thanks for sponsoring!' : 'Support the project'}
      </h2>

      {
        isSponsor ? (
          <p className="text-base text-ink-500">
            Your support helps me to keep this project alive.
          </p>
        ) : (
          <>
            <p className="text-base text-ink-500">
              If you like the project and want to extend the visitor tracking to <b className="font-semibold text-ink-900">seven days</b>, you can support the project.
            </p>
            <p className="text-base text-ink-500">
              Each € 1.50 in sponsorship is equal to 1 URL to view 7 day analytics. If you want to track multiple URLs, you can increase the quantity and specify additional URLs.
            </p>

            <SponsorButton />
          </>
        )
      }
    </div>
  );
};
