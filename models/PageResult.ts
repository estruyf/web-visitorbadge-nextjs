export interface PageResult {
  url: string;
  count: number;
  daily?: { [date: string]: number };
}
