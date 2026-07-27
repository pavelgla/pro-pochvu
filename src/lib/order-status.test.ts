import { describe, it, expect } from "vitest";
import { isOrderConfirmed } from "./order-status";

describe("isOrderConfirmed", () => {
  it("confirms a webhook-paid order", () => {
    expect(
      isOrderConfirmed({ paymentStatus: "succeeded", status: "paid" })
    ).toBe(true);
  });
  it("confirms a manually-confirmed order", () => {
    expect(
      isOrderConfirmed({ paymentStatus: "pending", status: "confirmed" })
    ).toBe(true);
  });
  it("confirms a COD order", () => {
    expect(
      isOrderConfirmed({ paymentStatus: "cod", status: "pending" })
    ).toBe(true);
  });
  it("does not confirm a pending order, even one returning from YooKassa", () => {
    // This is the case that mattered: the buyer clicked "выйти из оплаты"
    // and never entered card details. YooKassa still bounces the browser
    // back to the same return_url used for successful payments, so the
    // page must never infer "paid" from that redirect alone.
    expect(
      isOrderConfirmed({ paymentStatus: "pending", status: "pending" })
    ).toBe(false);
  });
  it("does not confirm a cancelled order", () => {
    expect(
      isOrderConfirmed({ paymentStatus: "cancelled", status: "cancelled" })
    ).toBe(false);
  });
});
