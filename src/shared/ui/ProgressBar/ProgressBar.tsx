import './ProgressBar.css';

type ProgressBarColor = 'primary' | 'success' | 'warning' | 'error' | 'accent';
type ProgressBarSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  readonly value?: number; /* 0-100, undefined = indeterminate */
  readonly label?: string;
  readonly showValue?: boolean;
  readonly color?: ProgressBarColor;
  readonly size?: ProgressBarSize;
}

export function ProgressBar({
  value,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
}: ProgressBarProps) {
  const isIndeterminate = value === undefined;
  const clampedValue = isIndeterminate ? 0 : Math.min(100, Math.max(0, value));

  const trackClasses = [
    'progress-bar__track',
    size !== 'md' ? `progress-bar__track--${size}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const fillClasses = [
    'progress-bar__fill',
    `progress-bar__fill--${color}`,
    isIndeterminate ? 'progress-bar__fill--indeterminate' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={isIndeterminate ? undefined : clampedValue} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      {(label || showValue) && (
        <div className="progress-bar__header">
          {label && <span className="progress-bar__label">{label}</span>}
          {showValue && !isIndeterminate && (
            <span className="progress-bar__value">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className={trackClasses}>
        <div
          className={fillClasses}
          style={isIndeterminate ? undefined : { width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
