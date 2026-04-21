import type { WarSnapshot } from '../types';
import { stripHtml } from '../utils/format';

const normalizeRange = (startDate: string, endDate: string): { normalizedStart: string, normalizedEnd: string } => {
  if (startDate && endDate && startDate > endDate) {
    return {
      normalizedStart: endDate,
      normalizedEnd: startDate,
    };
  }

  return {
    normalizedStart: startDate,
    normalizedEnd: endDate,
  };
};

export const filterSnapshots = (
  snapshots: WarSnapshot[],
  startDate: string,
  endDate: string,
  query: string,
): WarSnapshot[] => {
  const normalizedQuery = query.trim().toLowerCase();
  const { normalizedStart, normalizedEnd } = normalizeRange(startDate, endDate);

  return snapshots.filter((snapshot) => {
    if (normalizedStart && snapshot.dayKey < normalizedStart) {
      return false;
    }
    if (normalizedEnd && snapshot.dayKey > normalizedEnd) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }

    const normalizedDescription = stripHtml(snapshot.description).toLowerCase();
    const normalizedDescriptionEn = stripHtml(snapshot.descriptionEn).toLowerCase();
    return normalizedDescription.includes(normalizedQuery) || normalizedDescriptionEn.includes(normalizedQuery);
  });
};

export interface DashboardSummary {
  baseline: WarSnapshot
  latest: WarSnapshot
  periodDays: number
  records: number
  deltas: {
    occupied: number
    liberated: number
    unspecified: number
    occupiedInRussia: number
    total: number
  }
}

export const createDashboardSummary = (snapshots: WarSnapshot[]): DashboardSummary | null => {
  if (!snapshots.length) {
    return null;
  }

  const baseline = snapshots[0];
  const latest = snapshots[snapshots.length - 1];
  const periodDays = Math.max(
    0,
    Math.round((latest.createdAtDate.getTime() - baseline.createdAtDate.getTime()) / (24 * 60 * 60 * 1000)),
  );

  return {
    baseline,
    latest,
    periodDays,
    records: snapshots.length,
    deltas: {
      occupied: latest.occupied - baseline.occupied,
      liberated: latest.liberated - baseline.liberated,
      unspecified: latest.unspecified - baseline.unspecified,
      occupiedInRussia: (latest.occupiedInRussia ?? 0) - (baseline.occupiedInRussia ?? 0),
      total: latest.total - baseline.total,
    },
  };
};
