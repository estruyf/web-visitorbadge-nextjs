import * as React from 'react';
import Link from 'next/link';
import { API } from '../constants/API';

export interface IHeaderProps {
  labelColor: string;
  countColor: string;
  badgeStyle: string;
}

export const Header: React.FunctionComponent<IHeaderProps> = ({ labelColor, badgeStyle, countColor }: React.PropsWithChildren<IHeaderProps>) => {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center gap-x-6 py-6">
          <Link href="/" title='Create your visitor badge' className="min-w-0">
            <span className="sr-only">Visitor badge</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="h-7 w-auto max-w-full sm:h-8"
              src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.visitors}?user=estruyf&repo=github-visitors-badge&labelColor=%23${labelColor.replace('#', '')}&countColor=%23${countColor.replace('#', '')}&label=Create your visitor badge&style=${badgeStyle}`}
              alt="Create your visitor badge"
            />
          </Link>

          <nav className="hidden sm:flex items-center gap-x-6 text-sm font-medium text-ink-200" aria-label="Main">
            <a href="https://github.com/estruyf/web-visitorbadge-nextjs" className="hover:text-amber-400 transition-colors">GitHub</a>
            <a href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK} className="hover:text-amber-400 transition-colors">Support</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
