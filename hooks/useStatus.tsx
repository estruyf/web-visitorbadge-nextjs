import { useState, useEffect } from 'react';
import { API } from '../constants/API';

export interface StatusResult {
  total: number;
  today: number;
  dailyResults: DailyResult[];
}

export interface DailyResult {
  title: string;
  total: number;
}

export default function useStatus(user: string, repo: string) {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [today, setToday] = useState(0);
  const [daily, setDaily] = useState<DailyResult[]>([]);

  useEffect(() => {
    const getStatus = async () => {
      setLoading(true);

      const resp = await fetch(`${process.env.NEXT_PUBLIC_VISITOR_API}${API.status}?user=${user}&repo=${repo}`);

      if (resp && resp.ok) {
        const data: StatusResult = await resp.json();
        if (data) {
          setTotal(data.total || 0);
          setToday(data.today || 0);
          setDaily(data.dailyResults || []);
        }
      }

      setLoading(false);
    };

    if (user && repo) {
      getStatus();
    }
  }, [user, repo]);

  return {
    total,
    today,
    daily,
    loading
  };
}