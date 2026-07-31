import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "./database.types";

/**
 * Rutas que se pueden ver sin sesion.
 * `/sin-acceso` va aqui a proposito: la ve un usuario que SI tiene sesion pero
 * no esta en la allowlist, y si no fuera publica rebotaria en un ciclo con /login.
 */
const PUBLIC_PATHS = ["/login", "/auth", "/sin-acceso"];

/**
 * Refresca el token de Supabase en cada request y manda a /login si no hay sesion.
 *
 * Vive aparte de `src/proxy.ts` porque la respuesta que devuelve trae las cookies
 * nuevas ya escritas: si se construye otro NextResponse, la sesion se pierde.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() y no getSession(): valida el JWT contra Supabase en vez de confiar
  // en la cookie, que el cliente puede manipular.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!user && !isPublic) {
    // Las rutas de API responden 401, no un redirect: si la sesion expira, un
    // <a download> guardaria el HTML del login con extension .xlsx.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/prospectos";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
