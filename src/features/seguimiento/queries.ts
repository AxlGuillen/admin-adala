import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

import {
  TRACKING_STATUS_VALUES,
  type TrackingStatus,
} from "./constants";

/**
 * Tope de filas por consulta al armar el tablero. PostgREST no expone GROUP BY,
 * asi que el agrupado se hace en JS; con el volumen actual sobra de largo. Si
 * el tope se alcanza algun dia, el paso siguiente es una vista o un RPC.
 */
const BOARD_LIMIT = 10_000;

export type BoardCard = {
  id: string;
  nombre: string;
  telefono: string;
  ciudad: string;
  estadoMx: string;
  servicio: string;
  estado: TrackingStatus;
  /** ISO: fecha del ultimo movimiento, o del registro si nunca se ha movido. */
  ultimaActividad: string;
  notas: number;
};

export type BoardColumns = Record<TrackingStatus, BoardCard[]>;

export async function getBoard(): Promise<{
  columns: BoardColumns;
  total: number;
}> {
  const supabase = await createClient();

  const [prospects, tracking, notes] = await Promise.all([
    supabase
      .from("adala_prospects")
      .select("id, full_name, phone, city, state_mx, service_type, created_at")
      .order("created_at", { ascending: false })
      .range(0, BOARD_LIMIT - 1),
    supabase
      .from("adala_prospect_tracking")
      .select("prospect_id, status, updated_at")
      .range(0, BOARD_LIMIT - 1),
    supabase
      .from("adala_prospect_notes")
      .select("prospect_id, kind")
      .eq("kind", "nota")
      .range(0, BOARD_LIMIT - 1),
  ]);

  const firstError = prospects.error ?? tracking.error ?? notes.error;
  if (firstError) {
    throw new Error(`No se pudo cargar el tablero: ${firstError.message}`);
  }

  const trackingByProspect = new Map(
    (tracking.data ?? []).map((row) => [row.prospect_id, row]),
  );
  const noteCount = new Map<string, number>();
  for (const note of notes.data ?? []) {
    noteCount.set(note.prospect_id, (noteCount.get(note.prospect_id) ?? 0) + 1);
  }

  const columns = TRACKING_STATUS_VALUES.reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {} as BoardColumns);

  for (const prospect of prospects.data ?? []) {
    const track = trackingByProspect.get(prospect.id);
    // Sin fila de tracking = 'nuevo'. Un estado desconocido (catalogo viejo)
    // tambien cae en 'nuevo' para que la tarjeta nunca desaparezca del tablero.
    const estado: TrackingStatus =
      track && track.status in columns
        ? (track.status as TrackingStatus)
        : "nuevo";

    columns[estado].push({
      id: prospect.id,
      nombre: prospect.full_name,
      telefono: prospect.phone,
      ciudad: prospect.city,
      estadoMx: prospect.state_mx,
      servicio: prospect.service_type,
      estado,
      ultimaActividad: track?.updated_at ?? prospect.created_at,
      notas: noteCount.get(prospect.id) ?? 0,
    });
  }

  for (const status of TRACKING_STATUS_VALUES) {
    columns[status].sort((a, b) =>
      b.ultimaActividad.localeCompare(a.ultimaActividad),
    );
  }

  return { columns, total: prospects.data?.length ?? 0 };
}

export type TimelineEntry = Tables<"adala_prospect_notes">;

export type Timeline = {
  prospect: Tables<"adala_prospects">;
  estado: TrackingStatus | null;
  entries: TimelineEntry[];
};

/** Historial de un prospecto para el panel lateral. null si el id no existe. */
export async function getTimeline(prospectId: string): Promise<Timeline | null> {
  // El id viene de la URL: si no parece uuid ni lo consultamos.
  if (!/^[0-9a-f-]{36}$/i.test(prospectId)) return null;

  const supabase = await createClient();

  const [prospect, tracking, entries] = await Promise.all([
    supabase.from("adala_prospects").select("*").eq("id", prospectId).maybeSingle(),
    supabase
      .from("adala_prospect_tracking")
      .select("status")
      .eq("prospect_id", prospectId)
      .maybeSingle(),
    supabase
      .from("adala_prospect_notes")
      .select("*")
      .eq("prospect_id", prospectId)
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  if (prospect.error || !prospect.data) return null;
  if (entries.error) {
    throw new Error(`No se pudo cargar el historial: ${entries.error.message}`);
  }

  return {
    prospect: prospect.data,
    estado: (tracking.data?.status as TrackingStatus | undefined) ?? null,
    entries: entries.data ?? [],
  };
}
