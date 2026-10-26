import { cva, type VariantProps } from "class-variance-authority";

export const selectVariants = cva(
  "flex h-10 w-full rounded-[var(--radius-base)] border bg-[hsl(var(--color-surface))] px-3 py-2 text-sm text-[hsl(var(--color-surface-foreground))] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

export type SelectVariantProps = VariantProps<typeof selectVariants>;
