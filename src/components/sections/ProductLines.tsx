import Link from "next/link";
import { Button } from "@/components/ui/Button";

const lines = [
  {
    title: "ЭКО Конь",
    description:
      "Органические удобрения на основе конского навоза. Для комнатных, садовых и огородных растений.",
    href: "/catalog?brand=ecokon",
    bg: "bg-green-50",
    emoji: "🌿",
    buttonLabel: "Смотреть удобрения",
  },
  {
    title: "Цветология",
    description:
      "Модульные системы вертикального озеленения. Для дома, офиса, ресторана.",
    href: "/catalog?brand=tsvetologiya",
    bg: "bg-slate-50",
    emoji: "🌱",
    buttonLabel: "Смотреть фитомодули",
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
              className={`rounded-2xl ${line.bg} p-6 md:p-8`}
            >
              <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-white/60">
                <span className="text-7xl">{line.emoji}</span>
              </div>

              <h3 className="text-brand-gray-dark">{line.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-gray-dark/70">
                {line.description}
              </p>

              <div className="mt-6">
                <Link href={line.href}>
                  <Button variant="secondary">{line.buttonLabel} →</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
