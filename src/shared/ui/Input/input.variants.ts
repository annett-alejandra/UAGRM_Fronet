import { cva, type VariantProps } from "class-variance-authority";

export const inputVariants = cva(
  "flex h-10 w-full rounded-[var(--radius-base)] border bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-surface-foreground))] placeholder:text-slate-400 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      hasError: {
        true: "border-[hsl(var(--color-destructive))] focus-visible:ring-[hsl(var(--color-destructive))]",
        false: "border-[hsl(var(--color-border))] focus-visible:ring-[hsl(var(--color-ring))]",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

export type InputVariantProps = VariantProps<typeof inputVariants>;
