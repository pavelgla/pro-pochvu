"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type ReviewData = {
  id: string;
  author: string;
  rating: number;
  text: string;
  source: string;
  isVerified: boolean;
  createdAt: string;
};

// Mock reviews
const mockReviews: ReviewData[] = [
  { id: "r1", author: "Елена М.", rating: 5, text: "Отличное удобрение! Растения ожили буквально за неделю. Удобный формат стиков — просто заварить и полить. Рекомендую!", source: "Ozon", isVerified: true, createdAt: "2026-03-15" },
  { id: "r2", author: "Алексей К.", rating: 5, text: "Заказываю уже третий раз. Монстера и фикус растут как на дрожжах. Состав натуральный, запах приятный.", source: "Wildberries", isVerified: true, createdAt: "2026-03-10" },
  { id: "r3", author: "Ирина С.", rating: 4, text: "Хорошее удобрение, результат видно через пару недель. Единственный минус — хотелось бы упаковку побольше.", source: "Ozon", isVerified: true, createdAt: "2026-03-05" },
  { id: "r4", author: "Дмитрий В.", rating: 5, text: "Перешёл с химических удобрений на Эко Конь. Разница заметна — растения выглядят здоровее, листья ярче.", source: "site", isVerified: false, createdAt: "2026-02-28" },
  { id: "r5", author: "Марина Т.", rating: 5, text: "Купила для орхидей по совету подруги. Через месяц появились два новых цветоноса! Очень довольна.", source: "Ozon", isVerified: true, createdAt: "2026-02-20" },
];

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
  productRating: number;
  reviewsCount: number;
};

export function Reviews({ productRating, reviewsCount }: Props) {
  const [showForm, setShowForm] = useState(false);
  const reviews = mockReviews;

  return (
    <div id="reviews" className="space-y-8">
      {/* Summary */}
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
              <p className="mt-2 text-sm leading-relaxed text-brand-gray-dark/80">
                {r.text}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-brand-gray-dark/50">
          Этот товар имеет {reviewsCount.toLocaleString("ru-RU")} отзывов на маркетплейсах
        </p>
      )}
    </div>
  );
}
