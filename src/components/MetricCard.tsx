interface MetricCardProps {
  label: string
  value: string
  delta?: string
  accentClassName: string
  helperText?: string
}

export default function MetricCard(props: MetricCardProps) {
  const {
    label, value, delta, accentClassName, helperText,
  } = props;

  return (
    <article className={`metric-card ${accentClassName}`}>
      <header className="metric-header">
        <p className="metric-label">{label}</p>
        {delta ? <p className="metric-delta">{delta}</p> : null}
      </header>
      <p className="metric-value">{value}</p>
      {helperText ? <p className="metric-helper">{helperText}</p> : null}
    </article>
  );
}
