export interface WarArea {
  hash: string;
  area: number;
  percent: string;
  type: 'unspecified' | 'unspecified' | 'other_territories' | 'occupied_after_24_02_2022' | 'occupied_to_24_02_2022' | 'liberated';
}

export interface HistoryRecord {
  id: number;
  description: string;
  descriptionEn: string;
  updatedAt: string;
  datetime: string;
  status: boolean;
  createdAt: string;
}

export interface Areas {
  liberated: number;
  occupied: number;
  unspecified: number;
  occupiedInRussia?: number;
  occupiedInRussiaUnspecified?: number;
}

export type HistoryRecordWithAreas = HistoryRecord & Areas;
