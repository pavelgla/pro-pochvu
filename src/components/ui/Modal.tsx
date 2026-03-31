"use client";

import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl",
          "animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-bold">{title}</h3>}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-brand-gray-dark/60 transition-colors hover:bg-brand-gray-light hover:text-brand-gray-dark touch-target"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
