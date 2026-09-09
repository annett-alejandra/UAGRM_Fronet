import { useState, useEffect, useRef, useCallback } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  readonly placeholder?: string;
  readonly value?: string;
  readonly onSearch: (query: string) => void;
  readonly debounceMs?: number;
  readonly showShortcut?: boolean;
  readonly size?: 'md' | 'lg';
  readonly autoFocus?: boolean;
}

export function SearchBar({
  placeholder = 'Buscar…',
  value: controlledValue,
  onSearch,
  debounceMs = 300,
  showShortcut = true,
  size = 'md',
  autoFocus = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(controlledValue ?? '');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);

  /* Keyboard shortcut: Ctrl+K or Cmd+K to focus */
  useEffect(() => {
    if (!showShortcut) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [showShortcut]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        onSearch(newValue);
      }, debounceMs);
    },
    [onSearch, debounceMs],
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onSearch('');
    inputRef.current?.focus();
  }, [onSearch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        onSearch(localValue);
      }
      if (e.key === 'Escape') {
        handleClear();
      }
    },
    [localValue, onSearch, handleClear],
  );

  const showClear = localValue.length > 0;
  const wrapperClasses = ['search-bar', size === 'lg' ? 'search-bar--lg' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      <input
        ref={inputRef}
        type="search"
        className="search-bar__input"
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        aria-label={placeholder}
      />
      <span className="search-bar__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      {showClear ? (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : showShortcut ? (
        <span className="search-bar__kbd" aria-hidden="true">
          Ctrl K
        </span>
      ) : null}
    </div>
  );
}
