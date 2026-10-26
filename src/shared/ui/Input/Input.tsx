import * as React from "react";
import { inputVariants } from "./input.variants";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", hasError, startIcon, endIcon, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {startIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          aria-invalid={hasError ? "true" : undefined}
          className={`${inputVariants({ hasError, className })} ${
            startIcon ? "pl-9" : ""
          } ${endIcon ? "pr-9" : ""}`}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 text-slate-400 pointer-events-none flex items-center">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
