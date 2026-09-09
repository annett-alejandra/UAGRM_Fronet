import { type ReactNode } from 'react';
import './Badge.css';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'accent';
type BadgeSize = 'sm' | 'lg';

interface BadgeProps {
  readonly variant?: BadgeVariant;
  readonly size?: BadgeSize;
  readonly showDot?: boolean;
  readonly children: ReactNode;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  showDot = false,
  children,
}: BadgeProps) {
  const classes = [
    'badge',
    `badge--${variant}`,
    size === 'lg' ? 'badge--lg' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {showDot && <span className="badge__dot" />}
      {children}
    </span>
  );
}
