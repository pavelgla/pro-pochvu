import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/sections/Hero";
import { Benefits } from "@/components/sections/Benefits";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { BrandSplit } from "@/components/sections/BrandSplit";
import { SeasonCalendar } from "@/components/sections/SeasonCalendar";
import { StoryBlock } from "@/components/sections/StoryBlock";
import { Testimonials } from "@/components/sections/Testimonials";
import { VideoGuides } from "@/components/sections/VideoGuides";
import { Newsletter } from "@/components/sections/Newsletter";

export const metadata: Metadata = {
  title:
    "Пропочву — органические удобрения и вертикальные сады | Доставка по России",
  description:
    "Био-чай для растений, фитомодули для вертикального озеленения. 45 000+ отзывов, рейтинг 4.9. Доставка от 99 ₽.",
  openGraph: {
    title:
      "Пропочву — органические удобрения и вертикальные сады | Доставка по России",
    description:
      "Био-чай для растений, фитомодули для вертикального озеленения. 45 000+ отзывов, рейтинг 4.9. Доставка от 99 ₽.",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Hero />
      <Benefits />
      <Suspense>
        <Bestsellers />
      </Suspense>
      <BrandSplit />
      <SeasonCalendar />
      <StoryBlock />
      <Testimonials />
      <VideoGuides />
      <Newsletter />
    </>
  );
}
