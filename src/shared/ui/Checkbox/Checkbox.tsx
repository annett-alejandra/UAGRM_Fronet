import * as React from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  hasError?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", hasError, disabled, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError ? "true" : undefined}
        className={`h-4 w-4 rounded border-slate-300 text-[hsl(var(--color-primary))] focus:ring-[hsl(var(--color-ring))] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
