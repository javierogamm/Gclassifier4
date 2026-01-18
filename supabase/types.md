# Modelo de datos (resumen simple)

El esquema usa dos tablas principales en el esquema `public`:

## series_vinculacion

- **id** (uuid, PK)
- **nombre_entidad** (text)
- **sobrescribir** (text)
- **cod** (text)
- **actividad** (text)
- **plazos** (text)
- **created_at** (timestamptz)

## series_carga

- **id** (uuid, PK)
- **nombre_entidad** (text)
- **sobrescribir** (text)
- **posicion** (text)
- **codigo_serie** (text)
- **titulo_serie** (text)
- **categoria** (text)
- **unidad_gestora** (text)
- **libro_oficial** (text)
- **nivel_seguridad** (text)
- **advertencia_seguridad** (text)
- **sensibilidad_datos_personales** (text)
- **nivel_confidencialidad** (text)
- **tipo_acceso** (text)
- **condiciones_reutilizacion** (text)
- **codigo_causa_limitacion** (text)
- **normativa** (text)
- **valor_primario** (text)
- **plazo** (text)
- **valor_secundario** (text)
- **dictamen** (text)
- **documento_esencial** (text)
- **accion_dictaminada** (text)
- **ejecucion** (text)
- **motivacion** (text)
- **last_change** (timestamptz)
- **created_at** (timestamptz)

## series_carga_historico

- **id** (uuid, PK)
- **created_at** (timestamptz)
- **original_codigo_serie** (text)
- **original_titulo_serie** (text)
- **change_date** (timestamptz)
- **change_user** (text)
- **original_id** (uuid)
- **original_categoria** (text)
- **original_posicion** (text)
