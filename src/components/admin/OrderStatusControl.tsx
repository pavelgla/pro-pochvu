"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/order-status";

type Props = {
  orderId: string;
  currentStatus: string;
  deliveryTrack: string;
  adminNote: string;
};

export function OrderStatusControl({
  orderId,
  currentStatus,
  deliveryTrack,
  adminNote,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [track, setTrack] = useState(deliveryTrack);
  const [note, setNote] = useState(adminNote);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const statusOptions = ORDER_STATUSES.map((s) => ({
    value: s,
    label: STATUS_LABELS[s].label,
  }));

  async function save() {
    if (
      status === "cancelled" &&
      currentStatus !== "cancelled" &&
      !window.confirm("Отменить заказ? Покупатель получит уведомление.")
    ) {
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status as OrderStatus,
          deliveryTrack: track,
          adminNote: note,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          typeof data.error === "string" ? data.error : "Не удалось сохранить"
        );
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-line p-5 space-y-4">
      <h3 className="text-base font-bold">Управление заказом</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Статус"
          options={statusOptions}
          value={status}
          onChange={setStatus}
        />
        <Input
          label="Трек-номер"
          placeholder="Номер отправления Ozon"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Примечание (видно только продавцу)
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Внутренние заметки по заказу..."
          className="w-full rounded-lg border border-line px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {error && <p className="text-sm text-error">{error}</p>}
      {saved && !error && <p className="text-sm text-success">Сохранено.</p>}

      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>
          Сохранить
        </Button>
      </div>
    </div>
  );
}
