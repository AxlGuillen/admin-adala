import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const PERIODS = ["7d", "30d", "90d", "todo"] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABELS: Record<Period, string> = {
  "7d": "Ultimos 7 dias",
  "30d": "Ultimos 30 dias",
  "90d": "Ultimos 90 dias",
  todo: "Todo el historial",
};

/**
 * Definicion unica de los filtros. El server la lee con `loadProspectsFilters`
 * y el cliente la escribe con `useQueryStates`, asi que la URL es el unico
 * estado: es compartible, sobrevive al refresh y no necesita store.
 */
export const prospectsFilters = {
  q: parseAsString.withDefault(""),
  servicio: parseAsString.withDefault("todos"),
  estado: parseAsString.withDefault("todos"),
  periodo: parseAsStringLiteral(PERIODS).withDefault("todo"),
  pagina: parseAsInteger.withDefault(1),
};

export const loadProspectsFilters = createLoader(prospectsFilters);

export type ProspectsFilters = {
  q: string;
  servicio: string;
  estado: string;
  periodo: Period;
  pagina: number;
};
