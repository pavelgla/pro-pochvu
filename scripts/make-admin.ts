/**
 * Grant the "admin" role to a user (seller cabinet access).
 *
 * Usage:  npx tsx scripts/make-admin.ts user@example.com
 *
 * NOTE: the role is baked into the JWT at login — the user must log out and
 * log back in for /admin access to work.
 *
 * On the production VPS the standalone image may lack tsx; in that case run
 * the SQL directly (model User has no @@map, so the table is "User"):
 *   docker exec ecokon-db psql -U <user> -d <db> \
 *     -c "UPDATE \"User\" SET role='admin' WHERE email='user@example.com';"
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx tsx scripts/make-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "admin" },
    select: { email: true, role: true },
  });

  console.log(`OK: ${user.email} → role=${user.role}`);
  console.log("Пользователь должен перелогиниться, чтобы роль попала в JWT.");
}

main()
  .catch((e) => {
    console.error(e.message ?? e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
