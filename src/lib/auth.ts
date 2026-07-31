import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/supabase/database.types";

export type AdminProfile = Tables<"adala_admins">;

export type CurrentAdmin = {
  userId: string;
  email: string;
  profile: AdminProfile;
};

/**
 * Devuelve el admin de la sesion actual, o null si no hay sesion o el usuario
 * no esta en la allowlist.
 *
 * Va envuelto en `cache()` para que varios componentes del mismo render lo
 * pidan sin repetir la llamada a Supabase.
 */
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("adala_admins")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return { userId: user.id, email: user.email ?? profile.email, profile };
});

/**
 * Puerta de entrada de todo lo protegido. Llamalo al inicio de cada layout o
 * page privada: el proxy solo refresca la sesion, no verifica la allowlist.
 */
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/sin-acceso");
  return admin;
}
