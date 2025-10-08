import { useState, useEffect } from 'react';
import { API } from '../constants/API';
import { DEFAULTS } from '../constants/Defaults';
import { DailyResult, PageResult, StatusResult } from '../models';

export default function useStatus(url: string = "", user: string = "", repo: string = "") {

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [daily, setDaily] = useState<DailyResult[]>([]);
  const [pages, setPages] = useState<PageResult[]>([]);
  const [isSponsor, setIsSponsor] = useState<boolean | undefined>(undefined);
  const [days, setDays] = useState<number>(30);


  useEffect(() => {
    const getStatus = async (fallbackUrl?: string) => {
      setLoading(true);

      let query = `?path=${fallbackUrl}`;

      if (url) {
        query = `?path=${encodeURIComponent(url)}`;
      } else if (user && repo) {
        query = `?user=${user}&repo=${repo}`;
      }

      const search = document.location.search;
      if (search && fallbackUrl) {
        // Only use fallback when no url is provided
        return;
      }

      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_VISITOR_API}${API.status}${query}`);

        if (resp && resp.ok) {
          const data: StatusResult = await resp.json();
          if (data) {
            setTotal(data.total || 0);
            setToday(data.today || 0);
            setDaily(data.dailyResults || []);
            setPages(data.pageResults || []);
            setIsSponsor(data.isSponsored || false);
            setDays(data.days || 30);

          }
        }
      } catch (error) {
        console.error('API request failed:', error);
      }

      setLoading(false);
    };

    if ((user && repo) || url) {
      getStatus();
    } else {
      getStatus(DEFAULTS.url);
    }
  }, [url, user, repo]);

  return {
    total,
    today,
    daily,
    pages,
    isSponsor,
    days,
    loading
  };
}