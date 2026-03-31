export type PaymentMethod =
  | "bank_card"
  | "sbp"
  | "sberbank"
  | "tinkoff_bank"
  | "installments";

export type ReceiptItem = {
  description: string;
  amount: {
    value: string;
    currency: "RUB";
  };
  vat_code: 1;
  quantity: string;
  payment_mode: "full_payment";
  payment_subject: "commodity" | "service";
};

export type YooKassaReceipt = {
  customer: {
    email: string;
    phone?: string;
  };
  items: ReceiptItem[];
};

export type CreatePaymentRequest = {
  amount: {
    value: string;
    currency: "RUB";
  };
  confirmation: {
    type: "redirect";
    return_url: string;
  };
  capture: true;
  description: string;
  metadata: {
    order_id: string;
    order_number: number;
  };
  payment_method_data?: {
    type: PaymentMethod;
  };
  receipt: YooKassaReceipt;
};

export type YooKassaPayment = {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: {
    value: string;
    currency: string;
  };
  confirmation?: {
    type: string;
    confirmation_url: string;
  };
  metadata: {
    order_id: string;
    order_number: number;
  };
};

export type WebhookEvent = {
  type: "notification";
  event: "payment.succeeded" | "payment.canceled" | "payment.waiting_for_capture";
  object: YooKassaPayment;
};
