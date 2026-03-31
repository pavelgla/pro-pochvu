import { Leaf, Star, Truck, Recycle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: Leaf,
    title: "Органический состав",
    description: "Без химии. Безопасно для детей и животных",
  },
  {
    icon: Star,
    title: "45 000+ отзывов",
    description: "Средний рейтинг 4.9 на маркетплейсах",
  },
  {
    icon: Truck,
    title: "Доставка от 99 ₽",
    description: "4 службы доставки по всей России",
  },
  {
    icon: Recycle,
    title: "Эко-упаковка",
    description: "Перерабатываемые материалы",
  },
];

export function Benefits() {
  return (
    <section className="section-padding">
      <div className="container-main">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center rounded-2xl bg-brand-cream/50 p-6 text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10">
                <benefit.icon className="h-7 w-7 text-brand-green" />
              </div>
              <h4 className="text-base font-bold">{benefit.title}</h4>
              <p className="mt-2 text-sm text-brand-gray-dark/60">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
