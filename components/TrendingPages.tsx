import * as React from 'react';

export interface ITrendingPagesProps {
  pages: {
    url: string;
    recent: number;
    earlier: number;
  }[];
  window: number;
  className?: string;
}

export const TrendingPages: React.FunctionComponent<ITrendingPagesProps> = ({ pages, window, className }: React.PropsWithChildren<ITrendingPagesProps>) => {
  return (
    <section className={`min-w-0 bg-white border border-line rounded-2xl p-5 sm:p-6 ${className || ''}`}>
      <h3 className="font-heading text-xl font-bold text-ink-900">Trending pages</h3>
      <p className="mt-0.5 mb-5 text-sm text-ink-500">
        {window === 1 ? 'Yesterday compared to the day before' : `The last ${window} days compared to the ${window} days before`}
      </p>

      <ol className="divide-y divide-line">
        {pages.map((page) => (
          <li key={page.url} className="flex items-baseline justify-between gap-x-4 py-2.5 text-sm">
            <span className="min-w-0 text-ink-900" style={{ overflowWrap: 'anywhere' }}>{page.url}</span>
            <span className="flex-shrink-0 font-mono whitespace-nowrap">
              <span className="font-medium text-ink-900">{page.recent.toLocaleString()}</span>
              <span className="ml-2 font-semibold text-up">
                {page.earlier > 0 ? `↑ +${(page.recent - page.earlier).toLocaleString()}` : '↑ New'}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
};
