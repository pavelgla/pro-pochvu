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

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function SourceBadge({ source }: { source: string }) {
  if (source === "wildberries") {
    return (
      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
        WB
      </span>
    );
  }
  if (source === "ozon") {
    return (
      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        Ozon
      </span>
    );
  }
  return (
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
      Сайт
    </span>
  );
}

function RatingDistribution({ reviews, rating, total }: { reviews: Review[]; rating: number; total: number }) {
  const counts = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.length > 0
      ? reviews.filter((r) => r.rating === stars).length
      : 0;
    const pct = reviews.length > 0
      ? Math.round((count / reviews.length) * 100)
      : stars === 5
        ? rating >= 4.8 ? 85 : rating >= 4.5 ? 70 : 55
        : stars === 4 ? (rating >= 4.8 ? 10 : 20) : stars === 3 ? 3 : 1;
    return { stars, pct };
  });

  return (
    <div className="space-y-1.5">
      {counts.map((d) => (
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

const PAGE_SIZE = 10;

type Props = {
  product: {
    reviews: Review[];
    rating: number;
    reviewsCount: number;
  };
};

export function Reviews({ product }: Props) {
  const { reviews, rating, reviewsCount } = product;
  const [offset, setOffset] = useState(PAGE_SIZE);
  const [showForm, setShowForm] = useState(false);

  const visible = reviews.slice(0, offset);
  const remaining = reviews.length - offset;

  const sources = Array.from(new Set(reviews.map((r) => r.source)));
  const sourceLabels = sources.map((s) =>
    s === "wildberries" ? "Wildberries" : s === "ozon" ? "Ozon" : "нашего сайта"
  );

  return (
    <div id="reviews" className="space-y-8">
      {/* Header */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold">{rating}</span>
            <div className="space-y-1">
              <Stars count={Math.round(rating)} size="md" />
              <p className="text-sm text-brand-gray-dark/70">
                ({reviewsCount.toLocaleString("ru-RU")} отзыва)
              </p>
            </div>
          </div>
          {sourceLabels.length > 0 && (
            <p className="text-xs text-brand-gray-dark/50">
              Включает отзывы с {sourceLabels.join(", ")}
            </p>
          )}
          <RatingDistribution reviews={reviews} rating={rating} total={reviewsCount} />
        </div>
        <div className="flex items-start justify-end">
          <Button variant="secondary" onClick={() => setShowForm(!showForm)}>
            Оставить отзыв
          </Button>
        </div>
      </div>

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
          {visible.map((r) => (
            <div key={r.id} className="rounded-xl bg-white p-5 shadow-sm border border-brand-gray-light/50">
              {/* Row 1: author + date */}
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.author}</span>
                <span className="text-sm text-brand-gray-dark/50">
                  {formatDate(r.createdAt)}
                </span>
              </div>
              {/* Row 2: stars */}
              <div className="mt-1.5">
                <Stars count={r.rating} />
              </div>
              {/* Row 3: text */}
              {r.text && (
                <p className="mt-2 text-sm leading-relaxed text-brand-gray-dark/80">
                  {r.text}
                </p>
              )}
              {/* Row 4: badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                <SourceBadge source={r.source} />
                {r.isVerified && (
                  <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    ✓ Подтверждённая покупка
                  </span>
                )}
              </div>
            </div>
          ))}

          {remaining > 0 && (
            <div className="pt-2 text-center">
              <Button variant="secondary" onClick={() => setOffset(offset + PAGE_SIZE)}>
                Показать ещё {remaining}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <MessageSquare className="h-12 w-12 text-brand-gray-dark/20" />
          <p className="text-brand-gray-dark/50">
            Отзывы загружаются. На Wildberries и Ozon этот товар имеет{" "}
            <span className="font-medium">{reviewsCount.toLocaleString("ru-RU")}</span>{" "}
            отзывов с рейтингом <span className="font-medium">{rating}★</span>
          </p>
          <Button variant="secondary" onClick={() => setShowForm(true)}>
            Оставить отзыв
          </Button>
        </div>
      )}
    </div>
  );
}
