import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Блог | ЭКО Конь",
  alternates: { canonical: "https://pro-pochvu.ru/blog" },
};

export default function BlogPage() {
  return (
    <div className="container-main section-padding">
      <div className="mb-10 text-center">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Блог</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Полезные статьи об уходе за растениями — скоро здесь
        </p>
      </div>

      <div className="max-w-xl mx-auto mb-10">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
          <p className="text-gray-700 mb-3">
            Подпишитесь на наш Telegram — публикуем советы там уже сейчас
          </p>
          <a
            href="https://t.me/+7cAd9gatgP44MDcy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-colors"
          >
            Открыть Telegram
          </a>
        </div>
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
