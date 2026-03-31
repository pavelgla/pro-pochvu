"use client";

import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
};

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      className={cn("flex gap-1 border-b border-brand-gray-light", className)}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative px-4 py-3 text-sm font-medium transition-colors touch-target",
            activeTab === tab.id
              ? "text-brand-green"
              : "text-brand-gray-dark/60 hover:text-brand-gray-dark"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green" />
          )}
        </button>
      ))}
    </div>
  );
}
