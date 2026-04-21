import {
  useEffect, useMemo, useRef, useState,
} from 'react';
import type { WarSnapshot } from '../types';
import {
  formatCompactArea, formatDateTime, stripHtml, truncate,
} from '../utils/format';

const PAGE_SIZE = 200;
const ROW_HEIGHT = 44;
const VIEWPORT_HEIGHT = 560;
const OVERSCAN_ROWS = 10;

const toDescription = (record: WarSnapshot): string => {
  const source = record.descriptionEn || record.description;
  return truncate(stripHtml(source), 180);
};

export default function TimelineTable({ records }: { records: WarSnapshot[] }) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [loadedCount, setLoadedCount] = useState(() => Math.min(PAGE_SIZE, records.length));
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(VIEWPORT_HEIGHT);

  useEffect(() => {
    setLoadedCount(Math.min(PAGE_SIZE, records.length));
    setScrollTop(0);
    if (viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }
  }, [records]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) {
      return undefined;
    }

    const updateViewportHeight = () => {
      setViewportHeight(Math.max(viewport.clientHeight, ROW_HEIGHT));
    };

    updateViewportHeight();
    const observer = new ResizeObserver(updateViewportHeight);
    observer.observe(viewport);
    window.addEventListener('resize', updateViewportHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  const loadedRecords = useMemo(
    () => records.slice(0, loadedCount),
    [records, loadedCount],
  );

  const visibleRows = Math.ceil(viewportHeight / ROW_HEIGHT) + (OVERSCAN_ROWS * 2);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN_ROWS);
  const endIndex = Math.min(loadedRecords.length, startIndex + visibleRows);
  const topSpacerHeight = startIndex * ROW_HEIGHT;
  const bottomSpacerHeight = Math.max(0, (loadedRecords.length - endIndex) * ROW_HEIGHT);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    setScrollTop(target.scrollTop);

    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - (ROW_HEIGHT * 3);
    if (nearBottom && loadedCount < records.length) {
      setLoadedCount((current) => Math.min(current + PAGE_SIZE, records.length));
    }
  };

  return (
    <div
      ref={viewportRef}
      className="table-scroll timeline-viewport"
      onScroll={onScroll}
    >
      <table className="timeline-table">
        <thead>
          <tr>
            <th className="timeline-col-date">Updated</th>
            <th className="timeline-col-description">Description</th>
            <th className="timeline-col-number">Occupied</th>
            <th className="timeline-col-number">Liberated</th>
            <th className="timeline-col-number">Unspecified</th>
          </tr>
        </thead>
        <tbody>
          {topSpacerHeight > 0 && (
            <tr className="timeline-spacer" aria-hidden="true">
              <td colSpan={5} style={{ height: `${topSpacerHeight}px` }} />
            </tr>
          )}
          {loadedRecords.slice(startIndex, endIndex).map((record) => (
            <tr key={`${record.id}-${record.dayKey}-${record.createdAt}`} style={{ height: `${ROW_HEIGHT}px` }}>
              <td className="timeline-col-date">{formatDateTime(record.createdAtDate)}</td>
              <td className="timeline-description" title={toDescription(record)}>{toDescription(record)}</td>
              <td className="timeline-col-number">{formatCompactArea(record.occupied)}</td>
              <td className="timeline-col-number">{formatCompactArea(record.liberated)}</td>
              <td className="timeline-col-number">{formatCompactArea(record.unspecified)}</td>
            </tr>
          ))}
          {bottomSpacerHeight > 0 && (
            <tr className="timeline-spacer" aria-hidden="true">
              <td colSpan={5} style={{ height: `${bottomSpacerHeight}px` }} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
