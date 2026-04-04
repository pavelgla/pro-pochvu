import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "База знаний | ЭКО Конь",
  alternates: { canonical: "https://ecokon.ru/knowledge-base" },
};

const articles = [
  "Как применять удобрения ЭКО Конь",
  "Конский навоз: польза и применение",
  "Вертикальное озеленение: с чего начать",
  "Уход за орхидеями: советы экспертов",
];

export default function KnowledgeBasePage() {
  return (
    <div className="container-main section-padding">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">База знаний</h1>
        <p className="text-lg text-gray-500">
          Статьи и руководства по уходу за растениями
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
        {articles.map((title) => (
          <div
            key={title}
            className="bg-gray-50 border border-gray-200 rounded-2xl p-6"
          >
            <div className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">
              Скоро
            </div>
            <div className="text-gray-700 font-medium">{title}</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          В каталог
        </Link>
      </div>
    </div>
  );
}
