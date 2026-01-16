export const DEFAULT_CDC_CATALOG = {
  entities: [
    {
      key: 'series',
      label: 'Series',
      carga: {
        table: 'series_carga',
        fields: [
          'id',
          'nombre_entidad',
          'sobrescribir',
          'posicion',
          'codigo_serie',
          'titulo_serie',
          'categoria',
          'unidad_gestora',
          'libro_oficial',
          'nivel_seguridad',
          'advertencia_seguridad',
          'sensibilidad_datos_personales',
          'nivel_confidencialidad',
          'tipo_acceso',
          'condiciones_reutilizacion',
          'codigo_causa_limitacion',
          'normativa',
          'valor_primario',
          'plazo',
          'valor_secundario',
          'dictamen',
          'documento_esencial',
          'accion_dictaminada',
          'ejecucion',
          'motivacion',
          'created_at',
        ],
      },
      vinculacion: {
        table: 'series_vinculacion',
        fields: [
          'id',
          'nombre_entidad',
          'sobrescribir',
          'cod',
          'actividad',
          'plazos',
          'created_at',
        ],
      },
    },
  ],
};

export function parseCatalogOverride(catalogJson) {
  if (!catalogJson) {
    return { catalog: DEFAULT_CDC_CATALOG, warning: null };
  }

  try {
    const parsed = JSON.parse(catalogJson);
    if (!parsed || !Array.isArray(parsed.entities)) {
      return {
        catalog: DEFAULT_CDC_CATALOG,
        warning: 'CDC_CATALOG no tiene el formato esperado. Se usó el catálogo por defecto.',
      };
    }
    return { catalog: parsed, warning: null };
  } catch (error) {
    return {
      catalog: DEFAULT_CDC_CATALOG,
      warning: 'CDC_CATALOG no es un JSON válido. Se usó el catálogo por defecto.',
    };
  }
}
