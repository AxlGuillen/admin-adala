import { createClient } from "@supabase/supabase-js";

// Endpoint publico de monitoreo: el proxy lo excluye de la sesion (ver
// src/proxy.ts) para que un monitor externo pueda consultarlo sin auth y sin
// gastar una llamada a Supabase Auth por ping.
//
// 200 = la app responde y Supabase contesto una consulta real.
// 503 = Supabase no respondio (o tardo mas de 5 s).
//
// La consulta es un HEAD count como `anon`: RLS le devuelve 0 filas, pero para
// responder eso PostgREST tuvo que llegar a Postgres, que es lo que se mide.
// Sin efectos secundarios; el healthcheck del formulario de la landing
// (RPC adala_form_healthcheck) es aparte y prueba el camino de escritura.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DB_TIMEOUT_MS = 5_000;

export async function GET() {
  const started = Date.now();

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      { auth: { persistSession: false } },
    );

    const query = supabase
      .from("adala_prospects")
      .select("id", { head: true, count: "exact" });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db timeout")), DB_TIMEOUT_MS),
    );

    const { error } = await Promise.race([query, timeout]);
    if (error) throw new Error(error.message);

    return Response.json(
      {
        status: "ok",
        db: "ok",
        latency_ms: Date.now() - started,
        // Con que deploy se responde; en local no existe y se omite.
        version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    // Sin detalle del error: el endpoint es publico.
    return Response.json(
      { status: "error", db: "unreachable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
