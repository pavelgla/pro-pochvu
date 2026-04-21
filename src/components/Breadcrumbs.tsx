import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `https://pro-pochvu.ru${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-1 text-sm text-brand-gray-dark/50">
        {items.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3" />}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="hover:text-brand-green transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-brand-gray-dark">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
