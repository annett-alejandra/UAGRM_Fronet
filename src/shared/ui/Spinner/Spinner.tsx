import './Spinner.css';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface SpinnerProps {
  readonly size?: SpinnerSize;
  readonly label?: string;
}

interface FullPageSpinnerProps {
  readonly message?: string;
}

export function Spinner({ size = 'md', label = 'Cargando' }: SpinnerProps) {
  return (
    <span className={`spinner spinner--${size}`} role="status" aria-label={label}>
      <svg className="spinner__svg" viewBox="0 0 24 24" fill="none">
        <circle className="spinner__track" cx="12" cy="12" r="10" strokeWidth="2.5" />
        <path
          className="spinner__indicator"
          d="M12 2a10 10 0 0 1 10 10"
          strokeWidth="2.5"
        />
      </svg>
    </span>
  );
}

export function FullPageSpinner({ message = 'Cargando…' }: FullPageSpinnerProps) {
  return (
    <div className="spinner-overlay" role="status" aria-label={message}>
      <Spinner size="xl" />
      <span className="spinner-overlay__text">{message}</span>
    </div>
  );
}
