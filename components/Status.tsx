import * as React from 'react';
import { API } from '../constants/API';
import { Issue } from './Issue';

export interface IStatusProps {
  username?: string;
  isSponsor?: boolean;
  hideTrackingInfo?: boolean;
}

export const Status: React.FunctionComponent<IStatusProps> = ({
  username,
  isSponsor,
  hideTrackingInfo
}: React.PropsWithChildren<IStatusProps>) => {
  return (
    <div className="bg-white mt-12">
      <div className="relative pb-32 bg-gray-800">
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
          {
            !hideTrackingInfo && (
              <>
                <h2 className="text-3xl font-extrabold text-white font-heading">
                  Want to keep track of your visitors?
                </h2>

                <p className="mt-2 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
                  You can keep track of your total hits and two day visitor overview on our status page:
                </p>

                <p className="mt-4 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
                  <code >{process.env.NEXT_PUBLIC_SITE_URL}/status?path={`${username || "<URL or Username/Repository>"}`}</code>
                </p>
              </>
            )
          }

          {
            isSponsor ? (
              <>
                <h2 className={`text-3xl font-extrabold text-white font-heading ${hideTrackingInfo ? '' : 'mt-8'}`}>
                  Thanks for sponsoring!
                </h2>

                <p className="mt-2 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
                  You are now able to track your visitors for 7 days.
                </p>
              </>
            ) : (
              <>
                <h2 className={`text-3xl font-extrabold text-white font-heading ${hideTrackingInfo ? '' : 'mt-8'}`}>Become a sponsor</h2>

                <p className="mt-2 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
                  Become a monthly sponsor, and extend the visitor tracking to 7 days. You can sponsor the project by visiting the following link: <a className="underline underline-offset-2 text-yellow-500 hover:text-yellow-700" href="https://github.com/sponsors/estruyf" title='Become a sponsor' target='_blank' rel='noopener noreferrer'>become a sponsor</a>.
                </p>

                <p className="mt-6 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
                  Once you became a monthly sponsor, you can send an email at <a className="underline underline-offset-2 text-yellow-500 hover:text-yellow-700" href="mailto:visitorbadgesponsor@gmail.com?subject=Visitorbage%20sponsor&body=GitHub%20Username:<your-username>%0D%0AURL:<your-url>" title="Mail to the visitor badge service" target='_blank' rel='noopener noreferrer'>visitorbadgesponsor@gmail.com</a> with your GitHub username and URL.
                </p>

                <p className="mt-6 max-w-4xl text-xl text-gray-200 break-words leading-relaxed italic">
                  <b>Note 1</b>: Each $ 1 in sponsorship is equal to 1 URL to track for 7 days. If you want to track multiple URLs, you can increase the sponsorship amount.
                </p>

                <p className="mt-6 max-w-4xl text-xl text-gray-200 break-words leading-relaxed italic">
                  <b>Note 2</b>: it is a manual process, so it can take a couple of hours before the changes are applied.
                </p>

                {/* <p className="mt-6 max-w-4xl text-xl text-gray-200 break-words leading-relaxed">
              You can also make use of our API to receive the information if you want to integrate it in your system. The API is available at: <br /> <code>{process.env.NEXT_PUBLIC_VISITOR_API}{API.status}{`?path=${username || "<URL or Username/Repository>"}`} - GET</code>
            </p> */}
              </>
            )
          }
        </div>
      </div>

      <Issue />
    </div>
  );
};