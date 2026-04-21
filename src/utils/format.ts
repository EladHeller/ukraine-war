const areaFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const signedAreaFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  signDisplay: 'always',
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1,
  notation: 'compact',
});

export const formatArea = (value: number): string => `${areaFormatter.format(value)} km²`;
export const formatSignedArea = (value: number): string => `${signedAreaFormatter.format(value)} km²`;
export const formatCompactArea = (value: number): string => compactFormatter.format(value);

export const formatChartDate = (dayKey: string): string => new Date(`${dayKey}T00:00:00.000Z`).toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
});

export const formatDateTime = (date: Date): string => date.toLocaleString('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const stripHtml = (value: string): string => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const truncate = (value: string, maxLength: number): string => (value.length <= maxLength ? value : `${value.slice(0, maxLength - 1)}…`);
