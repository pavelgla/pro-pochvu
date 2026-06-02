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
        // Яндекс читает Clean-param через свой формат, но дополнительно явный disallow не помешает
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
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // host: директива Host отменена Яндексом в 2018 — игнорируется, не указываем
  };
}
