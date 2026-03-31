import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CatalogContent } from "./CatalogContent";

export const metadata: Metadata = {
  title: "Каталог товаров",
  description:
    "Органические удобрения ЭКО Конь и фитомодули Цветология. Био-чай, специализированные удобрения, модули для вертикального озеленения.",
  alternates: { canonical: "https://ecokon.ru/catalog" },
};

export default function CatalogPage() {
  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Каталог" },
        ]}
      />
      <h1 className="mt-4 mb-8">Каталог товаров</h1>
      <Suspense>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
