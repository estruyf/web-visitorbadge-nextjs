import * as React from 'react';
import { API } from '../constants/API';
import { Issue } from './Issue';

export interface IStatusProps {}

export const Status: React.FunctionComponent<IStatusProps> = (props: React.PropsWithChildren<IStatusProps>) => {
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
          <h2 className="text-3xl mt-4 font-extrabold text-white font-heading">
            Want to keep track of your visitors?
          </h2>
          <p className="mt-6 max-w-4xl text-xl text-gray-200">
            With our status API, you can keep track of the total hits and 7 day overview of your visitors without affacting your hits. The API is available at: <br /> <code>{process.env.NEXT_PUBLIC_VISITOR_API}{API.status}{`?user=<username>&repo=<repo-name>`} - GET</code>
          </p>
        </div>
      </div>

      <Issue />
    </div>
  );
};