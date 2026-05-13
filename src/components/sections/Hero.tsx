import Link from "next/link";
import Image from "next/image";
import { Ornament } from "@/components/ui/Ornament";
import { SHOW_TSVETOLOGIYA } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative bg-bg">
      <Ornament
        variant="sprig"
        color="var(--color-accent-light)"
        className="absolute top-10 right-24 opacity-30 hidden lg:block"
      />

      <div className="container-main grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:py-16">
        {/* Text */}
        <div>
          <div className="section-label mb-7">
            <div className="h-px w-10 bg-accent" />
            <span>ВЕСНА 2026 · СЕЗОН ЦВЕТЕНИЯ</span>
          </div>

          <h1 className="font-serif text-5xl font-medium tracking-tight leading-[0.95] md:text-7xl xl:text-[6.5rem]">
            Маркетплейс
            <br />
            для&nbsp;<span className="text-accent">растений.</span>
          </h1>

          <p className="mt-8 max-w-[520px] text-[17px] leading-relaxed text-ink-2">
            Удобрения, грунты и фитомодули от&nbsp;калининградских
            предпринимателей. Бренды «ЭКО&nbsp;Конь» и&nbsp;«Цветология» —
            с&nbsp;2014 года, более 500 000 довольных клиентов.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/catalog?brand=ecokon" className="btn-primary">
              Смотреть удобрения <span className="text-base">→</span>
            </Link>
            {SHOW_TSVETOLOGIYA && (
              <Link href="/catalog?brand=tsvetologiya" className="btn-outline">
                Фитомодули
              </Link>
            )}
          </div>

          {/* Stats strip */}
          <div className="mt-12 flex flex-wrap gap-8 border-t border-line pt-7 text-[13px] text-mute">
            <div>
              <span className="block font-serif text-[22px] font-semibold text-ink">
                500К+
              </span>
              <span className="mt-0.5 block text-[11px]">довольных клиентов</span>
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            <div>
              <span className="block font-serif text-[22px] font-semibold text-ink">
                4.92★
              </span>
              <span className="mt-0.5 block text-[11px]">средняя оценка</span>
            </div>
            <div className="hidden h-8 w-px bg-line sm:block" />
            <div>
              <span className="block font-serif text-[22px] font-semibold text-ink">
                25
              </span>
              <span className="mt-0.5 block text-[11px]">
                собственных разработок
              </span>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-lg bg-bg-soft">
            <Image
              src="/images/ecokon/bio-chay-yantar-fosfor_0.jpg"
              alt="Био-чай ЭКО Конь — органическое удобрение"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Floating product tag */}
          <div className="absolute -bottom-5 -left-5 hidden rounded bg-bg p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] lg:block">
            <div className="text-[9px] tracking-[0.14em] text-accent">
              ХИТ СЕЗОНА
            </div>
            <div className="mt-1.5 max-w-[200px] font-serif text-xl font-medium leading-tight">
              Био-чай с&nbsp;янтарём и&nbsp;фосфором
            </div>
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold text-accent">
                626 ₽
              </span>
              <span className="text-xs text-mute line-through">1 100 ₽</span>
            </div>
          </div>

          {/* Rating badge */}
          <div className="absolute -right-4 top-5 hidden h-24 w-24 flex-col items-center justify-center rounded-full bg-accent text-center text-bg lg:flex">
            <span className="text-[11px] opacity-85">рейтинг</span>
            <span className="mt-0.5 text-[28px] font-semibold">4.92★</span>
            <span className="mt-0.5 text-[9px] tracking-[0.08em] opacity-80">
              OZON
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
