"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

import { TRACKING_STATUS_VALUES } from "./constants";

const moveSchema = z.object({
  prospectId: z.uuid(),
  toStatus: z.enum(TRACKING_STATUS_VALUES),
});

export type MoveResult = { error: string | null };

/**
 * Mueve un prospecto de fase: upsert del estado + evento en la bitacora.
 *
 * RLS ya bloquea a quien no este en la allowlist; el chequeo de admin aqui es
 * para devolver un error legible en vez de uno de policy.
 */
export async function moveProspect(input: {
  prospectId: string;
  toStatus: string;
}): Promise<MoveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Tu sesion expiro. Vuelve a entrar." };

  const parsed = moveSchema.safeParse(input);
  if (!parsed.success) return { error: "Movimiento invalido" };

  const { prospectId, toStatus } = parsed.data;
  const supabase = await createClient();

  // El estado anterior se lee para dejarlo en la bitacora.
  const { data: current } = await supabase
    .from("adala_prospect_tracking")
    .select("status")
    .eq("prospect_id", prospectId)
    .maybeSingle();

  const fromStatus = current?.status ?? "nuevo";
  if (fromStatus === toStatus) return { error: null };

  const { error: trackError } = await supabase
    .from("adala_prospect_tracking")
    .upsert(
      {
        prospect_id: prospectId,
        status: toStatus,
        updated_at: new Date().toISOString(),
        updated_by: admin.userId,
      },
      { onConflict: "prospect_id" },
    );

  if (trackError) {
    return { error: `No se pudo mover: ${trackError.message}` };
  }

  const { error: noteError } = await supabase
    .from("adala_prospect_notes")
    .insert({
      prospect_id: prospectId,
      kind: "cambio_estado",
      from_status: fromStatus,
      to_status: toStatus,
      author_id: admin.userId,
      author_email: admin.email,
    });

  if (noteError) {
    // El estado si cambio; solo fallo la bitacora. Se reporta sin revertir.
    return { error: `Se movio, pero no se registro en el historial: ${noteError.message}` };
  }

  revalidatePath("/seguimiento");
  return { error: null };
}

const noteSchema = z.object({
  prospectId: z.uuid(),
  body: z
    .string()
    .trim()
    .min(1, "Escribe la nota antes de guardar")
    .max(2000, "La nota no puede pasar de 2000 caracteres"),
});

export type NoteState = { error: string | null; ok: boolean };

export async function addNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const admin = await getCurrentAdmin();
  if (!admin) return { error: "Tu sesion expiro. Vuelve a entrar.", ok: false };

  const parsed = noteSchema.safeParse({
    prospectId: formData.get("prospectId"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Nota invalida",
      ok: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("adala_prospect_notes").insert({
    prospect_id: parsed.data.prospectId,
    kind: "nota",
    body: parsed.data.body,
    author_id: admin.userId,
    author_email: admin.email,
  });

  if (error) {
    return { error: `No se pudo guardar la nota: ${error.message}`, ok: false };
  }

  // La nota cuenta como actividad: sube la tarjeta en su columna. El upsert no
  // toca `status` (no va en el payload), solo la fecha.
  await supabase.from("adala_prospect_tracking").upsert(
    {
      prospect_id: parsed.data.prospectId,
      updated_at: new Date().toISOString(),
      updated_by: admin.userId,
    },
    { onConflict: "prospect_id" },
  );

  revalidatePath("/seguimiento");
  return { error: null, ok: true };
}
