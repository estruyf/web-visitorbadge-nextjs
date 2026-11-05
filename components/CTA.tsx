import * as React from 'react';
import { API } from '../constants/API';
import { Counter } from './Counter';
import { SponsorButton } from './SponsorButton';

export interface ICTAProps { }

export const CTA: React.FunctionComponent<ICTAProps> = (props: React.PropsWithChildren<ICTAProps>) => {
  const [total, setTotal] = React.useState<{ totalBadges: number; totalHits: number, yesterdayBadges: number, yesterdayHits: number, } | null>(null);

  const totalBadges = total?.totalBadges || 0;
  const totalHits = total?.totalHits || 0;
  const yesterdayBadges = total?.yesterdayBadges || 0;
  const yesterdayHits = total?.yesterdayHits || 0;

  React.useEffect(() => {
    const getTotal = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_VISITOR_API}${API.total}`);
        const json = await response.json();
        setTotal(json);
      } catch (e) {
        setTotal(null);
      }
    }

    getTotal();
  }, []);

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-12 lg:pt-10 lg:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:items-end">
        <div className="lg:col-span-7">
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl" style={{ lineHeight: 1.05 }}>
            Visitor counters for your website or GitHub profile
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-ink-200">
            Generate a visitor counter or badge with the form below. Copy the Markdown or HTML code provided and place it wherever you&apos;d like on your page.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <SponsorButton />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="h-7 sm:h-8 max-w-full" src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.daily}?user=estruyf&repo=github-visitors-badge&labelColor=%23555555&countColor=%23F0B354&label=Visitors today&style=default`} alt="Daily visitors" />
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[10rem]">
          {
            totalBadges > 0 && totalHits > 0 && (
              <div className="space-y-5">
                <div>
                  <Counter value={totalHits} className="text-2xl sm:text-4xl" />
                  <p className="mt-2 text-sm font-medium text-ink-200">hits tracked</p>
                </div>

                <div>
                  <Counter value={totalBadges} className="text-xl sm:text-3xl" />
                  <p className="mt-2 text-sm font-medium text-ink-200">badges created</p>
                </div>

                {
                  yesterdayHits > 0 && yesterdayBadges > 0 && (
                    <p className="text-sm text-ink-300">
                      Yesterday, we generated <b className="font-semibold text-amber-400">{yesterdayHits.toLocaleString()}</b> badges of which <b className="font-semibold text-amber-400">{yesterdayBadges.toLocaleString()}</b> were new.
                    </p>
                  )
                }
              </div>
            )
          }
        </div>
      </div>

      <div className="ruler" aria-hidden="true" />
    </div>
  );
};
