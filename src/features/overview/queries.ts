import "server-only";

import { createClient } from "@/lib/supabase/server";
import { serviceLabel } from "@/features/prospects/constants";
import type { Prospect } from "@/features/prospects/queries";

const TIME_ZONE = "America/Mexico_City";
const TREND_DAYS = 30;

/**
 * Tope de filas que se traen para agregar en memoria.
 *
 * PostgREST no expone GROUP BY, asi que los desgloses se calculan en JS. Con el
 * volumen actual (decenas de filas) sobra de largo. Si esto se acerca al tope,
 * el paso siguiente es una vista o un RPC en Postgres, no subir el numero.
 */
const AGGREGATE_LIMIT = 10_000;

/** `yyyy-mm-dd` en hora de Ciudad de Mexico: se ordena como texto y como fecha. */
function mexicoDayKey(iso: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

/** Las ultimas N claves de dia, de la mas vieja a hoy. */
function lastDayKeys(days: number): string[] {
  const [year, month, day] = mexicoDayKey(new Date().toISOString())
    .split("-")
    .map(Number);
  // Mediodia UTC: restar dias nunca cae en un salto de horario de verano.
  const cursor = Date.UTC(year, month - 1, day, 12);

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(cursor - (days - 1 - index) * 86_400_000);
    return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
  });
}

function topCounts(values: string[], limit: number) {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total || a.nombre.localeCompare(b.nombre, "es"))
    .slice(0, limit);
}

export type TrendPoint = { dia: string; etiqueta: string; prospectos: number };
export type BreakdownItem = { nombre: string; total: number };

export type OverviewData = {
  total: number;
  hoy: number;
  ultimos7: number;
  promedioDiario: number;
  aceptanMarketing: number;
  trend: TrendPoint[];
  porServicio: BreakdownItem[];
  porOrigen: BreakdownItem[];
  recientes: Prospect[];
  /** true si se alcanzo AGGREGATE_LIMIT: los desgloses no cubren todo el historial. */
  desglosesParciales: boolean;
};

export async function getOverview(): Promise<OverviewData> {
  const supabase = await createClient();

  const [aggregate, recent] = await Promise.all([
    supabase
      .from("adala_prospects")
      .select("created_at, service_type, utm_source, accepts_marketing", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(0, AGGREGATE_LIMIT - 1),
    supabase
      .from("adala_prospects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (aggregate.error) {
    throw new Error(
      `No se pudo cargar el resumen: ${aggregate.error.message}`,
    );
  }
  if (recent.error) {
    throw new Error(
      `No se pudieron cargar los ultimos prospectos: ${recent.error.message}`,
    );
  }

  const rows = aggregate.data ?? [];
  const total = aggregate.count ?? rows.length;

  const dayKeys = lastDayKeys(TREND_DAYS);
  const todayKey = dayKeys[dayKeys.length - 1];
  const sevenDaysKey = dayKeys[dayKeys.length - 7];

  const byDay = new Map<string, number>();
  for (const row of rows) {
    const key = mexicoDayKey(row.created_at);
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  const trend: TrendPoint[] = dayKeys.map((dia) => {
    const [, month, day] = dia.split("-");
    return {
      dia,
      etiqueta: `${day}/${month}`,
      prospectos: byDay.get(dia) ?? 0,
    };
  });

  const ultimos30 = trend.reduce((sum, point) => sum + point.prospectos, 0);

  return {
    total,
    hoy: byDay.get(todayKey) ?? 0,
    // Las claves yyyy-mm-dd se comparan como texto sin ambiguedad.
    ultimos7: rows.filter((row) => mexicoDayKey(row.created_at) >= sevenDaysKey)
      .length,
    promedioDiario: Math.round((ultimos30 / TREND_DAYS) * 10) / 10,
    aceptanMarketing: rows.filter((row) => row.accepts_marketing).length,
    trend,
    porServicio: topCounts(
      rows.map((row) => serviceLabel(row.service_type)),
      8,
    ),
    porOrigen: topCounts(
      rows.map((row) => row.utm_source ?? "Directo"),
      6,
    ),
    recientes: recent.data ?? [],
    desglosesParciales: total > AGGREGATE_LIMIT,
  };
}
