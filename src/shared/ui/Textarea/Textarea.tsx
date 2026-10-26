import * as React from "react";
import { textareaVariants, type TextareaVariantProps } from "./textarea.variants";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    TextareaVariantProps {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        aria-invalid={hasError ? "true" : undefined}
        className={textareaVariants({ hasError, className })}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
