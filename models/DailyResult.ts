export interface DailyResult {
  title: string;
  total: number;
  countries: { [country: string]: number };
  browsers: { [browser: string]: number };
}
