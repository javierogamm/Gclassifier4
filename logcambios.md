# Log de cambios

## v0.4.0

- Se eliminó el límite configurable de filas para cargar todos los registros disponibles en las consultas.
- Se incorporó una vista jerárquica en formato acordeón para tablas con `codigo_serie` y `posicion`.
- Se añadieron estilos específicos para resaltar los niveles y el detalle de cada serie.

## v0.3.0

- Se añadió un modal para listar valores únicos de "modelo" y aplicar el filtro antes de consultar la tabla de carga.
- Se eliminó el botón de carga para vinculación en el catálogo y se actualizó el botón de carga a selección de cuadro (Carga).
- Se incorporó la versión visible de la aplicación en la interfaz principal.

## v0.2.0

- Se actualizó el esquema de Supabase para reflejar las tablas `series_carga` y `series_vinculacion` con sus nuevas columnas.
- Se ajustó el catálogo CDC para apuntar a los campos reales del modelo de datos actualizado.
- Se renovó el seed de ejemplo para las nuevas estructuras de series.
- Se actualizó la documentación del modelo de datos para las tablas vigentes.

## v0.1.0

- Proyecto inicial Vercel-only con inyección de entorno y UI de conexión a Supabase.
- Catálogo CDC base, migraciones SQL, documentación y configuraciones iniciales.
