"use client";

import { useState } from "react";
import { Ornament } from "@/components/ui/Ornament";

const calendar = [
  { month: "Январь", short: "ЯНВ", tasks: ["Период покоя", "Минимальный полив", "Увлажнение воздуха"] },
  { month: "Февраль", short: "ФЕВ", tasks: ["Досветка рассады", "Подготовка грунта", "Планирование посадок"] },
  { month: "Март", short: "МАР", tasks: ["Первые подкормки", "Пересадка растений", "Черенкование"] },
  { month: "Апрель", short: "АПР", tasks: ["Пересадка в свежий грунт", "Биочай каждые 2 недели", "Стимуляция бутонов"] },
  { month: "Май", short: "МАЙ", tasks: ["Активная подкормка", "Вынос на балкон", "Обработка от вредителей"] },
  { month: "Июнь", short: "ИЮН", tasks: ["Пик цветения", "Подкормка цветущих", "Притенение от солнца"] },
  { month: "Июль", short: "ИЮЛ", tasks: ["Обильный полив", "Опрыскивание листвы", "Подкормка суккулентов"] },
  { month: "Август", short: "АВГ", tasks: ["Последние пересадки", "Подготовка к осени", "Укоренение черенков"] },
  { month: "Сентябрь", short: "СЕН", tasks: ["Сокращение полива", "Возврат с балкона", "Осенняя подкормка"] },
  { month: "Октябрь", short: "ОКТ", tasks: ["Профилактика болезней", "Обрезка", "Подготовка к покою"] },
  { month: "Ноябрь", short: "НОЯ", tasks: ["Минимум подкормок", "Контроль влажности", "Проверка вредителей"] },
  { month: "Декабрь", short: "ДЕК", tasks: ["Период покоя", "Досветка", "Умеренный полив"] },
];

const descriptions = [
  "Время активного роста — пересаживайте растения в свежий грунт ЭКО Конь.",
  "Биочай каждые 2 недели. Разводить 5 мл на литр воды.",
  "Янтарная кислота ускоряет закладку бутонов для пышного цветения летом.",
];

export function SeasonCalendar() {
  const currentMonth = new Date().getMonth();
  const [active, setActive] = useState(currentMonth);

  return (
    <section className="bg-bg-soft py-16 lg:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="mb-14 text-center">
          <div className="section-label mb-5 justify-center">
            <Ornament variant="divider" />
            <span>СЕЗОННЫЙ КАЛЕНДАРЬ</span>
            <Ornament variant="divider" />
          </div>
          <h2 className="section-heading">
            Что делать <span className="text-accent">прямо сейчас</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-[15px] leading-relaxed text-ink-2">
            {calendar[active].month} — время действовать. Выбирайте месяц и смотрите рекомендации.
          </p>
        </div>

        {/* Month grid */}
        <div className="mb-10 grid grid-cols-4 gap-1 sm:grid-cols-6 lg:grid-cols-12">
          {calendar.map((m, i) => (
            <button
              key={m.month}
              onClick={() => setActive(i)}
              className={`rounded-md px-3 py-4 text-left transition-all ${
                i === active
                  ? "bg-ink text-bg"
                  : "border border-line bg-bg hover:border-ink/20"
              }`}
            >
              <div
                className={`text-[9px] tracking-[0.14em] ${
                  i === active ? "text-accent-light" : "text-mute"
                }`}
              >
                {m.short}
              </div>
              <div className="mt-1 font-serif text-lg font-medium tracking-tight">
                {m.month.slice(0, 3)}.
              </div>
              {i === active && (
                <div className="mt-1.5 text-[10px] opacity-80">Сейчас</div>
              )}
            </button>
          ))}
        </div>

        {/* Task cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calendar[active].tasks.map((task, i) => (
            <div
              key={task}
              className="rounded-lg border border-line bg-bg p-7"
            >
              <div className="font-serif text-[40px] font-normal text-accent leading-none">
                0{i + 1}
              </div>
              <div className="mt-3.5 font-serif text-[22px] font-medium tracking-tight">
                {task}
              </div>
              <p className="mt-2.5 text-[13px] leading-relaxed text-ink-2">
                {descriptions[i] || "Следуйте календарю ухода для здоровых и красивых растений."}
              </p>
              <div className="mt-5 flex items-center gap-2 text-[11px] tracking-[0.08em] text-accent">
                ПОДОБРАТЬ ТОВАРЫ →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
