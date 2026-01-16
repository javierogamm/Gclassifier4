# Modelo de datos (resumen simple)

El esquema usa cuatro tablas principales en el esquema `public`:

## series_carga

- **id** (uuid, PK)
- **codigo** (text)
- **nombre** (text)
- **descripcion** (text)
- **created_at** (timestamptz)

## series_vinculacion

- **id** (uuid, PK)
- **serie_id** (uuid, FK → series_carga.id)
- **entidad** (text)
- **created_at** (timestamptz)

## subseries_carga

- **id** (uuid, PK)
- **codigo** (text)
- **nombre** (text)
- **descripcion** (text)
- **serie_codigo** (text)
- **created_at** (timestamptz)

## subseries_vinculacion

- **id** (uuid, PK)
- **subserie_id** (uuid, FK → subseries_carga.id)
- **entidad** (text)
- **created_at** (timestamptz)

## Relaciones

- `series_vinculacion.serie_id` apunta a `series_carga.id`.
- `subseries_vinculacion.subserie_id` apunta a `subseries_carga.id`.
