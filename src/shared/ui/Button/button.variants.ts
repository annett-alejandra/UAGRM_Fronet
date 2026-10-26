import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-base)] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#191A7D] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#191A7D] text-white hover:bg-[#2B6CB0] shadow-sm active:scale-[0.99]",
        secondary:
          "bg-[#D31338] text-white hover:bg-[#B70F2F] shadow-sm active:scale-[0.99]",
        destructive:
          "bg-[#D31338] text-white hover:bg-[#B70F2F] shadow-sm active:scale-[0.99]",
        danger:
          "bg-[#D31338] text-white hover:bg-[#B70F2F] shadow-sm active:scale-[0.99]",
        "soft-blue":
          "bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/50 hover:bg-[#C7E5FE]",
        "soft-red":
          "bg-[#FCECEF] text-[#D31338] border border-[#F39E8E]/50 hover:bg-[#F9D5DB]",
        outline:
          "border border-[#E2E8F0] bg-transparent hover:bg-[#F9F9F6] text-[#191A2D]",
        "outline-blue":
          "border border-[#191A7D] bg-transparent text-[#191A7D] hover:bg-[#DAEFFE]/50",
        "outline-red":
          "border border-[#D31338] bg-transparent text-[#D31338] hover:bg-[#FCECEF]/50",
        ghost:
          "hover:bg-[#F9F9F6] text-[#191A2D]",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
