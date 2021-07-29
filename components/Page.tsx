import * as React from 'react';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { Header } from './Header';

export interface IPageProps {
  labelColor: string;
  countColor: string;
}

export const Page: React.FunctionComponent<IPageProps> = ({ labelColor, countColor, children }: React.PropsWithChildren<IPageProps>) => {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Header labelColor={labelColor} countColor={countColor} />

      <CTA />

      <main className={`mt-12 max-w-7xl px-4 sm:px-6 flex-grow`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};