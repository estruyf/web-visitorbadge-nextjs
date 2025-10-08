import React, { useState, useEffect } from 'react';
import { CommonStatistic, DailyResult } from '../models';

export default function useStatistics(daily: DailyResult[]) {
  const [mostUsedBrowser, setMostUsedBrowser] = useState<CommonStatistic | undefined>(undefined);
  const [allBrowsers, setAllBrowsers] = useState<CommonStatistic[]>([]);

  const [mostVisitedCountry, setMostVisitedCountry] = useState<CommonStatistic | undefined>(undefined);
  const [allCountries, setAllCountries] = useState<CommonStatistic[]>([]);



  useEffect(() => {
    if (!daily || daily.length === 0) {
      setMostUsedBrowser(undefined);
      setAllBrowsers([]);

      setMostVisitedCountry(undefined);
      setAllCountries([]);
      return;
    }

    const crntBrowsers = {} as { [browser: string]: number };
    const crntCountries = {} as { [country: string]: number };

    for (const day of daily) {
      for (const country in day.countries) {
        if (crntCountries[country]) {
          crntCountries[country] += day.countries[country];
        } else {
          crntCountries[country] = day.countries[country];
        }
      }

      for (const browser in day.browsers) {
        if (crntBrowsers[browser]) {
          crntBrowsers[browser] += day.browsers[browser];
        } else {
          crntBrowsers[browser] = day.browsers[browser];
        }
      }
    }

    const sortedBrowsers = Object.keys(crntBrowsers)
      .sort((a, b) => crntBrowsers[b] - crntBrowsers[a])
      .map(browser => ({ title: browser, value: crntBrowsers[browser] }))
      .slice(0, 10); // Limit to top 10 browsers

    setAllBrowsers(sortedBrowsers);

    const sortedCountries = Object.keys(crntCountries)
      .sort((a, b) => crntCountries[b] - crntCountries[a])
      .map(country => ({ title: country === "-" ? "Unknown" : country, value: crntCountries[country] }))
      .slice(0, 12); // Limit to top 12 countries for better readability

    setAllCountries(sortedCountries);

    // Find the country with the most visits
    if (Object.keys(crntCountries).length > 0) {
      const country = Object.keys(crntCountries).reduce((a, b) => crntCountries[a] > crntCountries[b] ? a : b);
      if (country) {
        setMostVisitedCountry({ title: country, value: crntCountries[country] });
      }
    }

    // Find the browser with the most visits
    if (Object.keys(crntBrowsers).length > 0) {
      const browser = Object.keys(crntBrowsers).reduce((a, b) => crntBrowsers[a] > crntBrowsers[b] ? a : b);
      if (browser) {
        setMostUsedBrowser({ title: browser, value: crntBrowsers[browser] });
      }
    }
  }, [daily]);

  return {
    mostUsedBrowser,
    mostVisitedCountry,
    allBrowsers,
    allCountries
  };
}