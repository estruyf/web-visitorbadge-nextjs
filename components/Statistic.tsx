import * as React from 'react';
import { Counter } from './Counter';

export interface IStatisticProps {
  title: string;
  subTitle?: string;
  total: number;
  growth?: number;
  growthLabel?: string;
  trend?: 'up' | 'down' | 'stable';
  featured?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export const Statistic: React.FunctionComponent<IStatisticProps> = ({ title, subTitle, total, growth, growthLabel, trend, featured, action, className }: React.PropsWithChildren<IStatisticProps>) => {
  const getTrendIcon = () => {
    if (!trend || !growth) return null;

    if (trend === 'up') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Up">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 17V7H7" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Down">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7L7 17M7 7v10h10" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Stable">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
        </svg>
      );
    }
  };

  const getGrowthColor = () => {
    if (featured) return 'text-amber-300';
    if (!growth) return 'text-ink-500';
    if (growth > 0) return 'text-up';
    if (growth < 0) return 'text-down';
    return 'text-ink-500';
  };

  const growthElm = !!growth && (
    <span className={`flex items-center gap-x-1 text-sm font-semibold ${getGrowthColor()}`}>
      {getTrendIcon()}
      {Math.abs(growth).toFixed(1)}%
      {growthLabel && <span className={`font-normal ${featured ? 'text-ink-200' : 'text-ink-500'}`}>{growthLabel}</span>}
    </span>
  );

  if (featured) {
    return (
      <div className={`min-w-0 flex flex-col justify-between gap-y-6 p-6 bg-ink-900 rounded-2xl ${className || ''}`}>
        <dt className="text-base font-medium text-ink-200">{title}</dt>
        <dd>
          <Counter value={total} className="text-2xl sm:text-4xl lg:text-5xl" />
          {growthElm && <div className="mt-3">{growthElm}</div>}
        </dd>
      </div>
    );
  }

  return (
    <div className={`min-w-0 px-5 py-5 bg-white rounded-2xl border border-line ${className || ''}`}>
      <dt className="text-sm font-medium text-ink-500">{title}</dt>
      <dd className="mt-2 font-mono text-3xl font-bold tracking-tight text-ink-900">{total.toLocaleString()}</dd>
      {growthElm && <dd className="mt-1">{growthElm}</dd>}
      {subTitle && (
        <dd className="mt-1 text-sm text-ink-500" style={{ overflowWrap: 'anywhere' }}>
          {subTitle}
        </dd>
      )}
      {action && <dd className="mt-2">{action}</dd>}
    </div>
  );
};
