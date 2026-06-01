import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TelegramPost } from "@/components/TelegramPost";
import { PARTNER, PARTNER_SHOWCASE_POSTS } from "@/lib/partner-content";

export const metadata: Metadata = {
  title: `${PARTNER.fullName} рекомендует Пропочву | Партнёры`,
  description: PARTNER.blurb,
  alternates: { canonical: "https://pro-pochvu.ru/partnery/katya" },
};

export const dynamic = "force-dynamic";

export default function PartnerKatyaPage() {
  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: PARTNER.fullName }]}
      />

      <div className="mt-6 max-w-2xl">
        <h1 className="font-serif text-4xl font-medium tracking-tight lg:text-5xl">
          О нас рассказывает <span className="text-accent">{PARTNER.name}</span>
        </h1>
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

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PARTNER_SHOWCASE_POSTS.map((p) => (
          <TelegramPost key={p} post={p} />
        ))}
      </div>
    </div>
  );
}
