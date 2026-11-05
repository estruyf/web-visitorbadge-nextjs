import * as React from 'react';

export const chartTooltip = {
  backgroundColor: '#0C1626',
  titleColor: '#FFFFFF',
  bodyColor: '#D0D7E0',
  padding: 10,
  cornerRadius: 8,
  displayColors: false,
};

export const chartGridColor = '#EFEBE2';

// Validated as a pair for color vision deficiencies and against the white card
export const chartColors = {
  primary: '#B9770F',
  primaryHover: '#9D650E',
  secondary: '#3B66A7',
};

export const formatShare = (value: number, total: number) => {
  if (!total) {
    return '0%';
  }

  const share = (value / total) * 100;
  return share > 0 && share < 1 ? '<1%' : `${Math.round(share)}%`;
};

export interface IChartCardProps {
  title: string;
  hint?: string;
  actions?: React.ReactNode;
  isEmpty?: boolean;
  className?: string;
}

export const ChartCard: React.FunctionComponent<React.PropsWithChildren<IChartCardProps>> = ({
  title,
  hint,
  actions,
  isEmpty,
  className,
  children
}: React.PropsWithChildren<IChartCardProps>) => {
  return (
    <section className={`min-w-0 bg-white border border-line rounded-2xl p-5 sm:p-6 ${className || ''}`}>
      <div className="flex items-start justify-between gap-x-4 mb-5">
        <div className="min-w-0">
          <h3 className="font-heading text-xl font-bold text-ink-900">
            {title}
          </h3>
          {hint && <p className="mt-0.5 text-sm text-ink-500">{hint}</p>}
        </div>
        {!isEmpty && actions}
      </div>

      {
        isEmpty ? (
          <div className="flex items-center justify-center h-60 bg-paper rounded-xl border border-dashed border-line text-center px-4">
            <div>
              <p className="text-sm font-semibold text-ink-900">No data available</p>
              <p className="mt-1 text-sm text-ink-500">Data will appear here once available.</p>
            </div>
          </div>
        ) : children
      }
    </section>
  );
};
