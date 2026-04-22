import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

const variantStyles = {
  success: "bg-success/10 text-success",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-800",
  bestseller: "bg-accent/10 text-accent",
  new: "bg-purple-100 text-purple-800",
  sale: "bg-error/10 text-error",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

type BadgeProps = {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  className?: string;
  children: ReactNode;
};

export function Badge({
  variant = "info",
  size = "sm",
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
