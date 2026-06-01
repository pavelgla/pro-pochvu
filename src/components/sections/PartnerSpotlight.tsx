import { Ornament } from "@/components/ui/Ornament";
import { TelegramPost } from "@/components/TelegramPost";
import { PARTNER, PARTNER_SHOWCASE_POSTS } from "@/lib/partner-content";

// Витрина «Нас рекомендует Катя» — лента постов партнёрского Telegram-канала.
export function PartnerSpotlight() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container-main">
        <div className="mb-12 max-w-2xl">
          <div className="section-label mb-5">
            <Ornament variant="divider" />
            <span>НАС РЕКОМЕНДУЮТ</span>
          </div>
          <h2 className="section-heading">
            О нас рассказывает <span className="text-accent">{PARTNER.name}</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink/75">
            {PARTNER.blurb}
          </p>
          <a
            href={PARTNER.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[13px] font-medium text-bg transition-colors hover:bg-accent"
          >
            Подписаться в Telegram →
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_SHOWCASE_POSTS.map((p) => (
            <TelegramPost key={p} post={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
