import * as React from 'react';

export interface IIssueProps { }

export const Issue: React.FunctionComponent<IIssueProps> = (props: React.PropsWithChildren<IIssueProps>) => {
  return (
    <p className="text-base text-ink-500">
      <span className="font-semibold text-ink-900">Encountered an issue?</span> Please let me know by{' '}
      <a
        href="https://github.com/estruyf/web-visitorbadge-nextjs/issues"
        className="font-medium text-ink-900 underline underline-offset-2 hover:text-ink-600"
      >
        opening an issue on GitHub
      </a>.
    </p>
  );
};
