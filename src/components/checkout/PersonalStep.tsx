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
    .min(11, "Введите номер телефона")
    .regex(/^\+?[78]\d{10}$/, "Формат: +7XXXXXXXXXX"),
  comment: z.string().optional(),
});

export type PersonalData = z.infer<typeof schema>;

type Props = {
  data: PersonalData;
  onChange: (data: PersonalData) => void;
  onNext: () => void;
  onBack: () => void;
};

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
    onChange(values);
    onNext();
  }

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
          placeholder="+79001234567"
          error={errors.phone?.message}
          {...register("phone")}
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
