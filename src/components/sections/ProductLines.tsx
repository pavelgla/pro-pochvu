import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const lines = [
  {
    title: "ЭКО Конь",
    description:
      "Органические удобрения на основе конского навоза. Для комнатных, садовых и огородных растений.",
    href: "/catalog?brand=ecokon",
    bg: "bg-green-50",
    image: "/images/ozon/bio-chay-yantar-fosfor_2.jpg",
    buttonLabel: "Смотреть удобрения",
  },
  {
    title: "Цветология",
    description:
      "Модульные системы вертикального озеленения. Для дома, офиса, ресторана.",
    href: "/catalog?brand=tsvetologiya",
    bg: "bg-slate-50",
    image: "/images/ozon/fitomodul-50-4-white_1.jpg",
    buttonLabel: "Смотреть фитомодули",
  },
];

export function ProductLines() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <h2 className="mb-8 text-center">Наши продукты</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {lines.filter((line) => SHOW_TSVETOLOGIYA || line.title !== "Цветология").map((line) => (
            <div
              key={line.title}
              className={`rounded-2xl ${line.bg} p-6 md:p-8`}
            >
              <div className="mb-6 overflow-hidden rounded-xl bg-white/60 h-48 relative">
                <Image
                  src={line.image}
                  alt={line.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <h3 className="text-ink">{line.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
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
