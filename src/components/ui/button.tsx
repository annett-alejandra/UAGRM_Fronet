import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#003366] disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-xs',
  {
    variants: {
      variant: {
        default: 'bg-[#003366] text-white hover:bg-[#002244] border border-[#003366]',
        destructive: 'bg-[#C51D24] text-white hover:bg-[#a3151b] border border-[#C51D24]',
        outline: 'border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-slate-100',
        secondary: 'bg-slate-100 text-[#003366] hover:bg-slate-200 border border-[#E2E8F0]',
        ghost: 'text-[#1E293B] hover:bg-slate-100 hover:text-[#003366]',
        link: 'text-[#003366] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-[11px]',
        lg: 'h-11 rounded-xl px-6 text-sm',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
