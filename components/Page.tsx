import * as React from 'react';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { Header } from './Header';
import { Status } from './Status';

export interface IPageProps {
  labelColor: string;
  countColor: string;
  badgeStyle: string;
  username: string;
}

export const Page: React.FunctionComponent<React.PropsWithChildren<IPageProps>> = ({ labelColor, countColor, badgeStyle, username, children }: React.PropsWithChildren<IPageProps>) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-ink-900 text-white">
        <Header labelColor={labelColor} countColor={countColor} badgeStyle={badgeStyle} />

        <CTA />
      </div>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          {children}
        </div>

        <Status username={username} />
      </main>

      <Footer />
    </div>
  );
};
