import Link from "next/link";
import { Button } from "@/components/ui/Button";

const lines = [
  {
    title: "ЭКО Конь",
    subtitle: "Органические удобрения",
    description:
      "Био-чай в стиках, специализированные составы для разных культур, экологичные грунты. На основе конского компоста — безопасно для детей и животных.",
    sublines: ["Био-чай", "Специализированные", "Грунты"],
    href: "/catalog/udobreniya",
    accent: "border-ecokon",
    accentBg: "bg-ecokon/5",
    accentText: "text-ecokon",
    emoji: "🌱",
  },
  {
    title: "Цветология",
    subtitle: "Вертикальное озеленение",
    description:
      "Фитомодули для стен и пола, аксессуары для зелёных интерьеров. Из переработанного пластика — озеленяйте с заботой о планете.",
    sublines: ["Фитомодули", "Аксессуары"],
    href: "/catalog/vertikalnoe-ozelenenie",
    accent: "border-tsvetologiya",
    accentBg: "bg-tsvetologiya/5",
    accentText: "text-tsvetologiya",
    emoji: "🏡",
  },
];

export function ProductLines() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <h2 className="mb-8 text-center">Наши продукты</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {lines.map((line) => (
            <div
              key={line.title}
              className={`rounded-2xl border-2 ${line.accent} ${line.accentBg} p-6 md:p-8`}
            >
              {/* Image placeholder */}
              <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-white/60">
                <span className="text-7xl">{line.emoji}</span>
              </div>

              <h3 className={line.accentText}>{line.title}</h3>
              <p className="mt-1 text-sm font-medium text-brand-gray-dark/60">
                {line.subtitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray-dark/70">
                {line.description}
              </p>

              {/* Sub-lines */}
              <div className="mt-4 flex flex-wrap gap-2">
                {line.sublines.map((sub) => (
                  <span
                    key={sub}
                    className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-gray-dark/70"
                  >
                    {sub}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <Link href={line.href}>
                  <Button variant="secondary" className={line.accentText}>
                    Перейти →
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
