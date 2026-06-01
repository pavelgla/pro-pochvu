import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Пользовательское соглашение | ЭКО Конь",
  description:
    "Условия использования интернет-магазина pro-pochvu.ru. Договор оферты.",
  alternates: { canonical: "https://pro-pochvu.ru/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-main section-padding max-w-3xl">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Вернуться назад
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold">Пользовательское соглашение</h1>
      <p className="mb-1 text-sm text-gray-500">Редакция от 01.04.2026</p>
      <p className="mb-8 text-sm text-gray-500">
        ООО «Цветология», ИНН&nbsp;3900034368, ОГРН&nbsp;1243900014830,
        г.&nbsp;Калининград, пр-кт Победы, д.&nbsp;3, помещ. литер Б
      </p>

      <div className="space-y-10 text-gray-700 leading-relaxed">

        {/* 1. Предмет соглашения */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            1. Предмет соглашения
          </h2>
          <p>
            Настоящее соглашение регулирует отношения между ООО «Цветология»
            (далее — Продавец) и физическим лицом (далее — Покупатель),
            использующим сайт pro-pochvu.ru для приобретения товаров. Совершение
            заказа означает принятие условий настоящего соглашения.
          </p>
        </section>

        {/* 2. Условия заказа и оплаты */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            2. Условия заказа и оплаты
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Заказ оформляется через сайт pro-pochvu.ru</li>
            <li>Цены указаны в рублях РФ, включая НДС</li>
            <li>Оплата: банковская карта, СБП, наличные при получении</li>
            <li>Заказ считается принятым после подтверждения по email</li>
            <li>
              Продавец вправе отказать в заказе при отсутствии товара
            </li>
          </ul>
        </section>

        {/* 3. Доставка */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            3. Доставка
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              В настоящее время заказ и доставка осуществляются через маркетплейсы
              Wildberries и Ozon. Сроки, стоимость и способы доставки определяются
              правилами соответствующего маркетплейса при оформлении заказа.
            </li>
            <li>
              Прямая доставка с сайта pro-pochvu.ru находится в разработке. После её
              запуска будут применяться отдельные условия доставки, опубликованные
              на сайте.
            </li>
            <li>
              Риск случайной гибели товара переходит к Покупателю с момента
              передачи товара службе доставки.
            </li>
          </ul>
        </section>

        {/* 4. Возврат и обмен */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            4. Возврат и обмен
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Возврат товара надлежащего качества: в течение 14 дней при
              сохранении упаковки
            </li>
            <li>
              Возврат товара ненадлежащего качества (брак): в любой срок
            </li>
            <li>
              Возврат денежных средств: в течение 10 рабочих дней на исходный
              способ оплаты
            </li>
            <li>
              Вскрытые удобрения возврату не подлежат по санитарным нормам
            </li>
            <li>
              Для возврата: написать на{" "}
              <a
                href="mailto:info@pro-pochvu.ru"
                className="text-green-700 hover:underline"
              >
                info@pro-pochvu.ru
              </a>{" "}
              или в Telegram
            </li>
          </ul>
        </section>

        {/* 5. Права и обязанности сторон */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            5. Права и обязанности сторон
          </h2>
          <p className="mb-3 font-medium text-gray-800">
            Продавец обязуется:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Передать товар надлежащего качества</li>
            <li>Предоставить полную информацию о товаре</li>
            <li>Соблюдать сроки доставки</li>
          </ul>
          <p className="mb-3 font-medium text-gray-800">
            Покупатель обязуется:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Предоставить достоверные данные при оформлении заказа</li>
            <li>Оплатить заказ в установленный срок</li>
            <li>Принять товар при доставке</li>
          </ul>
        </section>

        {/* 6. Ответственность */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            6. Ответственность
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Продавец не несёт ответственности за задержки доставки,
              вызванные службами доставки
            </li>
            <li>
              Претензии принимаются в течение 30 дней с момента получения
              товара
            </li>
          </ul>
        </section>

        {/* 7. Персональные данные */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            7. Персональные данные
          </h2>
          <p>
            Обработка персональных данных осуществляется в соответствии с{" "}
            <Link href="/privacy" className="text-green-700 hover:underline">
              Политикой конфиденциальности
            </Link>{" "}
            ООО «Цветология».
          </p>
        </section>

        {/* 8. Применимое право */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            8. Применимое право
          </h2>
          <p>
            Настоящее соглашение регулируется законодательством Российской
            Федерации. Все споры решаются в суде по месту нахождения Продавца
            (г.&nbsp;Калининград).
          </p>
        </section>

        {/* 9. Контакты */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            9. Контакты
          </h2>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Продавец:</span> ООО «Цветология»
            </p>
            <p>
              <span className="font-medium">Адрес:</span> г.&nbsp;Калининград,
              пр-кт Победы, д.&nbsp;3
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a
                href="mailto:info@pro-pochvu.ru"
                className="text-green-700 hover:underline"
              >
                info@pro-pochvu.ru
              </a>
            </p>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500">
            <p>
              Также: КФХ «Ранчо Мушкино», Гладышев Юрий Евгеньевич
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
