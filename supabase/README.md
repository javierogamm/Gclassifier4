# Migraciones Supabase

Estas migraciones definen el esquema mínimo para probar el frontend. Se aplican de forma manual
usando el **SQL Editor** de Supabase.

## ¿Qué son las migraciones?

Una migración es un archivo SQL que describe cambios incrementales en la base de datos. En este
proyecto no se ejecutan automáticamente: tú decides cuándo aplicar cada archivo.

## Cómo aplicar las migraciones

1. Abre tu proyecto en Supabase.
2. Ve a **SQL Editor**.
3. Abre el archivo `supabase/migrations/0001_init.sql`, copia el contenido y pégalo en el editor.
4. Ejecuta el script y verifica que las tablas y la función `public.ping()` existan.
5. (Opcional) Abre `supabase/migrations/0002_seed.sql`, copia el contenido y ejecútalo para insertar
   datos de ejemplo.

## Notas

- Las policies habilitan **solo lectura** para el rol `anon`.
- Si cambias los nombres de tablas, actualiza el catálogo CDC o la variable `CDC_CATALOG`.
