import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-mono font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#1B7A43]/10 text-[#1B7A43]',
        secondary: 'border-transparent bg-slate-100 text-[#1E293B]',
        destructive: 'border-transparent bg-[#C51D24]/10 text-[#C51D24]',
        outline: 'border-[#E2E8F0] text-[#64748B]',
        uagrm: 'border-[#E5A823] bg-[#E5A823]/10 text-[#003366]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
