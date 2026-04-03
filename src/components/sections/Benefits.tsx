const benefits = [
  {
    emoji: "♻️",
    title: "Органический состав",
    description: "100% натуральные компоненты без химии",
  },
  {
    emoji: "⭐",
    title: "4.9 на маркетплейсах",
    description: "51 000+ проверенных отзывов",
  },
  {
    emoji: "🚚",
    title: "Доставка по России",
    description: "5Post, Boxberry, СДЭК, Почта России",
  },
  {
    emoji: "🔄",
    title: "Лёгкий возврат",
    description: "Вернём деньги если не подойдёт",
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
                <span className="text-2xl">{benefit.emoji}</span>
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
