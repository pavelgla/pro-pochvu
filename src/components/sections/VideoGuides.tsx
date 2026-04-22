import Link from "next/link";
import Image from "next/image";
import { Ornament } from "@/components/ui/Ornament";

const videos = [
  {
    title: "Как пересадить орхидею",
    duration: "8 минут",
    tag: "Базовое",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    href: "/knowledge-base/video",
  },
  {
    title: "Биочай для фиалок — дозировка",
    duration: "4 минуты",
    tag: "Подкормка",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    href: "/knowledge-base/video",
  },
  {
    title: "Монтаж фитомодуля за час",
    duration: "12 минут",
    tag: "Цветология",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    href: "/knowledge-base/video",
  },
  {
    title: "Сезонный уход. Весна",
    duration: "6 минут",
    tag: "Сезон",
    image: "/images/ecokon/bio-chay-yantar-fosfor_0.jpg",
    href: "/knowledge-base/video",
  },
];

export function VideoGuides() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-main">
        {/* Header */}
        <div className="mb-12">
          <div className="section-label mb-5">
            <Ornament variant="divider" />
            <span>ГИД ПО УХОДУ</span>
          </div>
          <h2 className="section-heading">
            Видео-инструкции
            <br />
            от <span className="text-accent">агронома фермы</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((v) => (
            <Link
              key={v.title}
              href={v.href}
              className="group"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bg-soft">
                <Image
                  src={v.image}
                  alt={v.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[rgba(28,32,24,0.25)]" />
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg transition-transform group-hover:scale-110">
                    <svg width="16" height="18" viewBox="0 0 16 18">
                      <path d="M2 2L14 9L2 16Z" fill="#5a6b3a" />
                    </svg>
                  </div>
                </div>
                {/* Tag */}
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] tracking-[0.1em]">
                  {v.tag.toUpperCase()}
                </span>
                {/* Duration */}
                <span className="absolute bottom-3 right-3 rounded-full bg-[rgba(28,32,24,0.85)] px-2.5 py-1 text-[11px] text-bg">
                  {v.duration}
                </span>
              </div>
              <h3 className="mt-3.5 font-serif text-lg font-medium leading-snug tracking-tight">
                {v.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
