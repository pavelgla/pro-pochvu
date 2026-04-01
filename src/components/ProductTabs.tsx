"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCharacteristics } from "@/components/ProductCharacteristics";
import { Reviews } from "@/components/Reviews";
import type { ProductWithLine } from "@/types/database";

const tabList = [
  { id: "description", label: "Описание" },
  { id: "characteristics", label: "Характеристики" },
  { id: "reviews", label: "Отзывы" },
  { id: "howto", label: "Как применять" },
];

const howToUse: Record<string, string> = {
  ecokon:
    "1. Залейте 1 стик 1 литром тёплой воды (30-40°C).\n2. Размешайте и дайте настояться 10-15 минут.\n3. Полейте растение полученным раствором.\n4. Повторяйте 1-2 раза в месяц в период активного роста.\n5. Храните стики в сухом месте при комнатной температуре.",
  tsvetologiya:
    "1. Выберите место для установки (стена или пол).\n2. Закрепите модуль согласно инструкции (крепёж в комплекте).\n3. Заполните карманы грунтом на 2/3 объёма.\n4. Посадите растения, аккуратно расправив корни.\n5. Полейте каждый карман и дайте воде стечь через дренаж.\n6. Регулярно поливайте и подкармливайте удобрениями ЭКО Конь.",
};

export function ProductTabs({ product }: { product: ProductWithLine }) {
  const [activeTab, setActiveTab] = useState("description");
  const brand = product.productLine?.brand || "ecokon";

  const description = product.fullDesc || product.shortDesc || "Описание товара скоро появится.";
  const usage = howToUse[brand] || howToUse.ecokon;

  return (
    <div>
      <Tabs tabs={tabList} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "description" && (
          <div className="prose prose-sm max-w-none text-brand-gray-dark/80 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        )}

        {activeTab === "characteristics" && (
          <ProductCharacteristics characteristics={product.characteristics} />
        )}

        {activeTab === "reviews" && (
          <Reviews
            productRating={product.rating}
            reviewsCount={product.reviewsCount}
          />
        )}

        {activeTab === "howto" && (
          <div className="prose prose-sm max-w-none text-brand-gray-dark/80 leading-relaxed whitespace-pre-line">
            {usage}
          </div>
        )}
      </div>
    </div>
  );
}
