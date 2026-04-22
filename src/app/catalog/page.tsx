import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Ornament } from "@/components/ui/Ornament";
import { CatalogContent } from "./CatalogContent";

export const metadata: Metadata = {
  title: "Каталог товаров",
  description:
    "Органические удобрения ЭКО Конь и фитомодули Цветология. Био-чай, специализированные удобрения, модули для вертикального озеленения.",
  alternates: { canonical: "https://pro-pochvu.ru/catalog" },
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

      <div className="mt-6 mb-10">
        <div className="section-label mb-4">
          <Ornament variant="divider" />
          <span>ВСЕ ТОВАРЫ</span>
        </div>
        <h1 className="section-heading text-4xl md:text-5xl lg:text-6xl">Каталог</h1>
      </div>

      <Suspense>
        <CatalogContent />
      </Suspense>
    </div>
  );
}
