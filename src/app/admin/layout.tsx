import { type ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Middleware already gates /admin — this is defense in depth.
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[{ label: "Главная", href: "/" }, { label: "Кабинет продавца" }]}
      />

      <h1 className="mt-4">Кабинет продавца</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <AdminNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
