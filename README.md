# CDC Catalog + Supabase (Vercel-only)

Frontend estático en HTML + JS (ES Modules) diseñado **solo** para despliegue en Vercel,
con una arquitectura segura donde el frontend consume API Routes y el backend consulta Supabase con `SUPABASE_SERVICE_ROLE_KEY`.

## ✅ Requisitos

- Cuenta en **Vercel**.
- Proyecto en **Supabase**.
- Variables de entorno backend:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `APP_SESSION_TOKEN`
  - (Opcional) `CDC_CATALOG`

> ⚠️ **Nunca** uses `service_role` en el frontend.

---

## 1. Despliegue en Vercel

1. Sube este repo a GitHub.
2. En Vercel, crea un nuevo proyecto y selecciona tu repo.
3. En **Settings → Environment Variables**, agrega:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_SESSION_TOKEN`
   - `CDC_CATALOG` (opcional, JSON en string)
4. Haz deploy.

### ¿Dónde saco SUPABASE_URL y SERVICE ROLE KEY?

1. Abre tu proyecto en Supabase.
2. Ve a **Project Settings → API**.
3. Copia:
   - **Project URL** → `SUPABASE_URL`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Configuración de backend (/api/*)

Las API Routes leen variables de entorno directamente desde el servidor y no las exponen al navegador.

Ejemplo de variables usadas por backend:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_SESSION_TOKEN`

---

## 3. Migraciones en Supabase (paso a paso)

> **No se ejecutan automáticamente.** Debes pegarlas manualmente en el SQL Editor.

1. Abre Supabase → SQL Editor.
2. Copia el contenido de `supabase/migrations/0001_init.sql` y ejecútalo.
3. (Opcional) Copia el contenido de `supabase/migrations/0002_seed.sql` y ejecútalo.

Más detalles en [`supabase/README.md`](supabase/README.md).

---

## 4. Verificación de conexión (RPC ping)

Al cargar la app o al presionar **"Probar conexión"**, se ejecuta:

```
select public.ping();
```

- Si responde, verás **"Conectado OK"**.
- Si falla, la UI muestra el error en lenguaje sencillo.

---

## 5. Catálogo CDC (sin information_schema)

El frontend **no consulta** `information_schema`. En su lugar usa un catálogo
estático en `js/modules/cdcCatalog.js` con:

- `series`: `series_carga` + `series_vinculacion`
- `subseries`: `subseries_carga` + `subseries_vinculacion`

### Override con `CDC_CATALOG`

Si defines un JSON en `CDC_CATALOG`, este reemplaza al catálogo por defecto.
Ejemplo:

```json
{
  "entities": [
    {
      "key": "series",
      "label": "Series",
      "carga": { "table": "series_carga", "fields": ["id", "codigo"] },
      "vinculacion": { "table": "series_vinculacion", "fields": ["id", "entidad"] }
    }
  ]
}
```

---


## Refactor recomendado (Next.js 13+)

Se incluye una referencia lista para usar:

- `lib/supabaseAdmin.ts`
- `app/api/documentos/route.ts`
- `docs/seguridad-supabase-next13.md`

En este patrón, el cliente ya no usa `supabase.from()` ni `SUPABASE_ANON_KEY`;
usa `fetch('/api/documentos')` y toda consulta SQL queda en backend.

## 6. Troubleshooting

| Problema | Posible causa | Solución |
|---|---|---|
| UI dice “Vercel-only” | `/api/env.js` no disponible | Verifica deploy y `vercel.json` |
| Error 401/403 | Sesión inválida o faltante | Revisa cookie/token de sesión (`APP_SESSION_TOKEN`) |
| Error 404 | Tabla inexistente | Ejecuta migraciones y revisa nombre de tabla |
| Ping falla | RPC no creada | Asegúrate de ejecutar `0001_init.sql` |

---

## 7. Seguridad

- ✅ El frontend solo llama a API Routes internas (`/api/...`).
- ✅ `SUPABASE_SERVICE_ROLE_KEY` se usa únicamente en backend (`lib/supabaseAdmin.ts`).
- ❌ **Nunca** expongas `service_role` ni claves en `NEXT_PUBLIC_*`.
- 🔒 El control de acceso se aplica en backend con validación básica de sesión.

---

## Estructura del proyecto

```
/ api/env.js               -> Inyección de variables (Vercel)
/ js/app.js                -> UI y lógica principal
/ js/services/supabaseClient.js
/ js/modules/cdcCatalog.js
/ js/modules/cdcRegistry.js
/ supabase/migrations/...  -> SQL
/ supabase/README.md
/ supabase/types.md
```

---

## Desarrollo local

Este proyecto **no** está diseñado para funcionar en local sin mocks, ya que depende
exclusivamente de `/api/env.js` en Vercel. Puedes simularlo creando un servidor local
que devuelva `window.ENV`, pero el flujo principal es Vercel-only.
