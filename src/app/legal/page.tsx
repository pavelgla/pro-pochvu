import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Правовая информация | Пропочву",
  alternates: { canonical: "https://pro-pochvu.ru/legal" },
};

export default function LegalPage() {
  return (
    <div className="container-main section-padding max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold">Правовая информация</h1>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Продавец</h2>
        <p className="text-gray-700 leading-relaxed">
          Интернет-магазин pro-pochvu.ru принадлежит и управляется ООО «Цветология».
        </p>
        <ul className="mt-3 space-y-1 text-gray-700 leading-relaxed">
          <li>Полное наименование: Общество с ограниченной ответственностью «Цветология»</li>
          <li>ИНН: 3900034368</li>
          <li>КПП: 390001001</li>
          <li>ОГРН: 1243900014830</li>
          <li>
            Юридический адрес: 236017, Калининградская область, г. Калининград,
            пр-кт Победы, д. 3, помещ. литер Б
          </li>
          <li>Генеральный директор: Кузнецова Екатерина Александровна</li>
          <li>Email: info@pro-pochvu.ru</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Торговые марки</h2>
        <p className="text-gray-700 leading-relaxed">
          Торговые марки «ЭКО Конь» и «Цветология» зарегистрированы на территории Российской
          Федерации в соответствии с Гражданским кодексом РФ (часть IV) и принадлежат
          ООО «Цветология».
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Несанкционированное использование торговых марок, логотипов, фирменного стиля и
          наименований запрещено и преследуется по закону.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-xl font-semibold">Исключительные права</h2>
        <p className="text-gray-700 leading-relaxed">
          Все материалы сайта (тексты, изображения, дизайн) являются собственностью
          ООО «Цветология» и защищены законодательством об авторском праве.
        </p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          Копирование без письменного разрешения запрещено.
        </p>
      </section>
    </div>
  );
}
