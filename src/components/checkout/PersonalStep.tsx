"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2, "Минимум 2 символа"),
  email: z.string().email("Введите корректный email"),
  phone: z
    .string()
    .refine(
      (v) => {
        const digits = v.replace(/\D/g, "");
        return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
      },
      "Введите корректный номер телефона"
    ),
  comment: z.string().optional(),
});

export type PersonalData = z.infer<typeof schema>;

type Props = {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  onNext: () => void;
  onBack: () => void;
};

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  const normalized = digits.startsWith("8") ? "7" + digits.slice(1) : digits;
  const d = normalized.startsWith("7") ? normalized : "7" + normalized;
  const n = d.slice(0, 11);
  if (n.length <= 1) return n.length ? "+" + n : "";
  if (n.length <= 4) return `+${n[0]} (${n.slice(1)}`;
  if (n.length <= 7) return `+${n[0]} (${n.slice(1, 4)}) ${n.slice(4)}`;
  if (n.length <= 9) return `+${n[0]} (${n.slice(1, 4)}) ${n.slice(4, 7)}-${n.slice(7)}`;
  return `+${n[0]} (${n.slice(1, 4)}) ${n.slice(4, 7)}-${n.slice(7, 9)}-${n.slice(9)}`;
}

export function PersonalStep({ data, onChange, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalData>({
    resolver: zodResolver(schema),
    defaultValues: data,
  });

  function onSubmit(values: PersonalData) {
    const digits = values.phone.replace(/\D/g, "");
    const phone = "+" + (digits.startsWith("8") ? "7" + digits.slice(1) : digits);
    onChange({ ...values, phone });
    onNext();
  }

  const phoneField = register("phone");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2>Контактные данные</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Имя"
          placeholder="Иван Петров"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Телефон"
          placeholder="+7 (900) 123-45-67"
          error={errors.phone?.message}
          {...phoneField}
          onChange={(e) => {
            const formatted = formatPhone(e.target.value);
            e.target.value = formatted;
            phoneField.onChange(e);
          }}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="ivan@mail.ru"
        error={errors.email?.message}
        {...register("email")}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Комментарий к заказу
        </label>
        <textarea
          placeholder="Особые пожелания..."
          rows={3}
          className="w-full rounded-xl border border-brand-gray-light px-4 py-3 text-sm focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/20"
          {...register("comment")}
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Назад
        </Button>
        <Button type="submit" size="lg">
          Далее
        </Button>
      </div>
    </form>
  );
}
