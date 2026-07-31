# admin-adala

Panel interno para dar seguimiento a los prospectos que llegan por el formulario
de la landing de adala.mx desde campanas de Facebook.

## Arrancar

```bash
npm install
cp .env.example .env.local   # y llena los valores
npm run dev
```

Abre http://localhost:3000 — te manda a `/login`.

## Variables de entorno

| Variable | Para que |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Llave publica; se puede exponer, RLS es lo que protege |
| `SUPABASE_SECRET_KEY` | Opcional. Solo para dar de alta admins desde la terminal. Nunca se importa desde `src/` ni se sube a Vercel |
| `NEXT_PUBLIC_APP_URL` | URL donde vive el panel, sin diagonal final. Local `http://localhost:3000` |

## Dar de alta un usuario del panel

El signup esta cerrado a proposito. Son dos pasos:

1. Crea el usuario en **Supabase Dashboard → Authentication → Users → Add user**
   (con contrasena y "Auto Confirm User" activado).
2. Metelo a la allowlist, desde el SQL Editor de Supabase:

```sql
insert into public.adala_admins (user_id, email, full_name, role)
select id, email, 'Nombre Apellido', 'agent'
from auth.users
where email = 'persona@adala.mx';
```

`role` puede ser `owner` o `agent`. Hoy los dos ven lo mismo; la columna existe
para cuando el modulo de seguimiento necesite distinguirlos.

Para quitarle el acceso a alguien basta con borrar su fila de `adala_admins`.

## Estructura y convenciones

Estan en [AGENTS.md](AGENTS.md) (que `CLAUDE.md` importa). Si vas a pedirle
cambios a un agente, ese archivo es el contrato.

## Modulos

- **Prospectos** (`/prospectos`) — listado, buscador, filtros por servicio,
  estado y periodo, y panel de detalle con UTMs y consentimientos.

Siguiente: control de seguimiento (estatus, asignacion, notas y bitacora).
