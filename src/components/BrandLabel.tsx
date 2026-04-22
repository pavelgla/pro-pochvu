import { cn } from "@/lib/utils";

type BrandLabelProps = {
  brand: "ecokon" | "tsvetologiya";
  className?: string;
};

const brandConfig = {
  ecokon: {
    label: "ЭКО Конь",
    style: "bg-accent/10 text-accent",
    title: "ЭКО Конь® — зарегистрированная торговая марка",
  },
  tsvetologiya: {
    label: "Цветология",
    style: "bg-accent-deep/10 text-accent-deep",
    title: "Цветология® — зарегистрированная торговая марка",
  },
};

export function BrandLabel({ brand, className }: BrandLabelProps) {
  const config = brandConfig[brand];
  return (
    <span
      title={config.title}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-medium tracking-[0.1em] uppercase",
        config.style,
        className
      )}
    >
      {config.label}<sup className="text-[8px]">®</sup>
    </span>
  );
}
