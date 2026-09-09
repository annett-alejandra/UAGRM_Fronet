import { type ReactNode } from 'react';
import './EmptyState.css';

interface EmptyStateProps {
  readonly icon?: ReactNode;
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

function DefaultIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="12" y="16" width="56" height="48" rx="4" />
      <path d="M12 28h56" />
      <circle cx="22" cy="22" r="2" fill="currentColor" stroke="none" />
      <circle cx="30" cy="22" r="2" fill="currentColor" stroke="none" />
      <circle cx="38" cy="22" r="2" fill="currentColor" stroke="none" />
      <path d="M28 44h24M32 52h16" strokeOpacity="0.4" />
    </svg>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state__icon" aria-hidden="true">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      {action && (
        <div className="empty-state__action">{action}</div>
      )}
    </div>
  );
}
