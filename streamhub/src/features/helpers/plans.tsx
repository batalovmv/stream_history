export type DateValue = string | null;

export function toISO(value: DateValue): string | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toISOString(); // если парсится — в ISO, иначе оставим как есть
}