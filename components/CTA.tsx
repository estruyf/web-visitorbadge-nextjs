import * as React from 'react';
import { API } from '../constants/API';

export interface ICTAProps { }

export const CTA: React.FunctionComponent<ICTAProps> = (props: React.PropsWithChildren<ICTAProps>) => {
  const [total, setTotal] = React.useState<{ totalBadges: number; totalHits: number, diffBadges: number, diffHits: number } | null>(null);

  const subTitle = React.useMemo(() => {
    const totalBadges = total?.totalBadges || 0;
    const totalHits = total?.totalHits || 0;
    const newBadges = total?.diffBadges || 0;

    if (totalBadges > 0 && newBadges > 0) {
      return (
        <h2 className="text-2xl mt-4 font-extrabold text-white font-heading leading-8">
          With a total of <span className="text-yellow-500">{totalBadges.toLocaleString()}</span> badges created and <span className="text-yellow-500">{totalHits.toLocaleString()}</span> hits tracked. 🚀
          {
            newBadges > 0 && (
              <>
                <br />
                <span className="text-yellow-500">{newBadges.toLocaleString()}</span> new badges were created in the last 24 hours.
              </>
            )
          }
        </h2>
      );
    }

    return null;
  }, [total]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, ['']);

  return (
    <div className="relative">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1597733336794-12d05021d510?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100"
          alt="" />
        <div className="absolute inset-0 bg-blue-400 mix-blend-multiply" aria-hidden="true" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-extrabold text-white font-heading">
          Visitor counters for your website or GitHub profile
        </h1>

        {subTitle}

        <p className="mt-4 text-xl leading-6 text-gray-200">
          Looking to display visitor statistics for your website or GitHub profiles? Easily generate visitor counters and badges by completing the form below. Simply copy the Markdown or HTML code provided and place it wherever you&apos;d like on your page.
        </p>

        <p className="mt-8 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`h-8 sm:h-10`} src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.daily}?user=estruyf&repo=github-visitors-badge&labelColor=%23555555&countColor=%23F0B354&label=Visitors today&style=default`} alt={`Daily visitors`} />

          <a
            href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK}
            title={`Support the project`}>
            <img className={`h-8 sm:h-10`} src={`https://img.shields.io/badge/support_the_project-555555?style=for-the-badge&logo=githubsponsors&logoColor=%23FFFFFF&labelColor=%23EA4AAA`} alt={`Support this project`} />
          </a>
        </p>
      </div>
    </div>
  );
};