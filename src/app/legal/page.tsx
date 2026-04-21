import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Правовая информация | ЭКО Конь",
  alternates: { canonical: "https://pro-pochvu.ru/legal" },
};

export default function LegalPage() {
  return (
    <div className="container-main section-padding max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold">Правовая информация</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Правообладатель</h2>
        <p className="text-gray-700 leading-relaxed">
          Интернет-магазин pro-pochvu.ru принадлежит и управляется КФХ «Ранчо Мушкино».
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Глава КФХ: Гладышев Юрий Евгеньевич
        </p>
        <p className="text-gray-700 leading-relaxed">
          Регион: Калининградская область, Российская Федерация
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Торговые марки</h2>
        <p className="text-gray-700 leading-relaxed">
          Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы на территории Российской
          Федерации в соответствии с Гражданским кодексом РФ (часть IV) и принадлежат КФХ
          «Ранчо Мушкино».
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Несанкционированное использование торговых марок, логотипов, фирменного стиля и
          наименований запрещено и преследуется по закону.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Исключительные права</h2>
        <p className="text-gray-700 leading-relaxed">
          Все материалы сайта (тексты, изображения, дизайн) являются собственностью КФХ «Ранчо
          Мушкино» и защищены законодательством об авторском праве.
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Копирование без письменного разрешения запрещено.
        </p>
      </section>
    </div>
  );
}
