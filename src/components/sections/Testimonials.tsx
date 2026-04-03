import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Наташа К.",
    rating: 5,
    text: "Пользуюсь Bio-чаем уже полгода — орхидеи просто расцвели! Заказала ещё.",
  },
  {
    name: "Марина П.",
    rating: 5,
    text: "Фитомодуль белый — просто чудо! Сделала целую стену из цветов в гостиной.",
  },
  {
    name: "Галина В.",
    rating: 5,
    text: "Удобрение для корневой системы — спасла любимый фикус после пересадки. Спасибо!",
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

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl bg-white p-5 shadow-sm"
            >
              <Stars count={t.rating} />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-gray-dark/80">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 border-t border-brand-gray-light pt-3">
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
