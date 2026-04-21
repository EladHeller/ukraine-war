interface DateRangeControlsProps {
  startDate: string;
  endDate: string;
  query: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onQueryChange: (value: string) => void;
  onReset: () => void;
}

export default function DateRangeControls(props: DateRangeControlsProps) {
  const {
    startDate,
    endDate,
    query,
    onStartDateChange,
    onEndDateChange,
    onQueryChange,
    onReset,
  } = props;

  return (
    <section className="panel controls" aria-label="Filters">
      <div className="control-grid">
        <label className="control-field" htmlFor="start-date">
          <span>Start date</span>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(event) => onStartDateChange(event.target.value)}
          />
        </label>
        <label className="control-field" htmlFor="end-date">
          <span>End date</span>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(event) => onEndDateChange(event.target.value)}
          />
        </label>
        <label className="control-field" htmlFor="record-query">
          <span>Search descriptions</span>
          <input
            id="record-query"
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Filter by keywords"
          />
        </label>
      </div>
      <div className="control-actions">
        <button className="button button-secondary" type="button" onClick={onReset}>
          Reset filters
        </button>
      </div>
    </section>
  );
}
