Construye un proyecto DESDE CERO como frontend estático (HTML + JS vanilla ES Modules) desplegable SOLO en Vercel y conectado a Supabase.

VERCEL-ONLY:

- La configuración se inyecta al navegador mediante /api/env.js (serverless en Vercel).
- Si /api/env.js no está disponible o no hay env vars, la UI debe mostrar un aviso claro (“Este proyecto está diseñado para Vercel…”).

OBJETIVO:

1. Deploy en Vercel (static) + serverless /api/env.js.
2. Conexión a Supabase usando SOLO ANON/PUBLISHABLE KEY (nunca service_role en frontend).
3. Comprobación real de conexión mediante RPC public.ping().
4. Interacción con tablas definidas en un catálogo CDC_CATALOG.
5. No consultar information_schema desde el frontend.

ARCHIVOS A CREAR:

- index.html, vercel.json, README.md, .gitignore
- /api/env.js
- /js/app.js
- /js/services/supabaseClient.js
- /js/modules/cdcCatalog.js
- /js/modules/cdcRegistry.js
- /supabase/migrations/0001_init.sql
- /supabase/migrations/0002_seed.sql (opcional)
- /supabase/README.md (guía de migraciones)
- /supabase/types.md (explicación sencilla del modelo de datos)

A) ENV INJECTION (Vercel)

- /api/env.js debe devolver JS que asigne:
  window.**ENV**.SUPABASE_URL
  window.**ENV**.SUPABASE_ANON_KEY
  window.**ENV**.CDC_CATALOG (opcional)
- index.html debe cargar /api/env.js antes del módulo principal.

B) VALIDACIÓN

- Validar URL correcta y existencia de keys.
- Detectar placeholders típicos y mostrar WARNING.
- No mostrar nunca la ANON KEY en UI.

C) PING REAL

- Implementar supabase.rpc("ping") al cargar y con botón “Probar conexión”.
- Si falla, mostrar el error legible.
- Si ok, mostrar “Conectado OK”.

D) CDC_CATALOG (sin information_schema)

- Catálogo por defecto en cdcCatalog.js con entidades:
  - series: series_carga + series_vinculacion
  - subseries: subseries_carga + subseries_vinculacion
- Cada tabla incluye fields sugeridos (id, codigo, nombre, descripcion, created_at, etc.)
- Permitir override por ENV (window.**ENV**.CDC_CATALOG) si llega un JSON string.

E) UI mínima

- Estado de conexión (OK/WARNING/ERROR), botón de ping.
- Lista de entidades del catálogo.
- Acciones: “Cargar filas (carga)” y “Cargar filas (vinculación)”.
- Selector de límite (25/100) y tabla HTML de resultados.
- Errores amigables:
  - 401/403: “RLS/policies bloquean”
  - 404: “Tabla no existe o schema incorrecto”
- No romper la app por errores.

F) MIGRACIONES SUPABASE (crear archivos, no ejecutarlas)

- Crear /supabase/migrations/0001_init.sql que:
  1. Cree las tablas en schema public:
     - series_carga (uuid pk, codigo, nombre, descripcion, created_at)
     - series_vinculacion (uuid pk, serie_id FK -> series_carga, entidad, created_at)
     - subseries_carga (uuid pk, codigo, nombre, descripcion, serie_codigo, created_at)
     - subseries_vinculacion (uuid pk, subserie_id FK -> subseries_carga, entidad, created_at)
  2. Cree la función RPC public.ping() y otorgue permisos a anon/authenticated.
  3. Active RLS en esas tablas y cree policies de SOLO LECTURA para anon (para demo) para que el frontend funcione sin auth.
  4. Cree índices básicos por codigo (opcional).
- Crear /supabase/migrations/0002_seed.sql opcional con algunos inserts de ejemplo.

G) DOCUMENTACIÓN

- README.md principal: paso a paso de Vercel + Supabase (Para principiantes de forma clara, sencilla pero detallada), incluyendo:
  - dónde sacar SUPABASE_URL y ANON KEY
  - cómo ejecutar las migraciones (copiar/pegar el SQL de los archivos en Supabase SQL Editor)
  - troubleshooting (ping vs RLS vs tablas)
  - seguridad (anon en frontend, service_role nunca)
- /supabase/README.md: guía centrada solo en migraciones (qué son, cómo aplicarlas).
- /supabase/types.md: explicación sencilla de tablas y relaciones.

H) Dependencias

- Usar @supabase/supabase-js v2 vía ESM CDN (esm.sh).
- Sin bundlers ni frameworks.

IMPLEMENTA TODO con código completo y claro.
