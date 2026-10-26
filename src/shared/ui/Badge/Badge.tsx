import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "./badge.variants";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  variant?: "neutral" | "success" | "warning" | "danger";
}

export function Badge({ className, status, variant, ...props }: BadgeProps) {
  const activeStatus = status || variant || "neutral";
  return <div className={badgeVariants({ status: activeStatus, className })} {...props} />;
}
