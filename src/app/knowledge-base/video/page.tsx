import type { Metadata } from "next";
import Link from "next/link";
import { VideoPlayer } from "@/components/VideoPlayer";

export const metadata: Metadata = {
  title: "Видеоинструкции по применению удобрений | Пропочву",
  description:
    "Видеоинструкции по применению органических удобрений ЭКО Конь: гранулы, био-чаи, подкормки для орхидей и декоративных растений.",
  alternates: { canonical: "https://pro-pochvu.ru/knowledge-base/video" },
};

const videos = [
  {
    title: "Инструкция: био-чай с ЭМ для корневой подкормки",
    src: "/videos/udobrenie-kornevaya-instruction.mp4",
    productSlug: "udobrenie-kornevaya",
    productName: "Удобрение для корневой подкормки",
  },
  {
    title: "Инструкция: био-чай Янтарный с фосфором",
    src: "/videos/bio-chay-yantar-fosfor-instruction.mp4",
    productSlug: "bio-chay-yantar-fosfor",
    productName: "Био-чай Янтарный с фосфором",
  },
  {
    title: "Инструкция: био-чай для декоративно-лиственных",
    src: "/videos/bio-chay-dekorativno-listvennye-instruction.mp4",
    productSlug: "bio-chay-dekorativno-listvennye",
    productName: "Био-чай для декоративно-лиственных",
  },
  {
    title: "Инструкция: био-чай для орхидей",
    src: "/videos/bio-chay-orhidei-instruction.mp4",
    productSlug: "bio-chay-orhidei",
    productName: "Био-чай для орхидей",
  },
  {
    title: "Гранулированное удобрение ЭКО Конь — применение",
    src: "/videos/udobrenie-kornevaya-granuly-instruction.mp4",
    productSlug: "udobrenie-kornevaya",
    productName: "Удобрение для корневой подкормки",
  },
  {
    title: "Гранулы с янтарной кислотой — для рассады",
    src: "/videos/udobrenie-rassada-instruction.mp4",
    productSlug: "udobrenie-rassada",
    productName: "Удобрение для рассады",
  },
  {
    title: "Гранулы с ЭМ — для овощей",
    src: "/videos/udobrenie-ovoshchi-instruction.mp4",
    productSlug: "udobrenie-ovoshchi",
    productName: "Удобрение для овощей",
  },
  {
    title: "Фитомодули Цветология — инструкция по установке",
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {videos.map((video) => (
          <div key={video.src} className="space-y-3">
            <VideoPlayer src={video.src} title={video.title} />
            <h2 className="text-base font-semibold text-gray-900">
              {video.title}
            </h2>
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
