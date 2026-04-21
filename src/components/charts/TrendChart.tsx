import { useEffect, useState } from 'react';
import {
  Brush,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Milestone } from '../../domain/milestones';
import { formatArea, formatChartDate } from '../../utils/format';

export interface ChartPoint {
  dayKey: string;
  occupied: number;
  liberated: number;
  unspecified: number;
  occupiedInRussia: number;
}

interface TrendChartProps {
  points: ChartPoint[];
  milestones: Milestone[];
}

export default function TrendChart({ points, milestones }: TrendChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');
    const handleChange = () => setIsMobile(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={isMobile ? 320 : 420}>
        <LineChart
          data={points}
          margin={{
            top: isMobile ? 12 : 20,
            right: isMobile ? 8 : 20,
            left: isMobile ? 2 : 10,
            bottom: isMobile ? 12 : 20,
          }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="dayKey" tickFormatter={formatChartDate} minTickGap={isMobile ? 36 : 26} />
          <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
          <Tooltip
            labelFormatter={(label: string) => formatChartDate(label)}
            formatter={(value: number) => formatArea(value)}
          />
          <Legend wrapperStyle={isMobile ? { fontSize: 12 } : undefined} />
          {milestones.map((milestone, index) => (
            <ReferenceLine
              key={milestone.dayKey}
              x={milestone.dayKey}
              ifOverflow="extendDomain"
              stroke="#64748b"
              strokeDasharray="3 3"
              label={isMobile ? undefined : {
                value: `M${index + 1}`,
                position: 'insideTopLeft',
                fill: '#475569',
                fontSize: 11,
                dy: index % 2 === 0 ? -6 : 12,
              }}
            />
          ))}
          <Line type="monotone" dataKey="occupied" name="Occupied" stroke="#ef4444" strokeWidth={2.4} dot={false} />
          <Line type="monotone" dataKey="liberated" name="Liberated" stroke="#2563eb" strokeWidth={2.4} dot={false} />
          <Line type="monotone" dataKey="unspecified" name="Unspecified" stroke="#16a34a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="occupiedInRussia" name="In Russia" stroke="#7c3aed" strokeWidth={2} dot={false} />
          <Brush dataKey="dayKey" tickFormatter={formatChartDate} height={isMobile ? 22 : 28} />
        </LineChart>
      </ResponsiveContainer>
      {!!milestones.length && (
        <ol className="milestone-list">
          {milestones.map((milestone, index) => (
            <li key={`${milestone.dayKey}-${milestone.label}`}>
              <span className="milestone-list-key">M{index + 1}</span>
              <span className="milestone-list-date">{formatChartDate(milestone.dayKey)}</span>
              <span className="milestone-list-label">{milestone.label}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
