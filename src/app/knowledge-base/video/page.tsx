import type { Metadata } from "next";
import Link from "next/link";
import { VideoPlayer } from "@/components/VideoPlayer";

export const metadata: Metadata = {
  title: "Видеоинструкции по применению удобрений | Пропочву",
  description:
    "Видеоинструкции: как заварить и применять био-чай ЭКО Конь, как пользоваться фитомодулями Цветология.",
  alternates: { canonical: "https://pro-pochvu.ru/knowledge-base/video" },
};

// Videos are served by proxy-nginx from /opt/ecokon/videos on sel1 (not in the repo).
// Only list files that actually exist there — see deploy/videos/README.md.
const videos = [
  {
    title: "Инструкция: как заварить био-чай ЭКО Конь",
    description:
      "Один пакетик заливаем 1,5 литрами воды около 50 °C и настаиваем от двух часов до ночи. Поливаем так, чтобы промок весь ком земли, весной и летом — раз в 20 дней. Осенью пакетик заваривают на 3 литра. Использованный пакетик с перепревшим конским перегноем можно высыпать или закопать в горшок.",
    src: "/videos/bio-chay-yantar-fosfor-instruction.mp4",
    productSlug: "bio-chay-yantar-fosfor",
    productName: "Био-чай Янтарный с фосфором",
  },
  {
    title: "Фитомодули Цветология — инструкция",
    description:
      "Как устроена и как используется модульная система фитильного полива Цветология: для комнатных растений, балконного огорода и пряных трав.",
    src: "/videos/fitomodul-instruction.mp4",
    productSlug: "fitomodul-50-4-green",
    productName: "Фитомодуль Цветология",
  },
];

export default function VideoInstructionsPage() {
  return (
    <div className="container-main section-padding">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Видеоинструкции
        </h1>
        <p className="text-lg text-gray-500">
          Как правильно применять удобрения и фитомодули — смотрите наши видеоруководства
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <div key={video.src} className="space-y-2">
            <VideoPlayer src={video.src} title={video.title} />
            <h2 className="text-sm font-semibold text-gray-900">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {video.description}
              </p>
            )}
            {video.productSlug && (
              <Link
                href={`/product/${video.productSlug}`}
                className="inline-block text-sm text-green-700 hover:text-green-800 hover:underline"
              >
                {video.productName} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
