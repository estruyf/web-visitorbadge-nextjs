import * as React from 'react';
import Link from 'next/link';

export interface IHeaderProps {}

export const Header: React.FunctionComponent<IHeaderProps> = (props: React.PropsWithChildren<IHeaderProps>) => {
  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-6 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/">
              <a>
                <span className="sr-only">Visitor badge</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="https://estruyf-github.azurewebsites.net/api/VisitorHit?user=estruyf&repo=github-visitors-badge&countColor=%2320385C&label=Create your visitor badge"
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