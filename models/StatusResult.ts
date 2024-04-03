import { DailyResult, PageResult } from ".";

export interface StatusResult {
  total: number;
  today: number;
  dailyResults: DailyResult[];
  pageResults: PageResult[];
  isSponsored: boolean;
  days: number;
}
