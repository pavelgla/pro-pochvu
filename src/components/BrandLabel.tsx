import { cn } from "@/lib/utils";

type BrandLabelProps = {
  brand: "ecokon" | "tsvetologiya";
  className?: string;
};

const brandConfig = {
  ecokon: {
    label: "ЭКО Конь",
    style: "bg-ecokon/10 text-ecokon",
  },
  tsvetologiya: {
    label: "Цветология",
    style: "bg-tsvetologiya/10 text-tsvetologiya",
  },
};

export function BrandLabel({ brand, className }: BrandLabelProps) {
  const config = brandConfig[brand];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        config.style,
        className
      )}
    >
      {config.label}
    </span>
  );
}
