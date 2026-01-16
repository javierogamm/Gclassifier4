export const DEFAULT_CDC_CATALOG = {
  entities: [
    {
      key: 'series',
      label: 'Series',
      carga: {
        table: 'series_carga',
        fields: ['id', 'codigo', 'nombre', 'descripcion', 'created_at'],
      },
      vinculacion: {
        table: 'series_vinculacion',
        fields: ['id', 'serie_id', 'entidad', 'created_at'],
      },
    },
    {
      key: 'subseries',
      label: 'Subseries',
      carga: {
        table: 'subseries_carga',
        fields: ['id', 'codigo', 'nombre', 'descripcion', 'serie_codigo', 'created_at'],
      },
      vinculacion: {
        table: 'subseries_vinculacion',
        fields: ['id', 'subserie_id', 'entidad', 'created_at'],
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
