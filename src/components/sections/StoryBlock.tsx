import Image from "next/image";
import { Ornament } from "@/components/ui/Ornament";

const stats = [
  { value: "2012", label: "год основания" },
  { value: "45К+", label: "клиентов" },
  { value: "4.9★", label: "средняя оценка" },
];

export function StoryBlock() {
  return (
    <section className="py-16 lg:py-[120px]">
      <div className="container-main grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden rounded-lg bg-bg-soft">
            <Image
              src="/images/ecokon/bio-chay-yantar-fosfor_0.jpg"
              alt="Ферма КФХ Ранчо Мушкино"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden rounded-lg bg-accent p-7 text-bg lg:block" style={{ width: 200 }}>
            <div className="text-[10px] tracking-[0.14em] opacity-80">
              С 2012 ГОДА
            </div>
            <div className="mt-1.5 font-serif text-5xl font-medium tracking-tight">
              14 лет
            </div>
            <div className="mt-1 text-[13px] leading-snug opacity-90">
              работаем с&nbsp;землёй руками
            </div>
          </div>
        </div>

        {/* Text */}
        <div>
          <div className="section-label mb-5">
            <Ornament variant="divider" />
            <span>ИСТОРИЯ ФЕРМЫ</span>
          </div>

          <h2 className="section-heading">
            Ранчо <span className="text-accent">Мушкино</span>
          </h2>

          <p className="mt-5 max-w-[620px] font-serif text-2xl leading-relaxed text-ink">
            Как проблема превратилась в&nbsp;бизнес-идею
          </p>

          <p className="mt-6 max-w-[620px] text-base leading-relaxed text-ink-2">
            В 2012 мы подумали — что если из того, что обычно пропадает
            на&nbsp;ферме, сделать лучшее удобрение страны? Через год — первая
            партия био-чая на Ozon. Через двенадцать — два бренда, 45 000
            постоянных клиентов и собственные фитостены в&nbsp;сотне интерьеров.
            Мы по-прежнему фасуем руками и знаем каждую партию.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-[40px] font-medium leading-none tracking-tight text-accent">
                  {s.value}
                </div>
                <div className="mt-2 text-xs text-ink-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
