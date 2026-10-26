import * as React from "react";
import { selectVariants, type SelectVariantProps } from "./select.variants";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement>,
    SelectVariantProps {
  hasError?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, disabled, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError ? "true" : undefined}
        className={selectVariants({ hasError, className })}
        {...props}
      >
        {children}
      </select>
    );
  }
);
Select.displayName = "Select";
