/** "Jan 2024" — the granularity a CV timeline actually needs. */
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

/** "Jan 2024 — Present", or a closed range. */
export function formatDateRange(startIso: string, endIso: string | null): string {
  const start = formatMonthYear(startIso);
  return `${start} — ${endIso ? formatMonthYear(endIso) : 'Present'}`;
}
