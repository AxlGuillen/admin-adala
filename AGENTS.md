<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# admin-adala

Panel interno para dar seguimiento a los prospectos que llegan por el formulario
de la landing de adala.mx (Adala es un despacho de tramites migratorios). El
trafico viene de campanas de Facebook, asi que cada prospecto trae sus UTMs.

Lo desarrolla una sola persona con ayuda de agentes. Las reglas de abajo existen
para que un cambio se pueda pedir en una frase y caiga siempre en el mismo lugar.

## Stack

| Pieza | Version | Nota |
| --- | --- | --- |
| Next.js | 16 (App Router, Turbopack) | El middleware ahora se llama **proxy** y vive en `src/proxy.ts` |
| React | 19 | Server Components por defecto |
| TypeScript | 5 | `strict` |
| Tailwind | v4 | Config en CSS (`src/app/globals.css`), no hay `tailwind.config` |
| shadcn/ui | preset `radix-nova` | Componentes en `src/components/ui/` |
| Supabase | `@supabase/ssr` | Auth por cookies + RLS |
| nuqs | v2 | Filtros y paginacion viven en la URL |
| Zod | v4 | Validacion de entrada de Server Actions |

## Como esta organizado

```
src/
  app/
    (auth)/            login y sin-acceso — publicas, sin sidebar
    (dashboard)/       todo lo protegido; su layout llama requireAdmin()
  features/<modulo>/   TODO lo de un modulo junto
    constants.ts       catalogos y etiquetas
    search-params.ts   parsers de nuqs (los comparten server y cliente)
    queries.ts         lecturas ("server-only")
    actions.ts         Server Actions de escritura
    components/        UI del modulo
  components/ui/       shadcn — no editar a mano salvo que haga falta
  lib/
    auth.ts            getCurrentAdmin() / requireAdmin()
    supabase/          clients + tipos generados
    format.ts          fechas, telefonos, WhatsApp
  proxy.ts             refresca la sesion en cada request
```

**Regla principal:** un modulo = una carpeta en `src/features/` + una ruta en
`src/app/(dashboard)/`. Nada que pertenezca a un modulo se guarda fuera de su
carpeta, y **ningun modulo importa componentes de otro**. Catalogos y tipos si
se comparten: `overview` reusa `serviceLabel` y el tipo `Prospect` de
`prospects` porque son vocabulario del dominio, no UI.

Modulos actuales: `overview` (ruta `/`), `prospects` (ruta `/prospectos`) y
`seguimiento` (ruta `/seguimiento`, tablero kanban + bitacora de notas).

## Receta para agregar un modulo

1. `src/features/<modulo>/queries.ts` con `import "server-only"` arriba.
2. Si escribe datos: `src/features/<modulo>/actions.ts` con `"use server"`,
   valida con Zod y termina con `revalidatePath()`.
3. Componentes en `src/features/<modulo>/components/`.
4. Ruta en `src/app/(dashboard)/<modulo>/page.tsx` (Server Component que llama
   a las queries y pasa datos por props).
5. Entrada nueva en `NAV_ITEMS` de `src/components/app-sidebar.tsx`.
6. Si tocaste la base: `bun run db:types`.

## Reglas que no se rompen

- **Leer datos = Server Component.** Nada de `useEffect` + `fetch`. El cliente
  solo se usa para interaccion (filtros, sheets, formularios).
- **No hay Route Handlers para el CRUD propio.** Usa Server Actions. `app/api/`
  se reserva para webhooks, cosas que consuma un tercero y **descargas de
  archivos** (una Server Action no puede devolver un attachment). El handler se
  queda delgado: la logica del archivo vive en el feature, como
  `src/features/prospects/excel.ts`.
- **Un endpoint bajo `/api/` responde 401, nunca redirige.** Lo hace el proxy.
  Si redirigiera, un `<a download>` con la sesion vencida guardaria el HTML del
  login con la extension del archivo.
- **El estado de listas va en la URL** con nuqs, no en `useState`. Asi un filtro
  se puede compartir por link y sobrevive al refresh.
- **`requireAdmin()` en cada layout protegido.** El proxy solo refresca la
  sesion; no valida permisos.
- **RLS es la seguridad real**, no el `if` del componente. Toda tabla nueva
  nace con `enable row level security` y sus policies.
- **`SUPABASE_SECRET_KEY` jamas se importa desde `src/`.** Solo scripts locales.
- **Los `<Row>` de detalle y las etiquetas van en espanol sin acentos** en el
  codigo fuente (los datos si llevan acentos, es solo para evitar problemas de
  encoding en identificadores).
- **Las graficas usan `PROSPECTS_CHART_CONFIG`** (un solo color de serie, con
  su paso claro y oscuro ya validados contra las superficies de la app). Cada
  grafica muestra una sola medida, asi que el color no codifica identidad: no
  pintes las barras con un degradado por tamano ni metas una paleta categorica
  sin necesidad. El texto de ejes y etiquetas va en `--muted-foreground`, nunca
  en el color de la serie.
- **Fechas al usuario en `America/Mexico_City`.** `created_at` se guarda en UTC;
  el Excel y los desgloses por dia convierten explicitamente.

## Base de datos

Proyecto Supabase **Axl-Projects** (`impscwgourdxhdejwkhe`), compartido con otras
dos apps. Por eso todo lleva prefijo:

- `adala_*` → **este proyecto**. Es lo unico que se toca desde aqui.
- `ra_*` → reels-analytics. `home_*` → admin-home. **No consultarlas.**

Tablas actuales:

- `adala_prospects` — la llena el formulario publico de la landing. Tiene una
  policy de INSERT para `anon` que valida largos, telefono de 10 digitos y que
  `service_type` este en la lista de `src/features/prospects/constants.ts`.
  **Si agregas un servicio, hay que actualizarlo en la policy tambien** o el
  form lo rechaza.
- `adala_admins` — allowlist del panel. Signup cerrado: las filas se crean con
  la secret key, nunca desde el cliente. `adala_is_admin()` es el helper que
  usan las policies.
- `adala_prospect_tracking` — fase de seguimiento (1:1 con prospects; sin fila
  = "nuevo"). **El CHECK de `status` y `TRACKING_STATUSES` de
  `src/features/seguimiento/constants.ts` son la misma lista**: cambiar una
  implica migrar la otra.
- `adala_prospect_notes` — bitacora del seguimiento (notas y cambios de
  estado). Solo SELECT e INSERT por diseno: la bitacora no se edita ni borra.

**`adala_prospects` nunca recibe UPDATE**: los datos que dejo el formulario de
la landing son inmutables; todo el estado del panel vive en las tablas de
seguimiento.

Los tipos de `src/lib/supabase/database.types.ts` son **generados**. No se
editan a mano; se corren con `bun run db:types` (requiere `bunx supabase login`).

## Comandos

El gestor de paquetes es **bun**. El unico lockfile es `bun.lock`: nunca
generes `package-lock.json` ni `pnpm-lock.yaml` en este repo.

```bash
bun install        # instalar dependencias
bun run dev        # servidor de desarrollo
bun run build      # build de produccion
bun run check      # typecheck + lint (lo mismo que corre CI)
bun run db:types   # regenera los tipos desde Supabase
```

Antes de dar por terminado un cambio: `bun run check`.
