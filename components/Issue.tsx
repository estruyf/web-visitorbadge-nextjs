import * as React from 'react';

export interface IIssueProps {
  disableTop?: boolean;
}

export const Issue: React.FunctionComponent<IIssueProps> = ({ disableTop }: React.PropsWithChildren<IIssueProps>) => {
  return (
    <div className={`${!disableTop ? "-mt-32" : ""} bg-white max-w-3xl mx-auto text-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-10 relative rounded-2xl space-y-4`}>
      <h2 className="text-gray-900 text-lg md:text-3xl xl:text-4xl tracking-tight font-extrabold">
        Encountered an issue?
      </h2>

      <p className="text-base text-gray-500">
        Please let me know via opening a issue on GitHub.
      </p>

      <a
        href="https://github.com/estruyf/web-visitorbadge-nextjs/issues"
        className="inline-flex items-center gap-x-2 rounded-md bg-blue-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        Open an issue
      </a>
    </div>
  );
};