import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helper?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-brand-gray-dark"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 rounded-xl border border-brand-gray-light bg-white px-4 text-base transition-colors",
            "placeholder:text-brand-gray-dark/40",
            "focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-error">{error}</p>}
        {!error && helper && (
          <p className="text-xs text-brand-gray-dark/60">{helper}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
