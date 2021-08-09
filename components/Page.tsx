import * as React from 'react';
import { CTA } from './CTA';
import { Footer } from './Footer';
import { Header } from './Header';
import { Issue } from './Issue';
import { Status } from './Status';

export interface IPageProps {
  labelColor: string;
  countColor: string;
  badgeStyle: string;
  username: string;
  repository: string;
}

export const Page: React.FunctionComponent<IPageProps> = ({ labelColor, countColor, badgeStyle, username, repository, children }: React.PropsWithChildren<IPageProps>) => {
  return (
    <div className="bg-white flex flex-col h-screen">
      <Header labelColor={labelColor} countColor={countColor} badgeStyle={badgeStyle} />

      <CTA />

      <main className={`mt-12 flex-grow`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {children}
        </div>

        <Status username={username} repository={repository} />
      </main>

      <Footer />
    </div>
  );
};