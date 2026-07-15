"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import {
  OzonDeliveryStep,
  type OzonDeliveryData,
} from "@/components/checkout/OzonDeliveryStep";
import { PersonalStep, type PersonalData } from "@/components/checkout/PersonalStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCart";
import { FREE_DELIVERY_THRESHOLD, OZON_DELIVERY_COST } from "@/lib/constants";
import { readYandexClientId, trackBeginCheckout } from "@/lib/analytics";
import type { PaymentMethod } from "@/types/yookassa";

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const promo = useCartStore((s) => s.promo);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState<OzonDeliveryData>({
    city: "",
    pvzAddress: "",
  });

  const [personal, setPersonal] = useState<PersonalData>({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  // Fire begin_checkout once the cart is hydrated and non-empty.
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    trackBeginCheckout(
      items.map((i) => ({
        id: i.product_id,
        name: i.name,
        price: i.price,
        brand: i.brand,
        variant: i.variant_id,
        quantity: i.quantity,
      }))
    );
    // run once after hydration; intentionally not depending on `items`
    // (we don't want to re-fire every cart edit on /checkout).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // Redirect if empty cart
  if (hydrated && items.length === 0) {
    router.push("/cart");
    return null;
  }

  if (!hydrated) {
    return (
      <div className="container-main section-padding flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-line border-t-accent" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCost = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : OZON_DELIVERY_COST;
  const total = subtotal - discount + deliveryCost;

  async function handlePayment(method: PaymentMethod) {
    setLoading(true);

    try {
      // Prices and delivery cost are recalculated server-side from the DB —
      // the payload carries only ids, quantities and customer data.
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            quantity: i.quantity,
          })),
          customer_name: personal.name,
          customer_email: personal.email,
          customer_phone: personal.phone,
          customer_comment: personal.comment || "",
          delivery_city: delivery.city,
          delivery_pvz_address: delivery.pvzAddress,
          promo_code: promo?.code,
          payment_method: method,
          ym_client_id: readYandexClientId() ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка создания заказа");
        return;
      }

      clearCart();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch {
      alert("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-main section-padding">
      <Breadcrumbs
        items={[
          { label: "Главная", href: "/" },
          { label: "Корзина", href: "/cart" },
          { label: "Оформление заказа" },
        ]}
      />

      <div className="mt-4 mb-8">
        <h1>Оформление заказа</h1>
      </div>

      <StepIndicator current={step} onStepClick={setStep} />

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Steps */}
        <div>
          {step === 1 && (
            <OzonDeliveryStep
              data={delivery}
              subtotal={subtotal}
              onChange={setDelivery}
              onNext={() => setStep(2)}
            />
          )}
          {step === 2 && (
            <PersonalStep
              data={personal}
              onChange={setPersonal}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <PaymentStep
              total={total}
              onSubmit={handlePayment}
              onBack={() => setStep(2)}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar summary */}
        <div className="lg:sticky lg:top-24">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
