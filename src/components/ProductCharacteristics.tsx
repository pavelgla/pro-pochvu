import type { Prisma } from "@prisma/client";

const labelMap: Record<string, string> = {
  weight: "Вес",
  composition: "Состав",
  purpose: "Назначение",
  form: "Форма выпуска",
  quantity_in_pack: "В упаковке",
  material: "Материал",
  pockets: "Количество карманов",
  color: "Цвет",
  dimensions: "Размеры",
  mounting: "Тип крепления",
  density: "Плотность",
};

type Props = {
  characteristics: Prisma.JsonValue;
  compact?: boolean;
};

export function ProductCharacteristics({ characteristics, compact = false }: Props) {
  if (!characteristics || typeof characteristics !== "object" || Array.isArray(characteristics)) {
    return null;
  }

  const entries = Object.entries(characteristics as Record<string, unknown>).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );

  if (entries.length === 0) return null;

  const display = compact ? entries.slice(0, 4) : entries;

  return (
    <div className="overflow-hidden rounded-xl border border-brand-gray-light">
      <table className="w-full text-sm">
        <tbody>
          {display.map(([key, value], i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? "bg-brand-gray-light/30" : "bg-white"}
            >
              <td className="px-4 py-2.5 font-medium text-brand-gray-dark/70 w-1/3">
                {labelMap[key] || key}
              </td>
              <td className="px-4 py-2.5">{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
