import { type ReactNode, type HTMLAttributes } from 'react';
import './Card.css';

type CardPadding = 'compact' | 'normal' | 'spacious';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly isGlass?: boolean;
  readonly isInteractive?: boolean;
  readonly isSelected?: boolean;
  readonly isLoading?: boolean;
  readonly padding?: CardPadding;
  readonly children: ReactNode;
}

interface CardSectionProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export function Card({
  isGlass = false,
  isInteractive = false,
  isSelected = false,
  isLoading = false,
  padding = 'normal',
  children,
  className = '',
  ...rest
}: CardProps) {
  const classes = [
    'card',
    `card--${padding}`,
    isGlass ? 'card--glass' : '',
    isInteractive ? 'card--interactive' : '',
    isSelected ? 'card--selected' : '',
    isLoading ? 'card--skeleton' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (isLoading) {
    return (
      <div className={classes} aria-busy="true" {...rest}>
        <div className="card__skeleton-line" />
        <div className="card__skeleton-line" />
        <div className="card__skeleton-line" />
      </div>
    );
  }

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardSectionProps) {
  return (
    <div className={`card__header ${className}`}>
      {children}
    </div>
  );
}

export function CardHeaderTitle({ children }: { readonly children: ReactNode }) {
  return <h3 className="card__header-title">{children}</h3>;
}

export function CardBody({ children, className = '' }: CardSectionProps) {
  return (
    <div className={`card__body ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardSectionProps) {
  return (
    <div className={`card__footer ${className}`}>
      {children}
    </div>
  );
}
