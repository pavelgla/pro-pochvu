import { Star } from "lucide-react";

type Testimonial = {
  name: string;
  rating: number;
  text: string;
  source: string;
  date: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Елена М.",
    rating: 5,
    text: "Био-чай с янтарём — просто волшебство! Мои фиалки зацвели через 2 недели после первого применения. Очень удобный формат стиков, не нужно ничего отмерять.",
    source: "Ozon",
    date: "12 марта 2026",
  },
  {
    name: "Алексей К.",
    rating: 5,
    text: "Заказываю для укрепления корней уже третий раз. Пересадил монстеру — она даже не заметила! Корни мощные, листья не поникли. Рекомендую всем.",
    source: "Wildberries",
    date: "8 марта 2026",
  },
  {
    name: "Ирина С.",
    rating: 5,
    text: "Фитомодуль на 3 кармана — идеально для кухни! Посадила базилик, мяту и петрушку. Выглядит стильно, поливать удобно. Мужу тоже понравилось.",
    source: "Ozon",
    date: "2 марта 2026",
  },
  {
    name: "Дмитрий В.",
    rating: 4,
    text: "Удобрение для овощей использую на даче. Томаты в этом сезоне крупнее обычного. Единственное — хотелось бы упаковку побольше для садоводов.",
    source: "Wildberries",
    date: "25 февраля 2026",
  },
  {
    name: "Марина Т.",
    rating: 5,
    text: "Купила био-чай для орхидей по совету подруги. Две орхидеи, которые не цвели год, выпустили цветоносы! Состав натуральный, запах приятный, земляной.",
    source: "Ozon",
    date: "18 февраля 2026",
  },
  {
    name: "Олег Н.",
    rating: 5,
    text: "Установил напольный фитомодуль в офис. Коллеги в восторге! Зелёная стена отлично зонирует пространство и создаёт уют. Монтаж занял 15 минут.",
    source: "Ozon",
    date: "10 февраля 2026",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count
              ? "fill-yellow-400 text-yellow-400"
              : "fill-brand-gray-light text-brand-gray-light"
          }`}
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="section-padding bg-brand-gray-light/50">
      <div className="container-main">
        <h2 className="mb-8 text-center">Отзывы наших клиентов</h2>

        {/* Mobile: horizontal scroll. Desktop: grid */}
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex w-72 shrink-0 flex-col rounded-2xl bg-white p-5 shadow-sm md:w-auto"
            >
              <div className="flex items-center justify-between">
                <Stars count={t.rating} />
                <span className="text-xs text-brand-gray-dark/40">
                  {t.source}
                </span>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-gray-dark/80">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-brand-gray-light pt-3">
                <span className="text-sm font-medium">{t.name}</span>
                <span className="text-xs text-brand-gray-dark/40">
                  {t.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
