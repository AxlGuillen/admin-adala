import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

/**
 * Cliente de Supabase para Client Components.
 *
 * Solo se usa para cosas que necesitan el browser: login, logout y realtime.
 * Para leer datos usa el archivo `queries.ts` del feature correspondiente, que
 * corre en el servidor y no expone la consulta al cliente.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
