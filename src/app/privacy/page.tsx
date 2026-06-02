import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных | ЭКО Конь",
  description:
    "Политика обработки персональных данных ООО «Цветология». Как мы собираем, используем и защищаем ваши данные.",
  alternates: { canonical: "https://pro-pochvu.ru/privacy" },
};

export default function PrivacyPage() {
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

      <h1 className="mb-2 text-3xl font-bold">
        Политика обработки персональных данных
      </h1>
      <p className="mb-8 text-sm text-gray-500">Редакция от 01.04.2026</p>

      <div className="space-y-10 text-gray-700 leading-relaxed">

        {/* 1. Общие положения */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            1. Общие положения
          </h2>
          <p className="mb-3">
            Настоящая Политика обработки персональных данных (далее — Политика)
            разработана в соответствии с Федеральным законом от 27.07.2006 №&nbsp;152-ФЗ
            «О персональных данных» и определяет порядок обработки персональных данных
            пользователей сайта pro-pochvu.ru.
          </p>
          <p className="mb-3">
            Оператором персональных данных является ООО «Цветология» (ИНН&nbsp;3900034368,
            ОГРН&nbsp;1243900014830), адрес: 236017, Калининградская обл., г.&nbsp;Калининград,
            пр-кт Победы, д.&nbsp;3, помещ. литер Б.
          </p>
          <p>
            Используя сайт pro-pochvu.ru, вы подтверждаете, что ознакомились с настоящей
            Политикой и даёте согласие на обработку персональных данных на условиях,
            изложенных в ней.
          </p>
        </section>

        {/* 2. Какие персональные данные мы собираем */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            2. Какие персональные данные мы собираем
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                    Категория
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                    Данные
                  </th>
                  <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                    Когда собираем
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Идентификационные</td>
                  <td className="border border-gray-200 px-4 py-3">Имя, фамилия</td>
                  <td className="border border-gray-200 px-4 py-3">
                    При регистрации и оформлении заказа
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Контактные</td>
                  <td className="border border-gray-200 px-4 py-3">
                    Адрес электронной почты, номер телефона
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    При регистрации, оформлении заказа, подписке
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Адресные</td>
                  <td className="border border-gray-200 px-4 py-3">
                    Адрес доставки, город
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    При оформлении заказа
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Платёжные</td>
                  <td className="border border-gray-200 px-4 py-3">
                    Не хранятся — обрабатываются платёжным сервисом ЮKassa
                  </td>
                  <td className="border border-gray-200 px-4 py-3">При оплате</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-4 py-3">Технические</td>
                  <td className="border border-gray-200 px-4 py-3">
                    IP-адрес, cookie, данные браузера
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    Автоматически при посещении сайта
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3">Аналитические</td>
                  <td className="border border-gray-200 px-4 py-3">
                    Действия на сайте, статистика
                  </td>
                  <td className="border border-gray-200 px-4 py-3">
                    Через Яндекс.Метрику
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Цели обработки */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            3. Цели обработки персональных данных
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Оформление и исполнение заказов (доставка, связь по заказу)</li>
            <li>Идентификация пользователя в личном кабинете</li>
            <li>Направление уведомлений о заказе (email, Telegram)</li>
            <li>Направление маркетинговых рассылок (только с явного согласия)</li>
            <li>Улучшение работы сайта и пользовательского опыта</li>
            <li>
              Соблюдение требований законодательства РФ (54-ФЗ, налоговый учёт)
            </li>
          </ul>
        </section>

        {/* 4. Правовые основания */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            4. Правовые основания обработки
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Согласие субъекта персональных данных (ст.&nbsp;6 ч.&nbsp;1 п.&nbsp;1,
              ст.&nbsp;9 152-ФЗ) — для регистрации, рассылок
            </li>
            <li>
              Исполнение договора (ст.&nbsp;6 ч.&nbsp;1 п.&nbsp;5 152-ФЗ) — для
              обработки заказов
            </li>
            <li>
              Законный интерес (ст.&nbsp;6 ч.&nbsp;1 п.&nbsp;7 152-ФЗ) — для
              обеспечения безопасности сайта
            </li>
          </ul>
        </section>

        {/* 5. Срок хранения */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            5. Срок хранения данных
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Данные аккаунта: до удаления аккаунта пользователем + 3 года
              (налоговые требования)
            </li>
            <li>Данные заказов: 5 лет (требования налогового законодательства)</li>
            <li>Cookie и технические данные: согласно настройкам браузера / до 1 года</li>
            <li>Данные рассылок: до отзыва согласия</li>
          </ul>
        </section>

        {/* 6. Комментарии в блоге */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            6. Комментарии в блоге
          </h2>
          <p>
            При отправке комментария мы обрабатываем имя автора (публикуется
            рядом с комментарием), адрес электронной почты (указывается по
            желанию, не публикуется и используется только для возможных
            уведомлений), текст комментария и технический хэш IP-адреса (для
            защиты от спама; он не публикуется и не позволяет идентифицировать
            устройство). Основание обработки — ваше согласие, выражаемое
            отметкой соответствующего поля при отправке комментария. Данные
            хранятся до отзыва согласия или удаления комментария.
          </p>
        </section>

        {/* 7. Передача данных третьим лицам */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            7. Передача данных третьим лицам
          </h2>
          <p className="mb-3">
            Мы передаём персональные данные следующим получателям исключительно для
            исполнения договора:
          </p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Службы доставки</span> (после запуска
              прямой доставки с сайта) — адрес и контакты получателя для исполнения
              заказа
            </li>
            <li>
              <span className="font-medium">Платёжный сервис:</span> ЮKassa (НКО
              «Национальная платёжная корпорация») — контактные данные плательщика
            </li>
            <li>
              <span className="font-medium">Сервис аналитики:</span> Яндекс.Метрика —
              обезличенные поведенческие данные
            </li>
            <li>
              <span className="font-medium">Telegram:</span> при использовании
              уведомлений через Telegram-бот
            </li>
          </ul>
          <p className="font-medium text-gray-800">
            Мы не продаём персональные данные третьим лицам.
          </p>
        </section>

        {/* 8. Хранение данных */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            8. Хранение данных
          </h2>
          <p>
            Персональные данные хранятся на серверах, расположенных на территории
            Российской Федерации, в соответствии с требованиями ст.&nbsp;18.1 152-ФЗ.
          </p>
        </section>

        {/* 9. Права субъекта */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            9. Права субъекта персональных данных
          </h2>
          <p className="mb-3">Вы имеете право:</p>
          <ul className="mb-4 list-disc space-y-2 pl-6">
            <li>Получить информацию об обработке своих данных</li>
            <li>Требовать уточнения, блокирования или уничтожения данных</li>
            <li>Отозвать согласие на обработку в любой момент</li>
            <li>
              Обратиться в Роскомнадзор (rkn.gov.ru) в случае нарушений
            </li>
          </ul>
          <p>
            Для реализации прав направьте запрос на:{" "}
            <a
              href="mailto:info@pro-pochvu.ru"
              className="text-green-700 hover:underline"
            >
              info@pro-pochvu.ru
            </a>
            . Мы ответим в течение 30 дней.
          </p>
        </section>

        {/* 10. Файлы cookie */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            10. Файлы cookie
          </h2>
          <p className="mb-4">
            Сайт использует cookie для корректной работы, аналитики и улучшения
            пользовательского опыта. Продолжая использовать сайт, вы соглашаетесь с
            использованием cookie. Вы можете отключить cookie в настройках браузера.
          </p>
          <p className="mb-2 font-medium text-gray-800">Виды cookie:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="font-medium">Обязательные:</span> корзина, сессия
              авторизации (без них сайт не работает)
            </li>
            <li>
              <span className="font-medium">Аналитические:</span> Яндекс.Метрика
              (можно отключить)
            </li>
          </ul>
        </section>

        {/* 11. Изменения Политики */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            11. Изменения Политики
          </h2>
          <p>
            Мы вправе изменять Политику. При существенных изменениях уведомим по
            email или через уведомление на сайте. Актуальная версия всегда доступна
            по адресу:{" "}
            <a href="https://pro-pochvu.ru/privacy" className="text-green-700 hover:underline">
              https://pro-pochvu.ru/privacy
            </a>
          </p>
        </section>

        {/* 12. Контакты */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-900">12. Контакты</h2>
          <div className="space-y-1">
            <p>
              <span className="font-medium">Оператор:</span> ООО «Цветология»
            </p>
            <p>
              <span className="font-medium">ИНН:</span> 3900034368
            </p>
            <p>
              <span className="font-medium">ОГРН:</span> 1243900014830
            </p>
            <p>
              <span className="font-medium">Генеральный директор:</span> Кузнецова
              Екатерина Александровна
            </p>
            <p>
              <span className="font-medium">Адрес:</span> 236017, г.&nbsp;Калининград,
              пр-кт Победы, д.&nbsp;3, помещ. литер Б
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              <a href="mailto:info@pro-pochvu.ru" className="text-green-700 hover:underline">
                info@pro-pochvu.ru
              </a>
            </p>
            <p>
              <span className="font-medium">Сайт:</span>{" "}
              <a href="https://pro-pochvu.ru" className="text-green-700 hover:underline">
                https://pro-pochvu.ru
              </a>
            </p>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-500">
            <p>
              Также: КФХ «Ранчо Мушкино», Гладышев Юрий Евгеньевич
              (Калининградская обл.)
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
