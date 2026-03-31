"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

const variants = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green/90 active:bg-brand-green/80",
  secondary:
    "border-2 border-brand-green text-brand-green hover:bg-brand-green/5 active:bg-brand-green/10",
  ghost:
    "text-brand-gray-dark hover:bg-brand-gray-light active:bg-brand-gray-light/80",
  disabled: "bg-brand-gray-light text-brand-gray-dark/40 cursor-not-allowed",
};

const sizes = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-base rounded-xl",
  lg: "h-13 px-7 text-lg rounded-xl",
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
