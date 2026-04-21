import { useMemo, useState } from 'react';
import DateRangeControls from './components/DateRangeControls';
import MetricCard from './components/MetricCard';
import TimelineTable from './components/TimelineTable';
import TrendChart, { type ChartPoint } from './components/charts/TrendChart';
import { milestones } from './domain/milestones';
import { warSnapshots } from './domain/normalize';
import { createDashboardSummary, filterSnapshots } from './domain/selectors';
import {
  formatArea, formatDateTime, formatSignedArea,
} from './utils/format';
import { WarSnapshot } from './types';

export default function App() {
  const firstSnapshot = warSnapshots[0];
  const lastSnapshot = warSnapshots[warSnapshots.length - 1];

  const [startDate, setStartDate] = useState(firstSnapshot?.dayKey ?? '');
  const [endDate, setEndDate] = useState(lastSnapshot?.dayKey ?? '');
  const [query, setQuery] = useState('');

  const filteredSnapshots = useMemo(
    () => filterSnapshots(warSnapshots, startDate, endDate, query),
    [startDate, endDate, query],
  );

  const summary = useMemo(
    () => createDashboardSummary(filteredSnapshots),
    [filteredSnapshots],
  );

  const chartPoints = useMemo<ChartPoint[]>(
    () => {
      const latestSnapshotByDay = new Map<string, WarSnapshot>();
      filteredSnapshots.forEach((snapshot) => {
        // Keep the latest update for each day to avoid duplicate categorical x-axis keys.
        latestSnapshotByDay.set(snapshot.dayKey, snapshot);
      });

      return Array.from(latestSnapshotByDay.values()).map((snapshot) => ({
        dayKey: snapshot.dayKey,
        occupied: snapshot.occupied,
        liberated: snapshot.liberated,
        unspecified: snapshot.unspecified,
        occupiedInRussia: snapshot.occupiedInRussia ?? 0,
      }));
    },
    [filteredSnapshots],
  );

  const visibleMilestones = useMemo(() => {
    if (!chartPoints.length) {
      return [];
    }

    const dayKeysInRange = new Set(chartPoints.map((point) => point.dayKey));
    return milestones.filter((milestone) => dayKeysInRange.has(milestone.dayKey));
  }, [chartPoints]);

  const resetFilters = () => {
    setStartDate(firstSnapshot?.dayKey ?? '');
    setEndDate(lastSnapshot?.dayKey ?? '');
    setQuery('');
  };

  return (
    <main className="app">
      <header className="hero panel">
        <h1>Ukraine War Territory Dashboard</h1>
        <p>
          Full frontend rewrite with a modular analytics layout.
          Historical data is preserved and loaded from the existing dataset.
        </p>
        <div className="hero-metadata">
          <span className="badge">{warSnapshots.length.toLocaleString('en-US')} records</span>
          <span className="badge">Last update: {lastSnapshot ? formatDateTime(lastSnapshot.createdAtDate) : 'n/a'}</span>
        </div>
      </header>

      <DateRangeControls
        startDate={startDate}
        endDate={endDate}
        query={query}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onQueryChange={setQuery}
        onReset={resetFilters}
      />

      {!summary ? (
        <section className="panel empty-state">
          <h2>No records match your filters</h2>
          <p>Try widening the date range or clearing the search query.</p>
        </section>
      ) : (
        <>
          <section className="metrics-grid">
            <MetricCard
              label="Occupied"
              value={formatArea(summary.latest.occupied)}
              delta={formatSignedArea(summary.deltas.occupied)}
              accentClassName="accent-occupied"
              helperText="Estimated occupied area"
            />
            <MetricCard
              label="Liberated"
              value={formatArea(summary.latest.liberated)}
              delta={formatSignedArea(summary.deltas.liberated)}
              accentClassName="accent-liberated"
              helperText="Estimated liberated area"
            />
            <MetricCard
              label="Unspecified"
              value={formatArea(summary.latest.unspecified)}
              delta={formatSignedArea(summary.deltas.unspecified)}
              accentClassName="accent-unspecified"
              helperText="Areas with uncertain control"
            />
            <MetricCard
              label="Occupied in Russia"
              value={formatArea(summary.latest.occupiedInRussia ?? 0)}
              delta={formatSignedArea(summary.deltas.occupiedInRussia)}
              accentClassName="accent-russia"
              helperText="Cross-border occupied area"
            />
          </section>

          <section className="panel trend-panel">
            <h2>Territory trend over time</h2>
            <p className="section-subtitle">Multi-line view with key milestones and brush zoom.</p>
            <TrendChart points={chartPoints} milestones={visibleMilestones} />
          </section>

          <section className="panel">
            <h2>Recent timeline records</h2>
            <p className="section-subtitle">
              Newest first. Scroll down to load older records.
            </p>
            <TimelineTable records={filteredSnapshots.slice().reverse()} />
          </section>
        </>
      )}

      <footer className="panel footer-note">
        <span>Data source:</span>
        <a target="_blank" rel="noreferrer noopener" href="https://deepstatemap.live/en">
          deepstatemap.live
        </a>
      </footer>
    </main>
  );
}
