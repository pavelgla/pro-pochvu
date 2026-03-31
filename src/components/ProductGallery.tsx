"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  videoUrl?: string | null;
  brand: string;
};

export function ProductGallery({ images, videoUrl, brand }: Props) {
  // Generate placeholder images if none provided
  const allImages = images.length > 0
    ? images
    : ["/placeholder", "/placeholder-2", "/placeholder-3"];

  const hasVideo = !!videoUrl;
  const totalItems = allImages.length + (hasVideo ? 1 : 0);
  const [activeIndex, setActiveIndex] = useState(0);

  const emoji = brand === "ecokon" ? "🌿" : "🌱";

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="group relative aspect-square overflow-hidden rounded-xl bg-brand-gray-light cursor-zoom-in">
        {activeIndex < allImages.length ? (
          <div className="flex h-full items-center justify-center text-8xl text-brand-gray-dark/10 transition-transform duration-300 group-hover:scale-150">
            {emoji}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-brand-gray-dark/5">
            <Play className="h-16 w-16 text-brand-gray-dark/30" />
          </div>
        )}
      </div>

      {/* Thumbnails — horizontal scroll on mobile */}
      {totalItems > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x">
          {allImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 snap-start overflow-hidden rounded-lg bg-brand-gray-light transition-all",
                activeIndex === i
                  ? "ring-2 ring-brand-green"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <div className="flex h-full items-center justify-center text-2xl text-brand-gray-dark/15">
                {emoji}
              </div>
            </button>
          ))}
          {hasVideo && (
            <button
              onClick={() => setActiveIndex(allImages.length)}
              className={cn(
                "relative flex h-16 w-16 shrink-0 snap-start items-center justify-center rounded-lg bg-brand-gray-light transition-all",
                activeIndex === allImages.length
                  ? "ring-2 ring-brand-green"
                  : "opacity-60 hover:opacity-100"
              )}
            >
              <Play className="h-6 w-6 text-brand-gray-dark/40" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
