const benefits = [
  { icon: "♻", title: "Органический состав", description: "100% без химии" },
  { icon: "★", title: "4.92 на маркетплейсах", description: "51 000+ отзывов" },
  { icon: "🌱", title: "Прямо с фермы", description: "Производитель без посредников" },
  { icon: "✓", title: "Результат за 2 недели", description: "Проверено на 500 000+ растений" },
];

export function Benefits() {
  return (
    <section className="px-4 pb-12 md:px-6 xl:px-12 lg:pb-18">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 rounded-lg bg-bg-soft lg:grid-cols-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className={`flex items-center gap-4 px-5 py-6 lg:px-7 ${
                i > 0 ? "border-l border-line" : ""
              }`}
            >
              <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-bg font-serif text-xl text-accent">
                {b.icon}
              </div>
              <div>
                <div className="font-serif text-base font-medium tracking-tight lg:text-[17px]">
                  {b.title}
                </div>
                <div className="mt-0.5 text-xs text-ink-2">{b.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
