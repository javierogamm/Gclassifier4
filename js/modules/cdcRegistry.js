export function listEntities(catalog) {
  if (!catalog || !Array.isArray(catalog.entities)) {
    return [];
  }
  return catalog.entities.map((entity) => ({
    key: entity.key,
    label: entity.label,
    carga: entity.carga,
    vinculacion: entity.vinculacion,
    actividades: entity.actividades,
  }));
}
