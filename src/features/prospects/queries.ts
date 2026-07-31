import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

import { PAGE_SIZE } from "./constants";
import type { Period, ProspectsFilters } from "./search-params";

export type Prospect = Tables<"adala_prospects">;

function periodStartIso(periodo: Period): string | null {
  if (periodo === "todo") return null;
  const days = { "7d": 7, "30d": 30, "90d": 90 }[periodo];
  const since = new Date();
  since.setDate(since.getDate() - days);
  return since.toISOString();
}

/**
 * PostgREST usa comas, parentesis y punto como sintaxis dentro de `.or()`.
 * Si el usuario los teclea en el buscador, el filtro se rompe (o peor, cambia
 * de significado), asi que los quitamos antes de armar la expresion.
 */
function sanitizeSearch(value: string) {
  return value.replace(/[,()*\\%]/g, " ").trim().slice(0, 80);
}

export async function listProspects(filters: ProspectsFilters) {
  const supabase = await createClient();
  const page = Math.max(1, filters.pagina);
  const offset = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from("adala_prospects")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const since = periodStartIso(filters.periodo);
  if (since) query = query.gte("created_at", since);
  if (filters.servicio !== "todos") {
    query = query.eq("service_type", filters.servicio);
  }
  if (filters.estado !== "todos") {
    query = query.eq("state_mx", filters.estado);
  }

  const search = sanitizeSearch(filters.q);
  if (search) {
    query = query.or(
      [
        `full_name.ilike.%${search}%`,
        `phone.ilike.%${search}%`,
        `email.ilike.%${search}%`,
        `city.ilike.%${search}%`,
      ].join(","),
    );
  }

  const { data, count, error } = await query;
  if (error) {
    throw new Error(`No se pudieron cargar los prospectos: ${error.message}`);
  }

  const total = count ?? 0;
  return {
    prospects: data ?? [],
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export type ProspectStats = {
  total: number;
  ultimos7: number;
  hoy: number;
  conMarketing: number;
};

export async function getProspectStats(): Promise<ProspectStats> {
  const supabase = await createClient();

  const sevenDaysAgo = periodStartIso("7d")!;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // head: true trae solo el conteo, sin las filas.
  const countQuery = () =>
    supabase.from("adala_prospects").select("*", { count: "exact", head: true });

  const [total, ultimos7, hoy, conMarketing] = await Promise.all([
    countQuery(),
    countQuery().gte("created_at", sevenDaysAgo),
    countQuery().gte("created_at", startOfToday.toISOString()),
    countQuery().eq("accepts_marketing", true),
  ]);

  const firstError = [total, ultimos7, hoy, conMarketing].find((r) => r.error);
  if (firstError?.error) {
    throw new Error(
      `No se pudieron cargar las metricas: ${firstError.error.message}`,
    );
  }

  return {
    total: total.count ?? 0,
    ultimos7: ultimos7.count ?? 0,
    hoy: hoy.count ?? 0,
    conMarketing: conMarketing.count ?? 0,
  };
}

/**
 * Estados de la republica presentes en los datos, para poblar el filtro.
 *
 * Se dedupe en JS porque PostgREST no expone DISTINCT. Con el volumen actual
 * sobra; si esto pasa de unos miles de filas, conviene una vista o un RPC.
 */
export async function getStateOptions(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("adala_prospects")
    .select("state_mx")
    .limit(2000);

  if (error) return [];

  return [...new Set(data.map((row) => row.state_mx))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}
