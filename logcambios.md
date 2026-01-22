# Log de cambios

## v0.42.6

- El asistente aplica el filtro del modelo sugerido aunque el modal de selección de cuadro esté abierto.
- Se actualizó la versión visible de la app.

## v0.42.5

- El asistente "¿Qué cuadro uso?" aplica el filtro del modelo sugerido al confirmar aunque se esté seleccionando un cuadro en el modal.
- Se actualizó la versión visible de la app.

## v0.42.4

- El asistente aplica el modelo sugerido al confirmar si ya hay un cuadro seleccionado en el catálogo.
- Se actualizó la versión visible de la app.

## v0.42.3

- Se actualizó el árbol de preguntas/respuestas del asistente con el nuevo diagrama y salidas de modelo.
- Se actualizó la versión visible de la app.

## v0.42.2

- Se ajustaron los nombres de modelos sugeridos por el asistente para que coincidan con los registros de base de datos.
- Se actualizó la versión visible de la app.

## v0.42.1

- El asistente "¿Qué cuadro uso?" ahora puede abrirse antes de seleccionar cuadro y aplica el modelo sugerido al elegir un cuadro del catálogo.
- Se actualizó la versión visible de la app.

## v0.42.0

- Se añadió el botón “¿Qué cuadro uso?” visible solo para usuarios con sesión iniciada, que abre un asistente con preguntas para recomendar un modelo.
- El asistente permite navegar paso a paso, volver atrás y confirmar el modelo sugerido para cargarlo en pantalla.
- Se actualizó la versión visible de la app.

## v0.41.0

- Las exportaciones CSV ahora se generan en UTF-8 con separador de columnas compatible con Excel.
- Se actualizó la versión visible de la app.

## v0.40.0

- Se añadió el botón "Exportar todo" visible solo para administradores, que genera un ZIP con los CSV de carga y vinculación de todos los modelos disponibles.
- Se actualizó la versión visible de la app.

## v0.39.0

- El registro de descargas ahora se ejecuta al pulsar Exportar CSV o Exportar PDF, guardando modelo, usuario y tipo de botón.
- Se actualizó la versión visible de la app.

## v0.38.0

- Se añadió la tabla `downloads` y su policy de inserción para registrar exportaciones.
- La exportación CSV y PDF registra el modelo filtrado, usuario y tipo de descarga.
- Se actualizó la versión visible de la app.

## v0.37.0

- La vinculación ahora filtra por el campo `modelo` en consultas de detalle, series vinculadas y exportación CSV.
- El detalle guarda la actividad vinculada respetando el modelo de la serie seleccionada.
- Se actualizó la versión visible de la app.

## v0.36.0

- El selector de nivel superior ahora abre un modal con el cuadro cargado en modo acordeón simplificado para elegir la serie padre.
- El campo de posición en detalle permite cambiar el nivel superior desde el modal y evita seleccionar la misma serie.
- La selección de actividad en detalles mantiene el autocompletado y elimina la lupita.
- Se actualizó la versión visible de la app.

## v0.35.0

- Se reemplazó el script público `/api/env.js` por un endpoint `/api/config` para obtener la configuración sin exponer el archivo en el inspector.
- La app ahora solicita la configuración por fetch antes de inicializar Supabase.
- Se actualizó la versión visible de la app.

## v0.34.0

- El detalle de serie ahora permite buscar y seleccionar actividades con una lupita, además de autocompletar con la tabla de actividades.
- El campo de actividad limpia espacios finales al asignar o al salir del input.
- La actividad del detalle se consulta y guarda contra la tabla de series_vinculacion.
- Se actualizó la versión visible de la app.

## v0.33.3

- El modal de selección de cuadros muestra el mensaje "Selecciona Cuadro de Clasficación".
- La lista de cuadros del modal se presenta a ancho completo, con el botón de "Gestiona" priorizado y scroll cuando es necesario.
- Se actualizó la versión visible de la app.

## v0.33.2

- El filtrado ahora incluye descendientes del elemento coincidente para mantener la jerarquía completa.
- Al buscar, el acordeón se despliega automáticamente para mostrar toda la jerarquía filtrada.
- Se actualizó la versión visible de la app.

## v0.33.1

- El buscador vuelve a incluir los elementos jerárquicamente superiores hasta la raíz.
- Se actualizó la versión visible de la app.

## v0.33.0

- El buscador ahora solo muestra los elementos que coinciden, sin incluir niveles superiores.
- Al guardar cambios en un elemento, el acordeón permanece abierto y conserva el orden actual.
- La ficha de detalle actualiza la información en pantalla sin recargar el listado.
- Se actualizó la versión visible de la app.

## v0.32.0

- Se reemplazaron los botones de aplicar/limpiar filtros y ver detalles por iconos compactos.
- Se movieron los controles de desplegar/contraer justo encima de los acordeones de resultados y actividades.
- Se reubicó el botón de exportar PDF junto al de exportar CSV en el catálogo.
- Se eliminaron los ejemplos en los campos de búsqueda.
- Se actualizó la versión visible de la app.

## v0.31.0

- Se añadió el botón "Histórico de cambios" en el detalle de series para usuarios admin, con modal dedicado.
- El histórico lista los cambios registrados en `carga_historic` e incluye acción de revertir valores.
- La reversión aplica los valores guardados y registra un nuevo apunte en `carga_historic`.
- Se actualizó la versión visible de la app.

## v0.30.0

- Se añadió el registro desde el front en `carga_historic` para cambios en `series_carga`, guardando usuario y valores previos editados.
- Se actualizó la versión visible de la app.

## v0.29.0

- Se añadió el registro automático de histórico para cambios en `series_carga`, guardando los valores previos en `series_carga_historico`.
- Se incluyó la función y trigger de auditoría junto con la definición de la tabla de histórico.
- Se actualizó la versión visible de la app.

## v0.28.0

- Se añadió un botón para exportar en PDF la visualización del acordeón con el modelo e idioma activos.
- La exportación de PDF y CSV ahora solo está disponible para usuarios con sesión iniciada.
- Se actualizó la versión visible de la app.

## v0.27.0

- La exportación CSV de `series_vinculacion` ahora solo incluye filas cuyo `cod` coincide con las series visibles del modelo seleccionado.
- Se eliminó la necesidad de filtrar por `modelo` en la exportación de `series_vinculacion`, tratándola como tabla auxiliar.
- Se actualizó la versión visible de la app.

## v0.26.0

- Se añadió la exportación CSV UTF-8 de la versión e idioma activos para las tablas `series_carga` y `series_vinculacion`.
- Los archivos generados respetan el formato MODELO(_IDIOMA)_CARGA/VINCULACION y los encabezados definidos para RPA.
- Se actualizó la versión visible de la app.

## v0.25.0

- El modal de creación ahora muestra un campo de título por cada idioma disponible en el modelo seleccionado.
- Al guardar, se crean filas por idioma con el mismo código, posición, categoría y modelo, asignando el idioma correspondiente.
- Se actualizó la versión visible de la app.

## v0.24.0

- Se incorporó la selección de idioma al elegir un modelo con columna `idioma`, mostrando un modal para escoger la versión a visualizar.
- Se añadieron botones de idioma junto a “Crear elemento” para alternar la vista sin recargar el modelo.
- Se actualizó la versión visible de la app.

## v0.23.0

- Se normalizaron los matchings entre tablas para ignorar espacios finales en códigos de serie y nombres de actividad.
- Se ajustaron los filtros de texto para comparar valores normalizados sin espacios laterales.
- Se actualizó la versión visible de la app.

## v0.22.0

- Se compactó el espaciado vertical general del encabezado y tarjetas para una vista más baja.
- El título principal quedó alineado a la derecha del estado de conexión.
- Se quitó el mensaje superior de resultados cargados al finalizar la consulta.
- Se eliminó el recuadro de Gestión de cuadros/actividades y se alinearon sus botones a la derecha del título.
- Se actualizó la versión visible de la app.

## v0.21.0

- Se compactó el estado de conexión en una caja superior izquierda, mostrando solo “Conectado OK” y la versión.
- Se añadió el campo `admin` (booleano) en la tabla `users` de Supabase para control de permisos.
- Se restringió la edición y creación de elementos/actividades únicamente a usuarios con `admin` en `true`.
- Se actualizó la versión visible de la app.

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
