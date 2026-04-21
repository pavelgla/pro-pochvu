import type {
  CreatePaymentRequest,
  YooKassaPayment,
  YooKassaReceipt,
  ReceiptItem,
  PaymentMethod,
} from "@/types/yookassa";

const API_URL = "https://api.yookassa.ru/v3";
const SHOP_ID = process.env.YOOKASSA_SHOP_ID;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pro-pochvu.ru";

function isMockMode() {
  return process.env.NODE_ENV === "development" && (!SHOP_ID || !SECRET_KEY);
}

function authHeader() {
  const encoded = Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64");
  return `Basic ${encoded}`;
}

function generateIdempotencyKey() {
  return crypto.randomUUID();
}

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

type OrderData = {
  orderId: string;
  orderNumber: number;
  total: number;
  items: OrderItem[];
  deliveryCost: number;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod?: PaymentMethod;
};

function buildReceipt(data: OrderData): YooKassaReceipt {
  const items: ReceiptItem[] = data.items.map((item) => ({
    description: item.name.slice(0, 128),
    amount: {
      value: item.price.toFixed(2),
      currency: "RUB",
    },
    vat_code: 1,
    quantity: String(item.quantity),
    payment_mode: "full_payment",
    payment_subject: "commodity",
  }));

  if (data.deliveryCost > 0) {
    items.push({
      description: "Доставка",
      amount: {
        value: data.deliveryCost.toFixed(2),
        currency: "RUB",
      },
      vat_code: 1,
      quantity: "1",
      payment_mode: "full_payment",
      payment_subject: "service",
    });
  }

  return {
    customer: {
      email: data.customerEmail,
      ...(data.customerPhone ? { phone: data.customerPhone } : {}),
    },
    items,
  };
}

export async function createPayment(
  data: OrderData
): Promise<{ paymentId: string; confirmationUrl: string }> {
  if (isMockMode()) {
    const mockId = `mock-pay-${Date.now()}`;
    return {
      paymentId: mockId,
      confirmationUrl: `${SITE_URL}/order/${data.orderId}?payment=success`,
    };
  }

  const receipt = buildReceipt(data);

  const body: CreatePaymentRequest = {
    amount: {
      value: data.total.toFixed(2),
      currency: "RUB",
    },
    confirmation: {
      type: "redirect",
      return_url: `${SITE_URL}/order/${data.orderId}?payment=success`,
    },
    capture: true,
    description: `Заказ #${data.orderNumber} на pro-pochvu.ru`,
    metadata: {
      order_id: data.orderId,
      order_number: data.orderNumber,
    },
    receipt,
  };

  if (data.paymentMethod) {
    body.payment_method_data = { type: data.paymentMethod };
  }

  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": generateIdempotencyKey(),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`YooKassa error ${res.status}: ${err}`);
  }

  const payment: YooKassaPayment = await res.json();

  return {
    paymentId: payment.id,
    confirmationUrl: payment.confirmation?.confirmation_url || "",
  };
}

// YooKassa webhook IP ranges
const YOOKASSA_IPS = [
  "185.71.76.",
  "185.71.77.",
  "77.75.153.",
  "77.75.156.",
  "77.75.157.",
  "2a02:5180::",
];

export function isYooKassaIp(ip: string): boolean {
  if (process.env.NODE_ENV === "development") return true;
  return YOOKASSA_IPS.some((range) => ip.startsWith(range));
}
