"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const variants = {
  primary:
    "bg-ink text-bg hover:bg-accent active:bg-accent-deep",
  secondary:
    "border border-ink text-ink hover:bg-ink hover:text-bg active:bg-accent",
  ghost:
    "text-ink hover:bg-bg-soft active:bg-bg-soft/80",
  disabled: "bg-bg-soft text-mute cursor-not-allowed",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-full",
  md: "h-11 px-5 text-base rounded-full",
  lg: "h-13 px-7 text-lg rounded-full",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
  asChild?: boolean;
  children: ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const v = isDisabled ? "disabled" : variant;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors touch-target",
          variants[v],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
