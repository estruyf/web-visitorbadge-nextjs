import * as React from 'react';
import { DailyResult, PageResult } from '../models';

export interface IExportCsvButtonProps {
  daily: DailyResult[];
  pages: PageResult[];
}

// Page URLs and slugs can be set by anyone, so a value can't be allowed to run
// as a formula when the file is opened in a spreadsheet.
const toCell = (value: string | number) => {
  let text = `${value}`;
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }
  return `"${text.replace(/"/g, '""')}"`;
};

const getRows = (daily: DailyResult[], pages: PageResult[]) => {
  const rows: (string | number)[][] = [];

  for (const day of daily) {
    rows.push([day.title, 'total', '', day.total]);

    for (const [browser, count] of Object.entries(day.browsers || {})) {
      rows.push([day.title, 'browser', browser, count]);
    }

    for (const [country, count] of Object.entries(day.countries || {})) {
      rows.push([day.title, 'country', country === '-' ? 'Unknown' : country, count]);
    }
  }

  for (const page of pages) {
    if (page.daily) {
      for (const [date, count] of Object.entries(page.daily)) {
        rows.push([date, 'page', page.url, count]);
      }
    } else {
      rows.push(['', 'page', page.url, page.count]);
    }
  }

  return rows;
};

export const ExportCsvButton: React.FunctionComponent<IExportCsvButtonProps> = ({ daily, pages }: React.PropsWithChildren<IExportCsvButtonProps>) => {
  const handleExport = () => {
    const csv = [['date', 'type', 'name', 'hits'], ...getRows(daily, pages)]
      .map(row => row.map(toCell).join(','))
      .join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.download = `visitor-statistics-${new Date().toISOString().split('T')[0]}.csv`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      className="inline-flex flex-shrink-0 items-center px-2.5 py-1.5 text-sm font-medium text-ink-700 bg-white border border-line rounded-lg hover:border-ink-300 hover:text-ink-900 transition-colors"
    >
      Download CSV
    </button>
  );
};
