import type { NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/proxy-session";

/**
 * En Next.js 16 esto se llama "proxy" (antes era `middleware.ts`).
 * Corre antes de cada request y mantiene viva la sesion de Supabase.
 *
 * Ojo: el proxy solo filtra, no autoriza. El chequeo real de permisos vive en
 * `requireAdmin()` (src/lib/auth.ts), que se llama desde cada layout protegido.
 */
export default async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Todo menos assets estaticos, imagenes y el healthcheck: no necesitan
     * sesion y solo gastarian una llamada a Supabase por request. api/health
     * ademas debe responder a monitores externos sin auth.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
