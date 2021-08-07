import * as React from 'react';

export interface IIssueProps {}

export const Issue: React.FunctionComponent<IIssueProps> = (props: React.PropsWithChildren<IIssueProps>) => {
  return (
    <div className="-mt-32 bg-white max-w-3xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-10 relative rounded-2xl">
      <h2 className=" font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="block text-3xl">Encountered an issue?</span>
        <span className="block text-2xl">Please let me know via opening a issue on GitHub</span>
      </h2>
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-md shadow">
          <a
            href="https://github.com/estruyf/web-visitorbadge-nextjs/issues"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500"
          >
            Open an issue
          </a>
        </div>
      </div>
    </div>
  );
};