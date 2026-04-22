"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  videoUrl?: string | null;
  brand: string;
};

export function ProductGallery({ images, brand }: Props) {
  const displayImages = images.length > 0 ? images : ["/images/placeholder.svg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = displayImages[activeIndex] ?? "/images/placeholder.svg";

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-bg-soft">
        <Image
          src={activeImage}
          alt={brand}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails — horizontal scroll */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-lg bg-bg-soft transition-all",
                activeIndex === i
                  ? "ring-2 ring-accent"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${brand} ${i + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
