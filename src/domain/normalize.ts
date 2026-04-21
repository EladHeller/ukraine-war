import sourceData from '../data.json';
import type { HistoryRecordWithAreas, WarSnapshot } from '../types';

const toSafeNumber = (value: number | undefined): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);
export const warSnapshots: WarSnapshot[] = (sourceData as HistoryRecordWithAreas[])
  .reduce<WarSnapshot[]>((accumulator, record) => {
    const createdAtDate = new Date(record.createdAt);
    if (Number.isNaN(createdAtDate.getTime())) {
      return accumulator;
    }

    const occupiedInRussia = toSafeNumber(record.occupiedInRussia);
    const occupiedInRussiaUnspecified = toSafeNumber(record.occupiedInRussiaUnspecified);
    const total = (
      record.liberated
      + record.occupied
      + record.unspecified
      + occupiedInRussia
      + occupiedInRussiaUnspecified
    );
    accumulator.push({
      ...record,
      occupiedInRussia,
      occupiedInRussiaUnspecified,
      total,
      dayKey: createdAtDate.toISOString().slice(0, 10),
      createdAtDate,
    });

    return accumulator;
  }, [])
  .sort((left, right) => left.createdAtDate.getTime() - right.createdAtDate.getTime());

export default warSnapshots;
