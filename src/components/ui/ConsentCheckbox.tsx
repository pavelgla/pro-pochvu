import Link from "next/link";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
};

export function ConsentCheckbox({ checked, onChange, required }: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-light accent-brand-green"
      />
      <span className="text-sm text-brand-gray-dark/70">
        Я согласен(а) с{" "}
        <Link href="/privacy" className="text-brand-green hover:underline" target="_blank">
          Политикой обработки персональных данных
        </Link>{" "}
        и{" "}
        <Link href="/terms" className="text-brand-green hover:underline" target="_blank">
          Пользовательским соглашением
        </Link>
      </span>
    </label>
  );
}
