import { HeartIcon } from '@heroicons/react/24/solid';
import * as React from 'react';

export interface ISponsorButtonProps {
  isDark?: boolean;
}

export const SponsorButton: React.FunctionComponent<ISponsorButtonProps> = ({
  isDark,
}: React.PropsWithChildren<ISponsorButtonProps>) => {
  return (
    <a
      href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
      className={`inline-flex items-center gap-x-2 rounded-md bg-blue-300 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm ${isDark ? 'hover:bg-blue-100' : 'hover:bg-blue-500'}`}
      target='_blank'
      rel='noopener noreferrer'
    >
      <HeartIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
      Support the project
    </a>
  );
};