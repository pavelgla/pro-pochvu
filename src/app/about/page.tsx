import type { Metadata } from "next";
import { Shield } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "О бренде ЭКО Конь и Цветология | КФХ «Ранчо Мушкино»",
  description:
    "История бренда органических удобрений ЭКО Конь и систем вертикального озеленения Цветология. КФХ «Ранчо Мушкино», Калининградская область.",
  alternates: { canonical: "https://pro-pochvu.ru/about" },
};

const stats = [
  { value: "50 000+", label: "довольных покупателей" },
  { value: "4.9★", label: "средний рейтинг" },
  { value: "18", label: "товаров в линейке" },
  { value: "5 лет", label: "гарантия на фитомодули" },
];

export default function AboutPage() {
  return (
    <div className="container-main section-padding">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Органика с фермы — прямо к вам
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          КФХ «Ранчо Мушкино» производит удобрения на основе конского навоза и
          системы вертикального озеленения с 2020 года.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center"
          >
            <div className="text-2xl font-bold text-green-600 mb-1">
              {value}
            </div>
            <div className="text-sm text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* История */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Наша история
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-gray-600 leading-relaxed space-y-3">
          <p>
            КФХ «Ранчо Мушкино» — семейное фермерское хозяйство в Калининградской
            области. Мы начинали с переработки конского навоза в качественное
            органическое удобрение, а сейчас развиваем два направления:
            органические удобрения под брендом «ЭКО Конь» и системы
            вертикального озеленения «Цветология».
          </p>
          <p>
            Наши удобрения на основе конского навоза — один из лучших органических
            субстратов: они богаче коровьего навоза по содержанию азота и
            фосфора, быстрее разлагаются и не закисляют почву.
          </p>
        </div>
      </div>

      {/* Два бренда */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Два бренда
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-2xl border border-green-100 p-6">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              ЭКО Конь
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Органические удобрения. Био-чай в стиках, специализированные
              составы для разных культур. Без химии, только натуральное.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Цветология
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Фитомодули для вертикального озеленения. Производство Россия,
              ABS-пластик, гарантия 5 лет.
            </p>
          </div>
        </div>
      </div>

      {/* Правовая информация */}
      <div className="mb-14">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-lg font-semibold text-gray-900">
              Товарные знаки
            </h2>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы в
            установленном порядке на территории Российской Федерации и
            принадлежат КФХ «Ранчо Мушкино» (глава — Гладышев Юрий Евгеньевич).
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mb-2">
            Любое несанкционированное использование названий, логотипов и
            фирменного стиля брендов преследуется в соответствии с действующим
            законодательством РФ.
          </p>
          <p className="text-gray-500 text-sm">
            © КФХ «Ранчо Мушкино». Все права защищены.
          </p>
        </div>
      </div>

      {/* Маркетплейсы */}
      <div className="mb-14">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Наши магазины на маркетплейсах
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.ozon.ru/brand/eko-kon-147553078/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Ozon — ЭКО Конь
          </a>
          <a
            href="https://www.ozon.ru/seller/tsvetologiya-1448738/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Ozon — Цветология
          </a>
          <a
            href="https://www.wildberries.ru/brands/eko-kon"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-purple-400 hover:text-purple-700 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors bg-white"
          >
            Wildberries
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Смотреть каталог
        </Link>
      </div>
    </div>
  );
}
