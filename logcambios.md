# Log de cambios

## v0.3.0

- Se eliminó el selector de límite y ahora se consulta la base de datos completa al cargar datos.
- Los botones del catálogo pasan a "Seleccionar cuadro" y permiten elegir un modelo disponible para filtrar resultados.
- Se añadió selector de modelos en la interfaz y se actualizó la versión visible de la app.

## v0.2.0

- Se actualizó el esquema de Supabase para reflejar las tablas `series_carga` y `series_vinculacion` con sus nuevas columnas.
- Se ajustó el catálogo CDC para apuntar a los campos reales del modelo de datos actualizado.
- Se renovó el seed de ejemplo para las nuevas estructuras de series.
- Se actualizó la documentación del modelo de datos para las tablas vigentes.

## v0.1.0

- Proyecto inicial Vercel-only con inyección de entorno y UI de conexión a Supabase.
- Catálogo CDC base, migraciones SQL, documentación y configuraciones iniciales.
