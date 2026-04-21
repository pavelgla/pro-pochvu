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
    description:
      "Показываем, как правильно заварить и применить био-чай с эффективными микроорганизмами. Живые бактерии в составе улучшают усвоение питательных веществ и восстанавливают почвенную микрофлору — растения получают натуральную подкормку без химии.",
    src: "/videos/udobrenie-kornevaya-instruction.mp4",
    productSlug: "udobrenie-kornevaya",
    productName: "Удобрение для корневой подкормки",
  },
  {
    title: "Инструкция: био-чай Янтарный с фосфором",
    description:
      "Янтарная кислота — природный стимулятор роста, а фосфор отвечает за пышное цветение и крепкие корни. В этом видео — пропорции заваривания, частота полива и советы по подкормке комнатных и садовых растений.",
    src: "/videos/bio-chay-yantar-fosfor-instruction.mp4",
    productSlug: "bio-chay-yantar-fosfor",
    productName: "Био-чай Янтарный с фосфором",
  },
  {
    title: "Инструкция: био-чай для декоративно-лиственных",
    description:
      "Фикусы, монстеры, калатеи и другие лиственные красавцы нуждаются в особом питании для яркой и сочной зелени. Разбираем дозировку, способ приготовления и график подкормки специальным био-чаем.",
    src: "/videos/bio-chay-dekorativno-listvennye-instruction.mp4",
    productSlug: "bio-chay-dekorativno-listvennye",
    productName: "Био-чай для декоративно-лиственных",
  },
  {
    title: "Инструкция: био-чай для орхидей",
    description:
      "Орхидеи капризны к подкормкам — важно не переборщить. Показываем точную дозировку био-чая, способ полива через замачивание и опрыскивание, а также оптимальный график для здорового цветения круглый год.",
    src: "/videos/bio-chay-orhidei-instruction.mp4",
    productSlug: "bio-chay-orhidei",
    productName: "Био-чай для орхидей",
  },
  {
    title: "Гранулированное удобрение ЭКО Конь — применение",
    description:
      "Гранулы из конского компоста — универсальное органическое удобрение для сада и огорода. Смотрите, как правильно вносить гранулы в грунт при посадке, мульчировании и сезонной подкормке для максимального эффекта.",
    src: "/videos/udobrenie-kornevaya-granuly-instruction.mp4",
    productSlug: "udobrenie-kornevaya",
    productName: "Удобрение для корневой подкормки",
  },
  {
    title: "Гранулы с янтарной кислотой — для рассады",
    description:
      "Янтарная кислота ускоряет приживаемость и укрепляет молодые растения. В ролике — сколько гранул добавлять в лунку, как подготовить почвосмесь для рассады и когда начинать подкормку после всходов.",
    src: "/videos/udobrenie-rassada-instruction.mp4",
    productSlug: "udobrenie-rassada",
    productName: "Удобрение для рассады",
  },
  {
    title: "Гранулы с ЭМ — для овощей",
    description:
      "Эффективные микроорганизмы в составе гранул подавляют патогенную микрофлору и повышают урожайность овощных культур. Показываем нормы внесения для томатов, огурцов, перцев и корнеплодов на разных этапах роста.",
    src: "/videos/udobrenie-ovoshchi-instruction.mp4",
    productSlug: "udobrenie-ovoshchi",
    productName: "Удобрение для овощей",
  },
  {
    title: "Фитомодули Цветология — инструкция по установке",
    description:
      "Модульная система фитильного полива Цветология — это живые растения на стене без лишних хлопот. В видео — пошаговая установка модуля, подключение полива и рекомендации по выбору растений для вертикального озеленения.",
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
