import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardProps = {
  variant?: "default" | "hover";
  className?: string;
  children: ReactNode;
};

export function Card({ variant = "default", className, children }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-5 shadow-md",
        variant === "hover" &&
          "transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
