import * as React from 'react';
import Link from 'next/link';
import { API } from '../constants/API';

export interface IHeaderProps {}

export const Header: React.FunctionComponent<IHeaderProps> = (props: React.PropsWithChildren<IHeaderProps>) => {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-center items-center py-12">
          <div>
            <Link href="/">
              <a>
                <span className="sr-only">Visitor badge</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-8 w-auto sm:h-10"
                  src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.visitors}?user=estruyf&repo=github-visitors-badge&countColor=%2320385C&label=Create your visitor badge`}
                  alt="Create your visitor badge"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};