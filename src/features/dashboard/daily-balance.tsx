export type BalanceRow = {
  label: string;
  value: string;
  ratio: number | null;
  note?: string;
};

export function DailyBalance({
  title,
  rows,
}: {
  title: string;
  rows: BalanceRow[];
}) {
  return (
    <section className="daily-balance" aria-labelledby="daily-balance-title">
      <h2 id="daily-balance-title">{title}</h2>
      <ul
        className="balance-rows"
        aria-label={title}
      >
        {rows.map((row) => (
          <li className="balance-row" key={row.label}>
            <div>
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
            {row.ratio === null ? (
              row.note ? <p>{row.note}</p> : null
            ) : (
              <div
                className="linear-meter"
                role="meter"
                aria-label={`${row.label}: ${row.value}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(row.ratio * 100)}
              >
                <span style={{ width: `${Math.round(row.ratio * 100)}%` }} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
