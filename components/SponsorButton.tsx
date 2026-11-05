import { HeartIcon } from '@heroicons/react/24/solid';
import * as React from 'react';

export interface ISponsorButtonProps { }

export const SponsorButton: React.FunctionComponent<ISponsorButtonProps> = (props: React.PropsWithChildren<ISponsorButtonProps>) => {
  return (
    <a
      href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
      className="inline-flex items-center gap-x-2 rounded-lg bg-amber-400 px-3.5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-amber-300 transition-colors"
      target='_blank'
      rel='noopener noreferrer'
    >
      <HeartIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Support the project
    </a>
  );
};
