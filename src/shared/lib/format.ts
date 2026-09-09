const DATE_FORMATTER = new Intl.DateTimeFormat('es-BO', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat('es-BO', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat('es', {
  numeric: 'auto',
});

interface FileSizeUnit {
  readonly threshold: number;
  readonly label: string;
}

const FILE_SIZE_UNITS: readonly FileSizeUnit[] = [
  { threshold: 1024 * 1024 * 1024, label: 'GB' },
  { threshold: 1024 * 1024, label: 'MB' },
  { threshold: 1024, label: 'KB' },
];

/** Formats a date string or Date to "1 de enero de 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATE_FORMATTER.format(d);
}

/** Formats a date string or Date to "1 ene 2026, 14:30" */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return DATETIME_FORMATTER.format(d);
}

/** Formats a relative time like "hace 3 minutos" */
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = Date.now();
  const diff = d.getTime() - now;
  const absDiff = Math.abs(diff);

  if (absDiff < 60_000) {
    return RELATIVE_FORMATTER.format(Math.round(diff / 1000), 'second');
  }
  if (absDiff < 3_600_000) {
    return RELATIVE_FORMATTER.format(Math.round(diff / 60_000), 'minute');
  }
  if (absDiff < 86_400_000) {
    return RELATIVE_FORMATTER.format(Math.round(diff / 3_600_000), 'hour');
  }
  return RELATIVE_FORMATTER.format(Math.round(diff / 86_400_000), 'day');
}

/** Formats bytes to human-readable file size (e.g., "2.4 MB") */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  for (const unit of FILE_SIZE_UNITS) {
    if (bytes >= unit.threshold) {
      const value = bytes / unit.threshold;
      return `${value.toFixed(value < 10 ? 1 : 0)} ${unit.label}`;
    }
  }

  return `${bytes} B`;
}

/** Formats a percentage (0-100) */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/** Truncates a string to maxLength and adds ellipsis */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

/** Formats a tramite code like "TS-2026-00042" */
export function formatTramiteCode(numero: number, year?: number): string {
  const y = year ?? new Date().getFullYear();
  return `TS-${y}-${String(numero).padStart(5, '0')}`;
}
