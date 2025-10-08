import * as React from 'react';

export interface IStatisticProps {
  title: string;
  subTitle?: string;
  total: number;
}

export const Statistic: React.FunctionComponent<IStatisticProps> = ({ title, subTitle, total }: React.PropsWithChildren<IStatisticProps>) => {
  return (
    <div className="relative px-6 py-8 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide truncate">{title}</dt>
      <dd className="mt-3 text-4xl font-bold text-gray-900 tracking-tight">{total.toLocaleString()}</dd>
      {subTitle && (
        <dd className="mt-2 text-sm font-medium text-gray-500 break-words leading-relaxed">
          {subTitle}
        </dd>
      )}
    </div>
  );
};