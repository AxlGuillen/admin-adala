/**
 * Fases del seguimiento, en el orden de las columnas del tablero.
 *
 * Es el mismo catalogo que valida el CHECK de `adala_prospect_tracking`:
 * si agregas o renombras una fase aqui, hay que migrar el constraint tambien
 * o el tablero no podra guardar ese estado.
 *
 * `dot` es el color del punto en el encabezado de la columna; usa tokens del
 * tema para que funcione en claro y oscuro.
 */
export const TRACKING_STATUSES = {
  nuevo: { label: "Nuevo", dot: "var(--brand-blue)" },
  contactado: { label: "Contactado", dot: "var(--ink-muted)" },
  en_seguimiento: { label: "En seguimiento", dot: "var(--brand-blue-deep)" },
  ganado: { label: "Ganado", dot: "var(--brand-green)" },
  descartado: { label: "Descartado", dot: "var(--faint)" },
} as const;

export type TrackingStatus = keyof typeof TRACKING_STATUSES;

export const TRACKING_STATUS_VALUES = Object.keys(
  TRACKING_STATUSES,
) as [TrackingStatus, ...TrackingStatus[]];

/** La columna es `text`: un valor viejo no debe romper la UI. */
export function statusLabel(value: string) {
  return TRACKING_STATUSES[value as TrackingStatus]?.label ?? value;
}
