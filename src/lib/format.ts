import { formatDistanceToNowStrict, format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

/** "Hace 3 h" para lo reciente, fecha corta para lo viejo. */
export function formatRelativeDate(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) {
    return `Hace ${formatDistanceToNowStrict(date, { locale: es })}`;
  }
  if (isYesterday(date)) {
    return `Ayer, ${format(date, "HH:mm")}`;
  }
  return format(date, "d 'de' MMM, yyyy", { locale: es });
}

export function formatDateTime(iso: string) {
  return format(new Date(iso), "d 'de' MMMM yyyy, HH:mm", { locale: es });
}

/** Los telefonos entran como 10 digitos (lo valida la policy de la landing). */
export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
}

/** Link de WhatsApp con lada de Mexico. */
export function whatsappUrl(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  const base = `https://wa.me/52${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Iniciales para el avatar de la tabla. */
export function initials(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
