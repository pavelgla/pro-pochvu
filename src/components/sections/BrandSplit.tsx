import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Фитомодули",
    subtitle: "Вертикальное озеленение",
    description:
      "Модульные системы для живого интерьера. Для дома, офиса, ресторана — собираем вручную, подбираем растения под ваш интерьер.",
    href: "/catalog?brand=tsvetologiya",
    image: "/images/main/tile-fitomoduli.webp",
    alt: "Фитомодуль с каскадом комнатных растений на стене",
    fromPrice: "890",
  },
  {
    name: "Удобрения",
    subtitle: "Органические подкормки",
    description:
      "Био-чай, гранулы, готовые смеси — ферментированная органика из конского навоза. 51 000+ отзывов, 4.92 на маркетплейсах.",
    href: "/catalog?brand=ecokon",
    image: "/images/main/tile-udobreniya.webp",
    alt: "Коробка био-чая ЭКО Конь «Огород на окне» с фильтр-пакетами",
    fromPrice: "399",
  },
  {
    name: "Грунты",
    subtitle: "Субстраты и почвосмеси",
    description:
      "Специальные субстраты для разных видов растений. Правильный грунт — залог здоровой корневой системы.",
    href: "/catalog?category=grunty-substraty",
    image: "/images/main/tile-grunty.webp",
    alt: "Пакет органического грунта «Цветология» среди комнатных растений",
    fromPrice: "299",
  },
];

export function BrandSplit() {
  return (
    <section className="px-4 pb-12 md:px-6 xl:px-12 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-3">
          {categories.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group flex flex-col overflow-hidden rounded-lg bg-bg-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={b.image}
                  alt={b.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>

              <div className="flex flex-1 flex-col px-8 py-7 lg:px-10 lg:py-8">
                <div className="font-serif text-4xl font-medium tracking-tight text-ink lg:text-[52px] lg:leading-none">
                  {b.name}
                </div>
                <div className="mt-2 text-[15px] text-ink/70">{b.subtitle}</div>
                <p className="mt-5 max-w-[420px] text-sm leading-relaxed text-ink/80">
                  {b.description}
                </p>
                <div className="mt-auto flex items-center gap-3.5 pt-7">
                  <span className="rounded-full bg-ink px-6 py-3.5 text-[13px] font-medium text-bg transition-colors group-hover:bg-accent group-hover:text-bg">
                    Открыть коллекцию →
                  </span>
                  <span className="text-[11px] tracking-[0.1em] text-ink/60">
                    ОТ {b.fromPrice} ₽
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
