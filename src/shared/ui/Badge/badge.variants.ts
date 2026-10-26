import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none select-none",
  {
    variants: {
      status: {
        primary: "bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60",
        blue: "bg-[#DAEFFE] text-[#191A7D] border border-[#85BDEF]/60",
        secondary: "bg-[#FCECEF] text-[#D31338] border border-[#F39E8E]/60",
        red: "bg-[#FCECEF] text-[#D31338] border border-[#F39E8E]/60",
        melocoton: "bg-[#FFF5F2] text-[#B9381E] border border-[#F08C6E]/60",
        neutral: "bg-[#F9F9F6] text-[#191A2D] border border-[#E2E8F0]",
        success: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        warning: "bg-[#FFF5F2] text-[#B9381E] border border-[#F08C6E]/60",
        danger: "bg-[#FCECEF] text-[#D31338] border border-[#F39E8E]/60",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;
