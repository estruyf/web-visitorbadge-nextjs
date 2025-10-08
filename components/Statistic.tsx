import * as React from 'react';

export interface IStatisticProps {
  title: string;
  subTitle?: string;
  total: number;
  growth?: number;
  trend?: 'up' | 'down' | 'stable';
}

export const Statistic: React.FunctionComponent<IStatisticProps> = ({ title, subTitle, total, growth, trend }: React.PropsWithChildren<IStatisticProps>) => {
  const getTrendIcon = () => {
    if (!trend || !growth) return null;

    if (trend === 'up') {
      return (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      );
    }
  };

  const getGrowthColor = () => {
    if (!growth) return 'text-gray-500';
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="relative px-6 py-8 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      <dt className="text-sm font-semibold text-gray-600 uppercase tracking-wide truncate">{title}</dt>
      <dd className="mt-3 flex items-center">
        <span className="text-4xl font-bold text-gray-900 tracking-tight">{total.toLocaleString()}</span>
        {growth !== undefined && (
          <div className="ml-3 flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getGrowthColor()}`}>
              {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
        )}
      </dd>
      {subTitle && (
        <dd className="mt-2 text-sm font-medium text-gray-500 break-words leading-relaxed">
          {subTitle}
        </dd>
      )}
    </div>
  );
};