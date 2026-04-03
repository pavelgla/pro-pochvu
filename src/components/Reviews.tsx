"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Review } from "@/types/database";

function Stars({ count, size = "sm" }: { count: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            s,
            i < count ? "fill-yellow-400 text-yellow-400" : "fill-brand-gray-light text-brand-gray-light"
          )}
        />
      ))}
    </div>
  );
}

function RatingDistribution({ rating, total }: { rating: number; total: number }) {
  const dist = [
    { stars: 5, pct: rating >= 4.8 ? 85 : rating >= 4.5 ? 70 : 55 },
    { stars: 4, pct: rating >= 4.8 ? 10 : 20 },
    { stars: 3, pct: 3 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 1 },
  ];

  return (
    <div className="space-y-1.5">
      {dist.map((d) => (
        <div key={d.stars} className="flex items-center gap-2 text-sm">
          <span className="w-3 text-right">{d.stars}</span>
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-gray-light">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${d.pct}%` }}
            />
          </div>
          <span className="w-8 text-right text-brand-gray-dark/50">{d.pct}%</span>
        </div>
      ))}
      <p className="mt-2 text-xs text-brand-gray-dark/50">
        На основе {total.toLocaleString("ru-RU")} отзывов
      </p>
    </div>
  );
}

type ReviewFormState = { rating: number; text: string };

function ReviewForm({ onSubmit }: { onSubmit: (data: ReviewFormState) => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");

  return (
    <div className="rounded-xl border border-brand-gray-light p-5 space-y-4">
      <h4 className="font-bold">Оставить отзыв</h4>
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i + 1)}
          >
            <Star
              className={cn(
                "h-7 w-7 transition-colors",
                (hoverRating || rating) > i
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-brand-gray-light text-brand-gray-light"
              )}
            />
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Расскажите о вашем опыте..."
        rows={4}
        className="w-full rounded-xl border border-brand-gray-light px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
      />
      <Button
        size="sm"
        disabled={rating === 0 || !text.trim()}
        onClick={() => onSubmit({ rating, text })}
      >
        Отправить отзыв
      </Button>
    </div>
  );
}

type Props = {
  reviews: Review[];
  productRating: number;
  reviewsCount: number;
};

export function Reviews({ reviews, productRating, reviewsCount }: Props) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div id="reviews" className="space-y-8">
      {/* Summary */}
      {reviewsCount > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-5xl font-bold">{productRating}</span>
              <Stars count={Math.round(productRating)} size="md" />
            </div>
            <div className="flex-1">
              <RatingDistribution rating={productRating} total={reviewsCount} />
            </div>
          </div>
          <div className="flex items-start justify-end">
            <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
              Оставить отзыв
            </Button>
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <ReviewForm
          onSubmit={(data) => {
            console.log("Review submitted:", data);
            setShowForm(false);
          }}
        />
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-brand-gray-light p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{r.author}</span>
                  {r.isVerified && (
                    <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Проверенная покупка
                    </span>
                  )}
                </div>
                <span className="text-xs text-brand-gray-dark/40">
                  {r.source !== "site" ? r.source : "Сайт"} •{" "}
                  {new Date(r.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="mt-2">
                <Stars count={r.rating} />
              </div>
              {r.text && (
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-dark/80">
                  {r.text}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <MessageSquare className="h-12 w-12 text-brand-gray-dark/20" />
          <p className="text-brand-gray-dark/50">
            Пока нет отзывов. Будьте первым!
          </p>
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Оставить отзыв
          </Button>
        </div>
      )}
    </div>
  );
}
