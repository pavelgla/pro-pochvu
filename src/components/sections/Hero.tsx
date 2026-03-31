import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-brand-cream to-white">
      <div className="container-main grid items-center gap-8 py-12 md:grid-cols-2 md:py-20">
        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-brand-gray-dark md:text-5xl xl:text-6xl">
            Органические удобрения и вертикальные сады{" "}
            <span className="text-brand-green">для вашего дома</span>
          </h1>
          <p className="text-lg text-brand-gray-dark/70 md:text-xl">
            Более 45 000 довольных клиентов. Доставка по всей России от 99&nbsp;₽
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/catalog/udobreniya">
              <Button size="lg">Удобрения →</Button>
            </Link>
            <Link href="/catalog/vertikalnoe-ozelenenie">
              <Button variant="secondary" size="lg">
                Фитомодули →
              </Button>
            </Link>
          </div>
        </div>

        {/* Image placeholder */}
        <div className="flex items-center justify-center">
          <div className="aspect-square w-full max-w-md rounded-3xl bg-brand-green/5 flex items-center justify-center">
            <span className="text-6xl">🌿</span>
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="border-y border-brand-gray-light bg-white/80">
        <div className="container-main flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-sm text-brand-gray-dark/70">
          <span>⭐ 4.9 на Ozon</span>
          <span className="hidden sm:inline">•</span>
          <span>45 000+ отзывов</span>
          <span className="hidden sm:inline">•</span>
          <span>Доставка от 99&nbsp;₽</span>
          <span className="hidden sm:inline">•</span>
          <span>♻️ Экологично</span>
        </div>
      </div>
    </section>
  );
}
