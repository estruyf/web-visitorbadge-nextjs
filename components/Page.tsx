import * as React from 'react';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { Header } from './Header';

export interface IPageProps {}

export const Page: React.FunctionComponent<IPageProps> = ({ children }: React.PropsWithChildren<IPageProps>) => {
  return (
    <div className="bg-white">
      <Header />

      <CTA />

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};