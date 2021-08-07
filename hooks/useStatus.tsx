import { useState, useEffect } from 'react';
import { API } from '../constants/API';

export interface StatusResult {
  total: number;
  dailyResults: DailyResult[];
}

export interface DailyResult {
  title: string;
  total: number;
}

export default function useStatus(user: string, repo: string) {
  const [total, setTotal] = useState(0);
  const [daily, setDaily] = useState<DailyResult[]>([]);

  useEffect(() => {
    const getStatus = async () => {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_VISITOR_API}${API.status}?user=${user}&repo=${repo}`);

      if (resp && resp.ok) {
        const data: StatusResult = await resp.json();
        if (data) {
          setTotal(data.total || 0);
          setDaily(data.dailyResults || []);
        }
      }
    };

    if (user && repo) {
      getStatus();
    }
  }, [user, repo]);

  return {
    total,
    daily
  };
}