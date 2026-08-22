import { MetadataRoute } from "next";

const SITE_URL = "https://pro-pochvu.ru";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/account/",
          "/auth/",
          "/cart",
          "/checkout",
          "/order/",
          "/test-ui",
          "/legal",
          // Не индексируем параметрические URL фильтров каталога
          "/catalog?",
          "/*?sort=",
          "/*?page=",
          "/*?brand=",
          "/*?category=",
          "/*?priceMin=",
          "/*?priceMax=",
          "/*?rating=",
        ],
      },
      {
        // Свой блок User-agent роботом читается ВМЕСТО общего, а не в дополнение к нему,
        // поэтому параметрические запреты приходится дублировать: без них Яндекс ходил
        // в /catalog?brand=… и раз за разом выкидывал их как NOT_CANONICAL.
        userAgent: "Yandex",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/account/",
          "/auth/",
          "/cart",
          "/checkout",
          "/order/",
          "/test-ui",
          "/legal",
          "/catalog?",
          "/*?sort=",
          "/*?page=",
          "/*?brand=",
          "/*?category=",
          "/*?priceMin=",
          "/*?priceMax=",
          "/*?rating=",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // host: директива Host отменена Яндексом в 2018 — игнорируется, не указываем
  };
}
