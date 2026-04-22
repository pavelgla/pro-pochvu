import Link from "next/link";
import Image from "next/image";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

const brands = [
  {
    name: "ЭКО Конь",
    tag: "Бренд №1",
    subtitle: "Удобрения и грунты",
    description:
      "Био-чай, гранулы, готовые смеси — ферментированная органика из конского навоза, обогащённая микроэлементами по рецептам семьи Мушкиных.",
    href: "/catalog?brand=ecokon",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    fromPrice: "399",
    brandKey: "ecokon" as const,
  },
  {
    name: "Цветология",
    tag: "Бренд №2",
    subtitle: "Фитомодули и сады",
    description:
      "Живые картины из растений — каждый модуль собираем вручную, подбираем растения под ваш интерьер и уровень освещения.",
    href: "/catalog?brand=tsvetologiya",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    fromPrice: "890",
    brandKey: "tsvetologiya" as const,
  },
];

export function BrandSplit() {
  const visibleBrands = SHOW_TSVETOLOGIYA
    ? brands
    : brands.filter((b) => b.brandKey !== "tsvetologiya");

  return (
    <section className="px-4 pb-12 md:px-6 xl:px-12 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div
          className={`grid gap-6 ${
            visibleBrands.length > 1 ? "lg:grid-cols-2" : "lg:grid-cols-1"
          }`}
        >
          {visibleBrands.map((b) => (
            <Link
              key={b.name}
              href={b.href}
              className="group relative flex min-h-[480px] overflow-hidden rounded-lg lg:min-h-[540px]"
            >
              <Image
                src={b.image}
                alt={b.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,32,24,0.85)] via-[rgba(28,32,24,0.3)] to-transparent" />

              <div className="relative z-10 flex flex-1 flex-col justify-between p-8 text-bg lg:p-10">
                <span className="self-start rounded-full bg-white/15 px-3 py-1.5 text-[10px] tracking-[0.18em] backdrop-blur-[10px]">
                  {b.tag.toUpperCase()}
                </span>

                <div>
                  <div className="font-serif text-4xl font-medium tracking-tight lg:text-[56px] lg:leading-none">
                    {b.name}
                  </div>
                  <div className="mt-2 text-[15px] opacity-85">
                    {b.subtitle}
                  </div>
                  <p className="mt-5 max-w-[420px] text-sm leading-relaxed opacity-90">
                    {b.description}
                  </p>
                  <div className="mt-7 flex items-center gap-3.5">
                    <span className="rounded-full bg-bg px-6 py-3.5 text-[13px] font-medium text-ink transition-colors group-hover:bg-accent group-hover:text-bg">
                      Открыть коллекцию →
                    </span>
                    <span className="text-[11px] tracking-[0.1em] opacity-70">
                      ОТ {b.fromPrice} ₽
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
