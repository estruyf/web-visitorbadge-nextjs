import * as React from 'react';

export interface ICTAProps {}

export const CTA: React.FunctionComponent<ICTAProps> = (props: React.PropsWithChildren<ICTAProps>) => {
  return (
    <div className="bg-blue-400">
      <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-white">
          A simple visitor badge for your website
        </h1>
        <h1 className="text-2xl mt-4 font-extrabold text-white">
          Come and join XXX others that are using this service
        </h1>
        <p className="mt-4 text-xl leading-6 text-gray-200">
          Want to show how many visitors your site/GitHub profiles gets? Quickly fill in the form on the page, and copy the Markdown or HTML code to the location you want to use it.
        </p>
      </div>
    </div>
  );
};