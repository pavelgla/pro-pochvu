import { describe, it, expect } from "vitest";
import { shouldShowConomniWidget } from "./widget";

const TOKEN = "abc123";

describe("shouldShowConomniWidget", () => {
  it("shows the widget on the storefront", () => {
    expect(shouldShowConomniWidget("/", TOKEN)).toBe(true);
    expect(shouldShowConomniWidget("/catalog/bio-chay", TOKEN)).toBe(true);
    expect(shouldShowConomniWidget("/product/bio-chay-orhidei", TOKEN)).toBe(true);
    expect(shouldShowConomniWidget("/blog/biogumus-dlya-rassady", TOKEN)).toBe(true);
  });

  it("stays away from checkout and the cart", () => {
    // A chat bubble over the payment step costs orders, and the buyer who is
    // already paying has nothing left to ask the assistant.
    expect(shouldShowConomniWidget("/cart", TOKEN)).toBe(false);
    expect(shouldShowConomniWidget("/checkout", TOKEN)).toBe(false);
    expect(shouldShowConomniWidget("/order/abc123", TOKEN)).toBe(false);
  });

  it("stays out of the admin panel and the account area", () => {
    expect(shouldShowConomniWidget("/admin", TOKEN)).toBe(false);
    expect(shouldShowConomniWidget("/admin/orders", TOKEN)).toBe(false);
    expect(shouldShowConomniWidget("/account/orders", TOKEN)).toBe(false);
  });

  it("does not render without a token — local dev and CI must not break", () => {
    expect(shouldShowConomniWidget("/", "")).toBe(false);
    expect(shouldShowConomniWidget("/", undefined)).toBe(false);
  });

  it("does not mistake a catalog slug for a hidden route", () => {
    expect(shouldShowConomniWidget("/catalog/accessories", TOKEN)).toBe(true);
    expect(shouldShowConomniWidget("/blog/kak-oformit-cart-zakaz", TOKEN)).toBe(true);
  });
});
