import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    name: "Фитомодули",
    subtitle: "Вертикальное озеленение",
    description:
      "Модульные системы для живого интерьера. Для дома, офиса, ресторана — собираем вручную, подбираем растения под ваш интерьер.",
    href: "/catalog?brand=tsvetologiya",
    image: "/images/tsvetologiya/fitomodul-50-4-white_0.jpg",
    fromPrice: "890",
  },
  {
    name: "Грунты",
    subtitle: "Субстраты и почвосмеси",
    description:
      "Специальные субстраты для разных видов растений. Правильный грунт — залог здоровой корневой системы.",
    href: "/catalog?category=grunty-substraty",
    image: "/images/ozon/grunt-ecokon-20l_1.jpg",
    fromPrice: "299",
  },
  {
    name: "Удобрения",
    subtitle: "Органические подкормки",
    description:
      "Био-чай, гранулы, готовые смеси — ферментированная органика из конского навоза. 51 000+ отзывов, 4.92 на маркетплейсах.",
    href: "/catalog?brand=ecokon",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    fromPrice: "399",
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
              className="group relative flex min-h-[380px] overflow-hidden rounded-lg lg:min-h-[440px]"
            >
              <Image
                src={b.image}
                alt={b.name}
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,32,24,0.85)] via-[rgba(28,32,24,0.3)] to-transparent" />

              <div className="relative z-10 flex flex-1 flex-col justify-end p-8 text-bg lg:p-10">
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
