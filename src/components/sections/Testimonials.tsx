import { Ornament } from "@/components/ui/Ornament";

const reviews = [
  {
    name: "Наташа К.",
    city: "Москва",
    rating: 5,
    text: "Пользуюсь Bio-чаем уже полгода — орхидеи просто расцвели! Заказала ещё набор для рассады.",
    product: "Био-чай Янтарь",
    verified: "Ozon",
    when: "Март 2026",
    featured: false,
  },
  {
    name: "Марина П.",
    city: "Санкт-Петербург",
    rating: 5,
    text: "Фитомодуль белый — просто чудо! Сделала целую стену из цветов в гостиной. Мужу тоже понравилось, хотя он был скептически настроен. Растения прижились за неделю!",
    product: "Фитомодуль 3 кармана",
    verified: "Wildberries",
    when: "Февраль 2026",
    featured: true,
  },
  {
    name: "Галина В.",
    city: "Калининград",
    rating: 5,
    text: "Удобрение для корневой системы — спасла любимый фикус после пересадки. Спасибо!",
    product: "Корнепитатель",
    verified: "Ozon",
    when: "Январь 2026",
    featured: false,
  },
  {
    name: "Алёна С.",
    city: "Краснодар",
    rating: 5,
    text: "Третий раз заказываю Био-чай. Все растения довольны, особенно фиалки.",
    product: "Био-чай",
    verified: "Ozon",
    when: "Март 2026",
    featured: false,
  },
  {
    name: "Олег М.",
    city: "Новосибирск",
    rating: 5,
    text: "Подарил жене фитомодуль — теперь вся квартира в зелени. Отличное качество!",
    product: "Фитомодуль 5 карманов",
    verified: "Wildberries",
    when: "Декабрь 2025",
    featured: false,
  },
  {
    name: "Ирина Д.",
    city: "Екатеринбург",
    rating: 5,
    text: "Грунт отличный, растения сразу пошли в рост. Рекомендую!",
    product: "Грунт ЭКО Конь",
    verified: "Ozon",
    when: "Февраль 2026",
    featured: false,
  },
];

export function Testimonials() {
  return (
    <section className="bg-bg-dark py-16 text-cream lg:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="section-label mb-5 justify-center">
            <Ornament variant="divider" color="var(--color-accent-light)" />
            <span className="text-accent-light">51 000+ ОТЗЫВОВ</span>
            <Ornament variant="divider" color="var(--color-accent-light)" />
          </div>
          <h2 className="section-heading text-cream">
            Те, у кого <span className="text-accent-light">всё зацвело</span>
          </h2>
        </div>

        {/* Reviews grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`rounded-lg border border-white/8 bg-white/[0.04] p-8 backdrop-blur-[10px] ${
                r.featured ? "sm:row-span-2" : ""
              }`}
            >
              <div className="mb-3.5 text-[10px] tracking-[0.12em] text-accent-light">
                ✓ {r.verified.toUpperCase()} · {r.when.toUpperCase()}
              </div>
              <div className="text-sm text-accent-light">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </div>
              <p
                className={`mt-4 mb-5 leading-relaxed text-cream ${
                  r.featured
                    ? "font-serif text-2xl"
                    : "font-serif text-lg"
                }`}
              >
                {r.text}
              </p>
              <div className="flex items-center gap-3 border-t border-white/10 pt-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-serif text-base text-bg">
                  {r.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium">{r.name}</div>
                  <div className="text-[11px] text-cream/60">{r.city}</div>
                </div>
                <div className="text-right text-[11px] text-accent-light">
                  {r.product}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://www.ozon.ru/seller/eko-kon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-9 py-4 text-[13px] font-medium text-cream transition-colors hover:border-cream/60"
          >
            Читать все отзывы на Ozon →
          </a>
        </div>
      </div>
    </section>
  );
}
