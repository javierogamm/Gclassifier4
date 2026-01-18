# Log de cambios

## v0.20.0

- Se agregó un botón de login en la esquina superior derecha con indicador de sesión activa.
- Se incorporó un modal para iniciar sesión o registrar usuarios contra la tabla `users` (campos id, created_at, name, pass).
- Se guardó el usuario autenticado en almacenamiento local para mantener la sesión al recargar.
- Se actualizó la versión visible de la app.

## v0.19.0

- Se ajustó la carga de series vinculadas para tomar el nombre desde `series_carga` usando la relación con `codigo_serie`.
- Se reforzó el vínculo entre actividades y series para consultar por el campo `actividad` y listar todas las series relacionadas.
- Se reubicaron los modales fuera del contenedor escalado y se elevó su z-index para asegurar que los cuadros de detalle, edición y creación se visualicen correctamente.
- Se actualizó la versión visible de la app.

## v0.18.0

- Se eliminó la referencia a materias en la gestión de actividades y se dejó el acordeón con actividades directas.
- Al expandir una actividad se listan las series vinculadas con código, nombre y modelo asociado desde `series_carga`.
- Se simplificó el modal de edición para ajustar los campos de la tabla de actividades y se retiró la vista en modo tabla.
- Se actualizó la versión visible de la app.

## v0.17.0

- Se agregó control para desplegar/contraer todas las materias en actividades y alternar entre vista acordeón y modo tabla (solo actividades).
- Se reemplazó la edición en línea por un modal de edición de actividad, mostrando código de materia y tabla de series vinculadas.
- Se actualizó la visualización de materias para usar `codigo_materia` y se ajustó la versión visible de la app.

## v0.16.0

- Se reemplazó la vista de actividades por un acordeón jerárquico que agrupa materias y sus actividades en modo colapsado/desplegado.
- Se ajustó el formulario de alta para usar códigos de materia/actividad y nombres, eliminando referencias a código de serie.
- Se restringió la edición de actividades a un flujo explícito con botón "Editar" y guardado manual.
- Se actualizó la versión visible de la app.

## v0.15.0

- Se corrigió el nombre de la tabla de actividades para apuntar a `actividades` en Supabase y evitar el error de caché de esquema.
- Se actualizó la versión visible de la app.

## v0.14.0

- Se añadió la vista de Gestión de actividades con formulario de alta, tabla editable y botón para volver a la gestión de cuadros.
- Se conectó la lectura/escritura de actividades a la nueva tabla `Actividades` en Supabase, incluyendo la ficha de detalles.
- Se eliminó el botón de traducciones del catálogo y se añadió la navegación a actividades desde cada cuadro.
- Se actualizó la versión visible de la app.

## v0.13.0

- Se ajustó el encabezado para eliminar la descripción, mover la versión bajo el ping y actualizar el estilo general según el pantallazo.
- Se actualizó el acordeón para separar `codigo_serie`, nombre y categoría con guiones, mostrar la categoría en la misma línea sin negrita, respetar las mayúsculas de la BDD y compactar la separación entre elementos del mismo nivel.
- Se eliminó el mensaje de “Sin elementos asociados” cuando una serie no tiene hijos.
- Se añadió `last_change` en la tabla `series_carga`, en el catálogo CDC y en la ficha de detalle, actualizándolo en cada creación o edición.
- Se actualizó la versión visible de la app.

## v0.12.0

- Se reubicaron los iconos +/- del acordeón al extremo derecho del título, sin borde circular y con mayor tamaño.
- Se ajustaron tamaños, jerarquías e indentado del acordeón por nivel, incluyendo el `codigo_serie` al mismo tamaño del nombre.
- Se aplicaron reglas tipográficas para secciones/series (negritas, mayúsculas, cursivas en series con hijos) y se eliminó el código redundante en la línea inferior.
- Se actualizó la versión visible de la app.

## v0.11.0

- Se redujo el tamaño visual general de la interfaz en un 15% para una vista más compacta.
- Se agregó la visual de despliegue con icono +/- en el acordeón y se resaltó el `codigo_serie` entre el número jerárquico y el título.
- Se incorporaron los botones "Desplegar todo" y "Contraer todo" junto a los filtros.
- Se actualizó la versión visible de la app.

## v0.10.0

- Se ordenaron siempre los elementos raíz por `codigo_serie` y se añadió numeración jerárquica visible.
- Se incorporó un modal para crear nuevos elementos con selección de categoría disponible y búsqueda de posición en la jerarquía.
- Se ajustó el estilo del botón de detalles para mejorar el contraste en cada barra.
- Se actualizó la versión visible de la app.

## v0.9.0

- Se movió el estado de conexión al encabezado derecho y se eliminó la tarjeta dedicada.
- Se renombró el encabezado principal y el bloque de catálogo a "Gestión de cuadros", mostrando solo botones con nuevas acciones.
- Se actualizó el bloque de resultados para mostrar modelo y cantidad de elementos cargados, además de diferenciar secciones y series por color.
- Se actualizó la versión visible de la app.

## v0.8.0

- Se agregó un botón de guardar en la ficha de detalles para confirmar la edición antes de persistir.
- Se incorporó la actualización en Supabase para los campos editados y la actividad vinculada al guardar.
- Se actualizó la versión visible de la app.

## v0.7.0

- Se actualizó el buscador para incluir los elementos descendientes cuando se encuentra una coincidencia.
- Se ajustó el filtrado para que busque por cadena contenida en los campos disponibles y luego aplique la jerarquía en el cliente.
- Se actualizó la versión visible de la app.

## v0.6.0

- Se ajustó la ficha de detalles para mostrar solo posicion, codigo_serie, titulo_serie, categoria y actividad (desde Vinculación), con campos editables.
- Se centró y amplió el modal de detalles para una visualización más cómoda.
- Se actualizó la versión visible de la app.

## v0.5.0

- Se corrigió el acordeón para mostrar solo los elementos raíz (posicion vacía) y revelar los hijos inmediatos al expandir cada registro.
- Se ajustó la versión visible de la app.

## v0.4.0

- Se eliminó el límite fijo de carga y se añadió paginación automática para traer todas las filas desde Supabase.
- Se reemplazó la tabla de resultados por un listado en acordeón que muestra primero los elementos asociados.
- Se agregó un botón "Ver detalles" que abre una ficha lateral con todos los campos del registro seleccionado.
- Se incorporaron buscadores superiores para código de serie, título de serie y categoría.
- Se actualizó la versión visible de la app.

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
