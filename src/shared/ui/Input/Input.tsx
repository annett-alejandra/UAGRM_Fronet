import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface BaseInputProps {
  readonly label?: string;
  readonly helperText?: string;
  readonly errorMessage?: string;
  readonly isRequired?: boolean;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
}

type InputFieldProps = BaseInputProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
    readonly isTextarea?: false;
  };

type TextareaFieldProps = BaseInputProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> & {
    readonly isTextarea: true;
  };

type InputProps = InputFieldProps | TextareaFieldProps;

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  function Input(props, ref) {
    const {
      label,
      helperText,
      errorMessage,
      isRequired = false,
      leftIcon,
      rightIcon,
      id,
      ...rest
    } = props;

    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const hasError = Boolean(errorMessage);

    const fieldClasses = [
      'input-field',
      hasError ? 'input-field--error' : '',
      leftIcon ? 'input-field--with-left-icon' : '',
      rightIcon ? 'input-field--with-right-icon' : '',
      props.isTextarea ? 'input-field--textarea' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="input-wrapper">
        {label && (
          <label
            htmlFor={inputId}
            className={`input-label ${isRequired ? 'input-label--required' : ''}`}
          >
            {label}
          </label>
        )}

        <div className="input-container">
          {leftIcon && (
            <span className="input-icon input-icon--left" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          {props.isTextarea ? (
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              className={fieldClasses}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              required={isRequired}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              ref={ref as React.Ref<HTMLInputElement>}
              id={inputId}
              className={fieldClasses}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
              required={isRequired}
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            />
          )}

          {rightIcon && (
            <span className="input-icon input-icon--right" aria-hidden="true">
              {rightIcon}
            </span>
          )}
        </div>

        {hasError && (
          <span id={`${inputId}-error`} className="input-error-message" role="alert">
            {errorMessage}
          </span>
        )}

        {!hasError && helperText && (
          <span id={`${inputId}-helper`} className="input-helper">
            {helperText}
          </span>
        )}
      </div>
    );
  },
);
