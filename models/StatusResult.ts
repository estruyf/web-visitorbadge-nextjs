import { DailyResult, PageResult } from ".";

export interface TodayStats {
  browsers: { [browser: string]: number } | null;
  countries: { [country: string]: number } | null;
}

export interface StatusResult {
  total: number;
  today: number;
  todayStats?: TodayStats | null;
  created?: string | null;
  dailyResults: DailyResult[];
  pageResults: PageResult[];
  isSponsored: boolean;
  days: number;
}
