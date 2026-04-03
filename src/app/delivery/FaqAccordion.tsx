"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faq = [
  {
    q: "Можно ли изменить адрес доставки после оформления?",
    a: "Свяжитесь с нами через Telegram до момента отгрузки заказа.",
  },
  {
    q: "Что если товар пришёл повреждённым?",
    a: "Сфотографируйте упаковку и товар, напишите нам — заменим или вернём деньги.",
  },
  {
    q: "Доставляете ли в страны СНГ?",
    a: "Пока только по России. Следите за обновлениями.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium text-gray-900">{q}</span>
        {open ? (
          <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export function FaqAccordion() {
  return (
    <div className="flex flex-col gap-2">
      {faq.map((item) => (
        <FaqItem key={item.q} q={item.q} a={item.a} />
      ))}
    </div>
  );
}
