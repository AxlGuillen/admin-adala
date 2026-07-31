<!--
  Plantilla de PR de admin-adala — optimizada para que el revisor de IA (y el yo-futuro)
  entiendan QUÉ cambió, POR QUÉ y CÓMO se validó SIN releer todo el repo.
  El diff ya dice el "qué"; el valor de este cuerpo es el CONTEXTO que el diff no muestra.
  Rellena cada sección, borra los comentarios HTML y pon "N/A" en lo que no aplique.
-->

## Resumen
<!-- 1-2 frases en lenguaje llano: qué hace este PR. Es lo primero que lee el revisor. -->

Closes #<!-- número de la issue (usa "Closes #12, #13" si cierra varias; "N/A" si ninguna) -->

## Por qué
<!-- El contexto que el diff NO muestra: qué problema resuelve, qué se decidió y por qué,
     qué alternativas se descartaron. Es la señal de mayor valor para el revisor. -->

## Qué cambió
<!-- Bullets de los cambios concretos, agrupados por área. Menciona archivos/rutas clave. -->
-

## Fuera de alcance
<!-- Qué NO toca este PR a propósito (controla el scope y evita que el revisor lo busque). N/A si no aplica. -->

## Reglas del proyecto tocadas
<!-- Fuente de verdad: sección "Reglas que no se rompen" de AGENTS.md.
     Marca lo que aplique y, abajo, explica CÓMO se respetó la regla. -->
- [ ] **No toca ninguna regla crítica**
- [ ] RLS o policies de Supabase (`adala_prospects`, `adala_admins`)
- [ ] Auth: `requireAdmin()` en layouts protegidos, o el proxy (`src/proxy.ts`)
- [ ] Catálogo `service_type` (debe seguir coincidiendo con la policy de INSERT de la landing)
- [ ] Filtros de prospectos (el Excel y el listado comparten el mismo builder)
- [ ] Migración de base de datos o cambio de variables de entorno

<!-- Si marcaste alguna, explica aquí cómo se respetó: -->

## Cómo se probó
<!-- Evidencia concreta — marca lo hecho y agrega detalle. -->
- [ ] `bun run check` en verde (typecheck + lint)
- [ ] `bun run build` limpio
- [ ] Probado en el **preview de Vercel** de este PR
- [ ] Verificación manual del flujo afectado: <!-- qué probaste a mano -->

## Riesgo y rollback
<!-- Nivel (bajo/medio/alto) + por qué. Cómo revertir si rompe prod (normalmente `git revert` del merge).
     Marca migraciones de BD o cambios de env vars si los hay: esos no se revierten con git. -->

## Para el revisor (IA)
<!-- Opcional pero útil: dónde enfocar, qué te preocupa, y qué YA validaste para que no lo re-cuestione. -->

## Checklist
- [ ] Si cambié una convención, la actualicé en `AGENTS.md`
- [ ] Sin `any` de TypeScript donde hay tipos en `src/lib/supabase/database.types.ts`
- [ ] Si toqué el esquema, corrí `bun run db:types`
- [ ] Capturas / video si hay cambio visual
