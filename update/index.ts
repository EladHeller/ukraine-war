/* eslint-disable no-await-in-loop, no-restricted-syntax, no-console */
import fs from 'fs/promises';
import {
  Areas, HistoryRecord, HistoryRecordWithAreas, WarArea,
} from '../src/types.d';

async function getHistoryRecords() {
  const historyRecords: HistoryRecord[] = await fetch('https://deepstatemap.live/api/history/public').then((res) => res.json());
  return historyRecords;
}
async function getAreasStatusById(dateId: number) {
  const areas: WarArea[] = await fetch(`https://deepstatemap.live/api/history/${dateId}/areas`).then((res) => res.json());
  console.log({ areas, dateId });
  const occupied = areas.find((area) => area.type === 'occupied_after_24_02_2022')?.area ?? 0;
  const liberated = areas.find((area) => area.type === 'liberated')?.area ?? 0;
  const unspecified = areas.find((area) => area.type === 'unspecified')?.area ?? 0;
  const occupiedInRussia = areas.find((area) => area.hash === '#01579b')?.area ?? 0;
  const occupiedInRussiaUnspecified = areas.find((area) => area.hash === '#bdbdbd')?.area ?? 0;

  const data: Areas = {
    liberated,
    occupied,
    unspecified,
  };

  if (occupiedInRussia) {
    data.occupiedInRussia = occupiedInRussia;
  }
  if (occupiedInRussiaUnspecified) {
    data.occupiedInRussiaUnspecified = occupiedInRussiaUnspecified;
  }
  return data;
}

async function updateData() {
  const historyRecords = await getHistoryRecords();
  const historyRecordsWithAreas: HistoryRecordWithAreas[] = [];

  for (const record of historyRecords) {
    const areas = await getAreasStatusById(record.id);
    historyRecordsWithAreas.push({
      ...record,
      ...areas,
    });
  }

  const data = JSON.stringify(historyRecordsWithAreas, null, 2)
    // Manually fix strange numbers
    .replace('26342.19064266102', '933.4418085939385')
    .replace('26345.46442466065', '933.4418085939385');
  await fs.writeFile('./src/data.json', data);
}

updateData().catch((err) => {
  console.error(err);
  process.exit(1);
});
