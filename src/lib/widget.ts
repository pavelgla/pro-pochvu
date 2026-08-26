// Where the ConOmni chat widget is allowed to appear.
// Pure function on purpose: vitest here runs `src/**/*.test.ts` in a node
// environment, so the decision is testable without a DOM.

const HIDDEN_PREFIXES = ["/cart", "/checkout", "/order", "/admin", "/account"];

export function shouldShowConomniWidget(pathname: string, token?: string): boolean {
  if (!token) return false;
  return !HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}
