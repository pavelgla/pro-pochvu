"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StepIndicator } from "@/components/checkout/StepIndicator";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { PersonalStep, type PersonalData } from "@/components/checkout/PersonalStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store/cartStore";
import { useCartHydrated } from "@/hooks/useCart";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/constants";
import type { DeliveryOption, PickupPoint } from "@/types/delivery";
import type { PaymentMethod } from "@/types/yookassa";

type DeliveryData = {
  option: DeliveryOption | null;
  point: PickupPoint | null;
  address: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const hydrated = useCartHydrated();
  const items = useCartStore((s) => s.items);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscount = useCartStore((s) => s.getDiscount);
  const getTotalWeight = useCartStore((s) => s.getTotalWeight);
  const promo = useCartStore((s) => s.promo);
  const clearCart = useCartStore((s) => s.clearCart);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [delivery, setDelivery] = useState<DeliveryData>({
    option: null,
    point: null,
    address: "",
  });

  const [personal, setPersonal] = useState<PersonalData>({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  // Redirect if empty cart
  if (hydrated && items.length === 0) {
    router.push("/cart");
    return null;
  }

  if (!hydrated) {
    return (
      <div className="container-main section-padding flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-gray-light border-t-brand-green" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCost =
    subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : (delivery.option?.cost || 0);
  const total = subtotal - discount + deliveryCost;

  async function handlePayment(method: PaymentMethod | "cod") {
    if (!delivery.option) return;
    setLoading(true);

    try {
      const deliveryAddress = delivery.option.delivery_type === "courier"
        ? { address: delivery.address }
        : {
            point_id: delivery.point?.id,
            point_name: delivery.point?.name,
            point_address: delivery.point?.address,
          };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product_id,
            variant_id: i.variant_id,
            name: i.name,
            brand: i.brand,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
            slug: i.slug,
            weight_grams: i.weight_grams,
          })),
          customer_name: personal.name,
          customer_email: personal.email,
          customer_phone: personal.phone,
          customer_comment: personal.comment || "",
          delivery_provider: delivery.option.provider,
          delivery_method: delivery.option.delivery_type,
          delivery_cost: delivery.option.cost,
          delivery_tariff_id: delivery.option.tariff_id,
          delivery_address: deliveryAddress,
          delivery_point_id: delivery.point?.id,
          promo_code: promo?.code,
          promo_discount: discount,
          payment_method: method,
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
            <DeliveryStep
              data={delivery}
              weightGrams={getTotalWeight()}
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
              deliveryProvider={delivery.option?.provider}
              onSubmit={handlePayment}
              onBack={() => setStep(2)}
              loading={loading}
            />
          )}
        </div>

        {/* Sidebar summary */}
        <div className="lg:sticky lg:top-24">
          <OrderSummary deliveryOption={delivery.option} />
        </div>
      </div>
    </div>
  );
}
