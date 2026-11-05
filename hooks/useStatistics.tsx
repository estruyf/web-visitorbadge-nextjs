import React, { useState, useEffect, useMemo } from 'react';
import { DEFAULTS } from '../constants/Defaults';
import { CommonStatistic, DailyResult, PageResult } from '../models';

const MIN_TRENDING_HITS = 2;
const MAX_TRENDING_PAGES = 5;
const MAX_SOURCES = 10;

const getSource = (url: string) => {
  if (/^https?:\/\//.test(url)) {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch (e) {
      // Not a URL after all
    }
  }
  return 'Custom slugs';
};

const sumValues = (values: { [key: string]: number }) => Object.values(values).reduce((a, b) => a + b, 0);

export default function useStatistics(daily: DailyResult[], pages: PageResult[] = []) {
  const [mostUsedBrowser, setMostUsedBrowser] = useState<CommonStatistic | undefined>(undefined);
  const [allBrowsers, setAllBrowsers] = useState<CommonStatistic[]>([]);

  const [mostVisitedCountry, setMostVisitedCountry] = useState<CommonStatistic | undefined>(undefined);
  const [allCountries, setAllCountries] = useState<CommonStatistic[]>([]);

  const [browserHits, setBrowserHits] = useState(0);
  const [countryHits, setCountryHits] = useState(0);

  useEffect(() => {
    if (!daily || daily.length === 0) {
      setMostUsedBrowser(undefined);
      setAllBrowsers([]);

      setMostVisitedCountry(undefined);
      setAllCountries([]);

      setBrowserHits(0);
      setCountryHits(0);
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
        // The proxy hides the reader's browser, the traffic split reports these hits
        if (browser === DEFAULTS.githubProxy) {
          continue;
        }

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

    setBrowserHits(sumValues(crntBrowsers));
    setCountryHits(sumValues(crntCountries));

    // Find the country with the most hits
    if (Object.keys(crntCountries).length > 0) {
      const country = Object.keys(crntCountries).reduce((a, b) => crntCountries[a] > crntCountries[b] ? a : b);
      if (country) {
        setMostVisitedCountry({ title: country === "-" ? "Unknown" : country, value: crntCountries[country] });
      }
    }

    // Find the browser with the most hits
    if (Object.keys(crntBrowsers).length > 0) {
      const browser = Object.keys(crntBrowsers).reduce((a, b) => crntBrowsers[a] > crntBrowsers[b] ? a : b);
      if (browser) {
        setMostUsedBrowser({ title: browser, value: crntBrowsers[browser] });
      }
    } else {
      setMostUsedBrowser(undefined);
    }
  }, [daily]);

  const trafficSplit = useMemo(() => {
    return [...daily]
      .sort((a, b) => new Date(a.title).getTime() - new Date(b.title).getTime())
      .map(day => {
        const github = day.browsers?.[DEFAULTS.githubProxy] || 0;
        return { title: day.title, github, other: Math.max(0, day.total - github) };
      });
  }, [daily]);

  const githubHits = useMemo(() => trafficSplit.reduce((total, day) => total + day.github, 0), [trafficSplit]);

  const sources = useMemo(() => {
    const crntSources = {} as { [source: string]: number };

    for (const page of pages) {
      const source = getSource(page.url);
      crntSources[source] = (crntSources[source] || 0) + page.count;
    }

    return Object.keys(crntSources)
      .sort((a, b) => crntSources[b] - crntSources[a])
      .map(source => ({ title: source, value: crntSources[source] }))
      .slice(0, MAX_SOURCES);
  }, [pages]);

  // Equally long windows, so that an odd number of days can't favour the recent one
  const trendingWindow = Math.floor(trafficSplit.length / 2);

  const trendingPages = useMemo(() => {
    if (trendingWindow === 0) {
      return [];
    }

    const dates = trafficSplit.map(day => day.title);
    const recentDates = dates.slice(-trendingWindow);
    const earlierDates = dates.slice(-trendingWindow * 2, -trendingWindow);
    const sum = (page: PageResult, days: string[]) => days.reduce((total, date) => total + (page.daily?.[date] || 0), 0);

    return pages
      .filter(page => page.daily)
      .map(page => ({ url: page.url, recent: sum(page, recentDates), earlier: sum(page, earlierDates) }))
      .filter(page => page.recent >= MIN_TRENDING_HITS && page.recent > page.earlier)
      .sort((a, b) => (b.recent - b.earlier) - (a.recent - a.earlier))
      .slice(0, MAX_TRENDING_PAGES);
  }, [pages, trafficSplit, trendingWindow]);

  return {
    browserHits,
    countryHits,
    trafficSplit,
    githubHits,
    sources,
    trendingPages,
    trendingWindow,
    mostUsedBrowser,
    mostVisitedCountry,
    allBrowsers,
    allCountries
  };
}