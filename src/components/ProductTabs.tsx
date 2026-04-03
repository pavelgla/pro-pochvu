"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { ProductCharacteristics } from "@/components/ProductCharacteristics";
import { Reviews } from "@/components/Reviews";
import type { ProductWithRelations } from "@/types/database";

export function ProductTabs({ product }: { product: ProductWithRelations }) {
  const [activeTab, setActiveTab] = useState("description");

  const tabList = [
    { id: "description", label: "Описание" },
    { id: "characteristics", label: "Характеристики" },
    { id: "howto", label: "Применение" },
    { id: "reviews", label: `Отзывы (${product.reviewsCount})` },
  ];

  const description = product.fullDesc || product.shortDesc || "Описание товара скоро появится.";
  const usage = product.howToUse || "";

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

        {activeTab === "howto" && (
          <div className="prose prose-sm max-w-none text-brand-gray-dark/80 leading-relaxed whitespace-pre-line">
            {usage || "Инструкция по применению скоро появится."}
          </div>
        )}

        {activeTab === "reviews" && (
          <Reviews
            reviews={product.reviews}
            productRating={product.rating}
            reviewsCount={product.reviewsCount}
          />
        )}
      </div>
    </div>
  );
}
