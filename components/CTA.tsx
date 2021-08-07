import * as React from 'react';
import { API } from '../constants/API';

export interface ICTAProps {}

export const CTA: React.FunctionComponent<ICTAProps> = (props: React.PropsWithChildren<ICTAProps>) => {
  const [ total, setTotal ] = React.useState<{totalBadges: number; totalHits: number} | null>(null);

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
          A simple visitor badge for your website
        </h1>
        {
          total?.totalBadges && total.totalBadges > 0 && (
            <h2 className="text-3xl mt-4 font-extrabold text-white font-heading">
              Come and join <span className="text-yellow-500">{total.totalBadges}</span> others using our service. 
            </h2>
          )
        }
        {
          total?.totalHits && total.totalHits > 0 && (
            <h2 className="text-3xl mt-4 font-extrabold text-white font-heading">With a total of <span className="text-yellow-500">{total.totalHits}</span> hits.</h2>
          )
        }
        <p className="mt-4 text-xl leading-6 text-gray-200">
          Want to show how many visitors your site/GitHub profiles gets? Quickly fill in the form on the page, and copy the Markdown or HTML code to the location you want to use it.
        </p>

        <p className="mt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={`mx-auto h-8 sm:h-10`} src={`${process.env.NEXT_PUBLIC_VISITOR_API}${API.daily}?user=estruyf&repo=github-visitors-badge&labelColor=%23555555&countColor=%23F0B354&label=Visitors today&style=default`} alt={`Daily visitors`} />
        </p>
      </div>
    </div>
  );
};