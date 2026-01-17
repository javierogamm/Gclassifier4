import { createSupabaseClient } from './services/supabaseClient.js';
import { parseCatalogOverride } from './modules/cdcCatalog.js';
import { listEntities } from './modules/cdcRegistry.js';

const statusEl = document.getElementById('status');
const statusIconEl = document.getElementById('status-icon');
const statusTextEl = document.getElementById('status-text');
const statusBadgeEl = document.getElementById('status-badge');
const statusDetailEl = document.getElementById('status-detail');
const pingButton = document.getElementById('ping-button');
const messageEl = document.getElementById('message');
const catalogEl = document.getElementById('catalog');
const resultsEl = document.getElementById('results');
const vercelWarningEl = document.getElementById('vercel-warning');
const modelModalEl = document.getElementById('model-modal');
const modelModalTitleEl = document.getElementById('model-modal-title');
const modelModalMessageEl = document.getElementById('model-modal-message');
const modelModalCloseEl = document.getElementById('model-modal-close');
const modelListEl = document.getElementById('model-list');
const filterFormEl = document.getElementById('filter-form');
const filterCodigoSerieEl = document.getElementById('filter-codigo-serie');
const filterTituloSerieEl = document.getElementById('filter-titulo-serie');
const filterCategoriaEl = document.getElementById('filter-categoria');
const clearFiltersButton = document.getElementById('clear-filters');
const expandAllButton = document.getElementById('expand-all');
const collapseAllButton = document.getElementById('collapse-all');
const resultsTitleEl = document.getElementById('results-title');
const openCreateModalButton = document.getElementById('open-create-modal');
const createModalEl = document.getElementById('create-modal');
const createModalCloseEl = document.getElementById('create-modal-close');
const createFormEl = document.getElementById('create-form');
const createCodigoSerieEl = document.getElementById('create-codigo-serie');
const createTituloSerieEl = document.getElementById('create-titulo-serie');
const createCategoriaEl = document.getElementById('create-categoria');
const createPosicionEl = document.getElementById('create-posicion');
const createPosicionSearchEl = document.getElementById('create-posicion-search');
const createStatusEl = document.getElementById('create-status');
const createSubmitButton = document.getElementById('create-submit');
const positionModalEl = document.getElementById('position-modal');
const positionModalCloseEl = document.getElementById('position-modal-close');
const positionSearchEl = document.getElementById('position-search');
const positionListEl = document.getElementById('position-list');
const detailDrawerEl = document.getElementById('detail-drawer');
const detailDrawerTitleEl = document.getElementById('detail-drawer-title');
const detailDrawerBodyEl = document.getElementById('detail-drawer-body');
const detailDrawerCloseEl = document.getElementById('detail-drawer-close');
const detailDrawerSaveEl = document.getElementById('detail-drawer-save');
const detailDrawerStatusEl = document.getElementById('detail-drawer-status');
const cuadrosViewEl = document.getElementById('cuadros-view');
const activitiesViewEl = document.getElementById('activities-view');
const backToCuadrosButton = document.getElementById('back-to-cuadros');
const activitiesMessageEl = document.getElementById('activities-message');
const activityCreateFormEl = document.getElementById('activity-create-form');
const activityCreateCodigoActividadEl = document.getElementById('activity-create-codigo-actividad');
const activityCreateNombreEl = document.getElementById('activity-create-nombre');
const activityCreateStatusEl = document.getElementById('activity-create-status');
const activitiesAccordionEl = document.getElementById('activities-accordion');
const activitiesExpandAllButton = document.getElementById('activities-expand-all');
const activitiesCollapseAllButton = document.getElementById('activities-collapse-all');
const activityEditModalEl = document.getElementById('activity-edit-modal');
const activityEditCloseEl = document.getElementById('activity-edit-close');
const activityEditFormEl = document.getElementById('activity-edit-form');
const activityEditFieldsEl = document.getElementById('activity-edit-fields');
const activityEditStatusEl = document.getElementById('activity-edit-status');

const PLACEHOLDER_PATTERNS = [
  'your-project',
  'your-supabase',
  'supabase-url',
  'anon-key',
  'service-role',
  'changeme',
  'example',
];

let supabaseClient = null;
let activeCatalog = null;
let pendingModelTable = null;
let activeTable = null;
let activeModelFilter = null;
let activeRows = [];
let actividadesRows = [];
let activityEditContext = null;

const ACTIVITY_FIELD_CANDIDATES = {
  actividadCode: ['codigo_actividad', 'cod_actividad', 'codigo'],
  actividadName: ['nombre_actividad', 'actividad', 'nombre_actividad', 'nombre'],
};
const LINKED_SERIES_FIELD_CANDIDATES = {
  codigoSerie: ['codigo_serie', 'cod', 'codigo'],
  nombre: ['nombre', 'titulo_serie', 'nombre_serie', 'nombre_entidad'],
  modelo: ['modelo', 'nombre_entidad', 'modelo_serie'],
};
const SERIES_CARGA_FIELD_CANDIDATES = {
  codigoSerie: ['codigo_serie', 'cod', 'codigo'],
  modelo: ['modelo', 'nombre_entidad', 'modelo_serie'],
};

async function fetchActividadForCodigoSerie(codigoSerie) {
  if (!supabaseClient || !codigoSerie) return null;
  const actividadesTable = getActividadesTableForActive();
  if (!actividadesTable) return null;

  const { data, error } = await supabaseClient
    .from(actividadesTable)
    .select('actividad')
    .eq('cod', codigoSerie)
    .limit(1);

  if (error) {
    return null;
  }

  return data?.[0]?.actividad ?? null;
}

function getActividadesTableForActive() {
  if (!activeCatalog?.entities || !activeTable) return null;
  const entity = activeCatalog.entities.find((item) => item?.carga?.table === activeTable);
  return entity?.actividades?.table ?? null;
}

function setStatus(state, text, detail, badge = 'ENV') {
  statusEl.dataset.state = state;
  statusIconEl.textContent = state === 'ok' ? '✅' : state === 'error' ? '❌' : '⚠️';
  statusTextEl.textContent = text;
  statusDetailEl.textContent = detail || '';
  statusBadgeEl.textContent = badge;
}

function showMessage(message, isError = false) {
  if (!message) {
    messageEl.textContent = '';
    messageEl.className = 'muted';
    return;
  }
  messageEl.textContent = message;
  messageEl.className = isError ? 'error' : 'muted';
}

function showActivitiesMessage(message, isError = false) {
  if (!activitiesMessageEl) return;
  if (!message) {
    activitiesMessageEl.textContent = '';
    activitiesMessageEl.className = 'muted';
    return;
  }
  activitiesMessageEl.textContent = message;
  activitiesMessageEl.className = isError ? 'error' : 'muted';
}

function updateActivityEditStatus(message, isError = false) {
  if (!activityEditStatusEl) return;
  activityEditStatusEl.textContent = message || '';
  activityEditStatusEl.className = isError ? 'form-status error' : 'form-status';
}

function updateLinkedSeriesStatus(element, message, isError = false) {
  if (!element) return;
  element.textContent = message || '';
  element.className = isError ? 'error' : 'muted';
}

function isPlaceholder(value) {
  if (!value) return true;
  const lower = value.toLowerCase();
  return PLACEHOLDER_PATTERNS.some((pattern) => lower.includes(pattern));
}

function validateConfig(env) {
  if (!env) {
    return { valid: false, reason: 'No se detectó configuración de entorno.' };
  }

  const { SUPABASE_URL: supabaseUrl, SUPABASE_ANON_KEY: supabaseAnonKey } = env;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      valid: false,
      reason: 'Faltan SUPABASE_URL o SUPABASE_ANON_KEY en las variables de entorno.',
    };
  }

  try {
    const parsed = new URL(supabaseUrl);
    if (!parsed.protocol.startsWith('http')) {
      throw new Error('URL inválida');
    }
  } catch (error) {
    return { valid: false, reason: 'SUPABASE_URL no es una URL válida.' };
  }

  if (isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
    return {
      valid: true,
      warning:
        'Detectamos un placeholder en las variables. Verifica que estés usando valores reales de Supabase.',
    };
  }

  return { valid: true };
}

async function pingSupabase() {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de probar la conexión.', true);
    return;
  }

  pingButton.disabled = true;
  showMessage('Probando conexión...', false);

  const { data, error } = await supabaseClient.rpc('ping');

  if (error) {
    const friendly = mapSupabaseError(error);
    setStatus('error', 'Error de conexión', friendly, 'PING');
    showMessage(friendly, true);
  } else {
    setStatus('ok', 'Conectado OK', `Respuesta: ${data || 'pong'}`, 'PING');
    showMessage('RPC ping ejecutado correctamente.', false);
  }

  pingButton.disabled = false;
}

function mapSupabaseError(error) {
  if (!error) return 'Error desconocido.';
  if (error.status === 401 || error.status === 403) {
    return 'RLS/policies bloquean la lectura. Revisa las policies para anon.';
  }
  if (error.status === 404) {
    return 'Tabla no existe o schema incorrecto.';
  }
  return error.message || 'Error inesperado al consultar Supabase.';
}

function normalizeInputValue(value) {
  const normalized = String(value ?? '').trim();
  return normalized === '' ? null : normalized;
}

function updateDetailStatus(message, isError = false) {
  if (!detailDrawerStatusEl) return;
  detailDrawerStatusEl.textContent = message || '';
  detailDrawerStatusEl.className = isError ? 'error' : 'muted';
}

function getSearchFilters() {
  return {
    codigoSerie: filterCodigoSerieEl.value.trim(),
    tituloSerie: filterTituloSerieEl.value.trim(),
    categoria: filterCategoriaEl.value.trim(),
  };
}

function hasSearchFilters(searchFilters) {
  if (!searchFilters) return false;
  return Object.values(searchFilters).some((value) => Boolean(value));
}

function normalizeFilterValue(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase();
}

function rowMatchesField(row, fields, filterValue) {
  if (!filterValue) return true;
  return fields.some((field) => {
    const raw = row?.[field];
    if (raw === null || raw === undefined) return false;
    return String(raw).toLowerCase().includes(filterValue);
  });
}

function rowMatchesSearchFilters(row, normalizedFilters) {
  return (
    rowMatchesField(row, ['codigo_serie', 'cod', 'nombre_serie'], normalizedFilters.codigoSerie) &&
    rowMatchesField(
      row,
      ['titulo_serie', 'nombre_entidad', 'nombre_serie'],
      normalizedFilters.tituloSerie,
    ) &&
    rowMatchesField(row, ['categoria', 'actividad'], normalizedFilters.categoria)
  );
}

async function fetchAllRows(table, modelFilter) {
  const batchSize = 1000;
  let from = 0;
  let allRows = [];
  let hasMore = true;

  while (hasMore) {
    let query = supabaseClient.from(table).select('*').range(from, from + batchSize - 1);
    if (modelFilter) {
      if (modelFilter.isNull) {
        query = query.is('modelo', null);
      } else {
        query = query.eq('modelo', modelFilter.value);
      }
    }

    const { data, error } = await query;
    if (error) {
      return { data: null, error };
    }
    const batch = data || [];
    allRows = allRows.concat(batch);
    if (batch.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
    }
  }

  return { data: allRows, error: null };
}

function renderCatalog(entities) {
  catalogEl.innerHTML = '';
  entities.forEach((entity) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'entity';
    wrapper.innerHTML = `
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button
          class="secondary"
          data-table="${entity.carga.table}"
          data-label="${entity.label}"
          aria-label="Seleccionar cuadro ${entity.label}"
        >
          Seleccionar cuadro
        </button>
        <button
          class="secondary"
          type="button"
          data-actividades-table="${entity.carga.table}"
          data-label="${entity.label}"
        >
          Actividades
        </button>
        <button class="secondary" type="button">Exportar CSV RPA</button>
      </div>
    `;
    catalogEl.appendChild(wrapper);
  });

  catalogEl.querySelectorAll('button[data-table]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      const table = target.getAttribute('data-table');
      const label = target.getAttribute('data-label');
      await openModelModal(table, label);
    });
  });

  catalogEl.querySelectorAll('button[data-actividades-table]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      const table = target.getAttribute('data-actividades-table');
      const label = target.getAttribute('data-label');
      await openActivitiesView(table, label);
    });
  });
}

async function loadRows(table, modelFilter = null) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }

  const filterLabel = modelFilter?.label
    ? ` · Modelo: ${modelFilter.label}`
    : modelFilter?.isNull
      ? ' · Modelo: (sin modelo)'
      : '';
  const searchFilters = getSearchFilters();
  const filterParts = [];
  if (searchFilters.codigoSerie) filterParts.push(`codigo_serie contiene "${searchFilters.codigoSerie}"`);
  if (searchFilters.tituloSerie) filterParts.push(`titulo_serie contiene "${searchFilters.tituloSerie}"`);
  if (searchFilters.categoria) filterParts.push(`categoria contiene "${searchFilters.categoria}"`);
  const searchLabel = filterParts.length ? ` · Filtros: ${filterParts.join(' · ')}` : '';
  showMessage(`Consultando ${table}${filterLabel}${searchLabel}...`, false);

  activeTable = table;
  activeModelFilter = modelFilter;

  const { data, error } = await fetchAllRows(table, modelFilter);

  if (error) {
    const friendly = mapSupabaseError(error);
    showMessage(friendly, true);
    resultsEl.innerHTML = `<p class="error">${friendly}</p>`;
    return;
  }

  const allRows = data || [];
  activeRows = allRows;
  refreshCreateOptions();
  const filteredRows = filterRowsWithHierarchy(allRows, searchFilters);
  renderResults(filteredRows);
  updateResultsTitle(modelFilter, filteredRows.length);
  showMessage(`Resultados cargados: ${filteredRows.length} filas.`, false);
}

function getRowIdentity(row, fallback) {
  const raw =
    row?.nombre_serie ?? row?.codigo_serie ?? row?.cod ?? row?.id ?? row?.nombre_entidad ?? fallback;
  if (raw === null || raw === undefined || raw === '') return fallback;
  return String(raw).trim();
}

function getParentIdentity(row) {
  const raw = row?.posicion;
  if (raw === null || raw === undefined) return null;
  const value = String(raw).trim();
  return value === '' ? null : value;
}

function getCodigoSerieValue(row, fallback = '') {
  const raw = row?.codigo_serie ?? row?.cod ?? row?.nombre_serie ?? fallback;
  return raw === null || raw === undefined ? fallback : String(raw).trim();
}

function sortNodesByCodigoSerie(nodes) {
  return [...nodes].sort((a, b) =>
    getCodigoSerieValue(a.row).localeCompare(getCodigoSerieValue(b.row), 'es', {
      sensitivity: 'base',
      numeric: true,
    }),
  );
}

function buildHierarchy(rows) {
  const nodes = (rows || []).map((row, index) => ({
    identity: getRowIdentity(row, `row-${index + 1}`),
    row,
    children: [],
  }));

  const identityMap = new Map();
  nodes.forEach((node) => {
    if (!identityMap.has(node.identity)) {
      identityMap.set(node.identity, node);
    }
  });

  const roots = [];
  nodes.forEach((node) => {
    const parentIdentity = getParentIdentity(node.row);
    const parentNode =
      parentIdentity && identityMap.has(parentIdentity) ? identityMap.get(parentIdentity) : null;
    if (parentNode && parentNode !== node) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return sortNodesByCodigoSerie(roots);
}

function filterRowsWithHierarchy(rows, searchFilters) {
  if (!hasSearchFilters(searchFilters)) {
    return rows;
  }

  const normalizedFilters = {
    codigoSerie: normalizeFilterValue(searchFilters.codigoSerie),
    tituloSerie: normalizeFilterValue(searchFilters.tituloSerie),
    categoria: normalizeFilterValue(searchFilters.categoria),
  };

  const roots = buildHierarchy(rows);
  const includedIdentities = new Set();

  const includeNodeAndDescendants = (node) => {
    includedIdentities.add(node.identity);
    node.children.forEach((child) => includeNodeAndDescendants(child));
  };

  const visitNode = (node) => {
    if (rowMatchesSearchFilters(node.row, normalizedFilters)) {
      includeNodeAndDescendants(node);
      return;
    }
    node.children.forEach((child) => visitNode(child));
  };

  roots.forEach((root) => visitNode(root));

  return (rows || []).filter((row, index) =>
    includedIdentities.has(getRowIdentity(row, `row-${index + 1}`)),
  );
}

function getToneForCategoria(categoria, depth) {
  if (categoria) {
    const normalized = String(categoria).toLowerCase();
    if (normalized.includes('seccion') || normalized.includes('sección')) {
      return 'section';
    }
    if (normalized.includes('serie')) {
      return 'series';
    }
  }
  return depth === 0 ? 'section' : 'series';
}

function createHierarchyDetails(node, depth = 0, hierarchyLabel = '') {
  const { row } = node;
  const codigoSerie = row?.nombre_serie || row?.codigo_serie || row?.cod || '—';
  const tituloSerie =
    row?.titulo_serie || row?.nombre_entidad || row?.nombre_serie || 'Registro sin título';
  const categoria = row?.categoria || row?.actividad || '—';
  const toneClass = getToneForCategoria(categoria, depth);
  const hierarchyMarkup = hierarchyLabel
    ? `<span class="hierarchy-number">${hierarchyLabel}</span>`
    : '';
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const details = document.createElement('details');
  details.className = `result-item ${toneClass}${hasChildren ? ' has-children' : ''}`;
  details.dataset.depth = depth;
  const summary = document.createElement('summary');
  summary.innerHTML = `
    <div class="result-summary">
      <div class="result-title">
        ${hierarchyMarkup}
        <span class="codigo-serie-badge">${codigoSerie}</span>
        <span class="result-separator">-</span>
        <span class="titulo-serie">${tituloSerie}</span>
        <span class="result-separator">-</span>
        <span class="categoria-serie">${categoria}</span>
        <span class="toggle-icon" aria-hidden="true"></span>
      </div>
    </div>
    <button type="button" class="detail-button">Ver detalles</button>
  `;

  const detailButton = summary.querySelector('button');
  detailButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openDetailDrawer(row, tituloSerie);
  });

  details.appendChild(summary);
  if (node.children && node.children.length > 0) {
    const body = document.createElement('div');
    body.className = 'result-body';
    const childWrapper = document.createElement('div');
    childWrapper.className = 'child-list';
    node.children.forEach((childNode, index) => {
      const childLabel = hierarchyLabel ? `${hierarchyLabel}.${index + 1}` : `${index + 1}`;
      childWrapper.appendChild(createHierarchyDetails(childNode, depth + 1, childLabel));
    });
    body.appendChild(childWrapper);
    details.appendChild(body);
  }

  return details;
}

function renderResults(rows) {
  if (!rows || rows.length === 0) {
    resultsEl.innerHTML = '<p class="muted">No hay filas para mostrar.</p>';
    return;
  }

  const roots = buildHierarchy(rows);
  if (roots.length === 0) {
    resultsEl.innerHTML = '<p class="muted">No hay filas raíz para mostrar.</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'results-list';

  roots.forEach((node, index) => {
    const hierarchyLabel = `${index + 1}`;
    list.appendChild(createHierarchyDetails(node, 0, hierarchyLabel));
  });

  resultsEl.innerHTML = '';
  resultsEl.appendChild(list);
}

function updateResultsTitle(modelFilter, count) {
  if (!resultsTitleEl) return;
  const modelLabel = modelFilter
    ? modelFilter.isNull
      ? '(sin modelo)'
      : modelFilter.label || modelFilter.value
    : 'Todos';
  resultsTitleEl.textContent = `Modelo: ${modelLabel} · Elementos cargados: ${count}`;
}

function setCreateStatus(message, isError = false) {
  if (!createStatusEl) return;
  createStatusEl.textContent = message || '';
  createStatusEl.className = isError ? 'form-status error' : 'form-status';
}

function getUniqueCategorias(rows) {
  const categories = new Set();
  (rows || []).forEach((row) => {
    const raw = row?.categoria;
    if (raw === null || raw === undefined) return;
    const value = String(raw).trim();
    if (value) {
      categories.add(value);
    }
  });
  return Array.from(categories).sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base', numeric: true }),
  );
}

function refreshCreateOptions() {
  if (!createCategoriaEl) return;
  const categories = getUniqueCategorias(activeRows);
  createCategoriaEl.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent =
    categories.length === 0 ? 'Sin categorías disponibles' : 'Selecciona una categoría';
  createCategoriaEl.appendChild(placeholder);
  categories.forEach((categoria) => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    createCategoriaEl.appendChild(option);
  });
}

function openCreateModal() {
  if (!activeTable) {
    showMessage('Selecciona un cuadro del catálogo antes de crear un elemento.', true);
    return;
  }
  setCreateStatus('', false);
  createCodigoSerieEl.value = '';
  createTituloSerieEl.value = '';
  createCategoriaEl.value = '';
  setPositionValue('', 'Raíz');
  createModalEl.hidden = false;
}

function closeCreateModal() {
  createModalEl.hidden = true;
}

function setPositionValue(value, label) {
  const normalizedValue = value ? String(value).trim() : '';
  createPosicionEl.dataset.value = normalizedValue;
  createPosicionEl.value = label || normalizedValue;
  if (!normalizedValue) {
    createPosicionEl.value = '';
    createPosicionEl.placeholder = 'Raíz';
  } else {
    createPosicionEl.placeholder = '';
  }
}

function renderPositionOptions(searchTerm = '') {
  if (!positionListEl) return;
  const normalized = normalizeFilterValue(searchTerm);
  const options = new Map();
  (activeRows || []).forEach((row) => {
    const code = getCodigoSerieValue(row);
    if (!code) return;
    if (!options.has(code)) {
      options.set(code, { value: code, label: code });
    }
  });
  const filteredOptions = Array.from(options.values()).filter((option) =>
    option.label.toLowerCase().includes(normalized),
  );
  filteredOptions.sort((a, b) =>
    a.label.localeCompare(b.label, 'es', { sensitivity: 'base', numeric: true }),
  );
  const shouldShowRoot =
    normalized === '' || 'raíz'.includes(normalized) || 'raiz'.includes(normalized);
  const rootOption = shouldShowRoot ? [{ value: '', label: 'Raíz' }] : [];
  const finalOptions = [...rootOption, ...filteredOptions];
  positionListEl.innerHTML = '';
  if (finalOptions.length === 0) {
    positionListEl.innerHTML = '<p class="muted">No hay resultados.</p>';
    return;
  }
  finalOptions.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = option.label;
    button.addEventListener('click', () => {
      setPositionValue(option.value, option.label);
      closePositionModal();
    });
    positionListEl.appendChild(button);
  });
}

function openPositionModal() {
  positionSearchEl.value = '';
  renderPositionOptions('');
  positionModalEl.hidden = false;
}

function closePositionModal() {
  positionModalEl.hidden = true;
}

async function handleCreateSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) {
    setCreateStatus('Configura Supabase antes de crear.', true);
    return;
  }
  if (!activeTable) {
    setCreateStatus('Selecciona un cuadro antes de crear.', true);
    return;
  }

  const codigoSerie = normalizeInputValue(createCodigoSerieEl.value);
  const tituloSerie = normalizeInputValue(createTituloSerieEl.value);
  if (!codigoSerie || !tituloSerie) {
    setCreateStatus('Completa código y título antes de crear.', true);
    return;
  }

  const categoria = normalizeInputValue(createCategoriaEl.value);
  const posicion = normalizeInputValue(createPosicionEl.dataset.value ?? '');

  const payload = {
    codigo_serie: codigoSerie,
    titulo_serie: tituloSerie,
    last_change: new Date().toISOString(),
  };
  if (categoria !== null) {
    payload.categoria = categoria;
  }
  if (posicion !== null) {
    payload.posicion = posicion;
  }

  createSubmitButton.disabled = true;
  setCreateStatus('Creando elemento...', false);

  const { error } = await supabaseClient.from(activeTable).insert([payload]);
  if (error) {
    setCreateStatus(mapSupabaseError(error), true);
    createSubmitButton.disabled = false;
    return;
  }

  setCreateStatus('Elemento creado correctamente.', false);
  createSubmitButton.disabled = false;
  closeCreateModal();
  if (activeTable) {
    await loadRows(activeTable, activeModelFilter);
  }
}

function closeModelModal() {
  modelModalEl.hidden = true;
  pendingModelTable = null;
  modelModalMessageEl.textContent = '';
  modelListEl.innerHTML = '';
}

async function openModelModal(table, label) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }

  pendingModelTable = table;
  modelModalTitleEl.textContent = `Selecciona un modelo (${label || table})`;
  modelModalMessageEl.textContent = 'Cargando valores disponibles...';
  modelListEl.innerHTML = '';
  modelModalEl.hidden = false;

  let from = 0;
  const batchSize = 1000;
  const allModels = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabaseClient
      .from(table)
      .select('modelo')
      .range(from, from + batchSize - 1);

    if (error) {
      modelModalMessageEl.textContent = mapSupabaseError(error);
      return;
    }

    const batch = data || [];
    allModels.push(...batch);
    if (batch.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
    }
  }

  const uniqueModels = new Map();
  allModels.forEach((row) => {
    const rawValue = row?.modelo;
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      if (!uniqueModels.has('__empty__')) {
        uniqueModels.set('__empty__', { label: '(sin modelo)', value: null, isNull: true });
      }
      return;
    }
    const key = String(rawValue);
    if (!uniqueModels.has(key)) {
      uniqueModels.set(key, { label: key, value: rawValue, isNull: false });
    }
  });

  const modelOptions = Array.from(uniqueModels.values()).sort((a, b) =>
    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
  );

  if (modelOptions.length === 0) {
    modelModalMessageEl.textContent = 'No se encontraron valores en el campo "modelo".';
    return;
  }

  modelModalMessageEl.textContent = 'Selecciona un modelo para aplicar el filtro:';
  modelOptions.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = option.label;
    button.addEventListener('click', async () => {
      const selectedTable = pendingModelTable;
      closeModelModal();
      if (selectedTable) {
        await loadRows(selectedTable, option);
      }
    });
    modelListEl.appendChild(button);
  });
}

async function openDetailDrawer(row, title) {
  detailDrawerTitleEl.textContent = title || 'Detalles del registro';
  detailDrawerBodyEl.innerHTML = '';
  updateDetailStatus('Edita los campos y guarda los cambios para confirmar.', false);
  detailDrawerSaveEl.disabled = false;

  const codigoSerie = row?.codigo_serie ?? row?.cod ?? '';
  detailDrawerEl.dataset.codigoSerie = codigoSerie;
  if (row?.id !== undefined && row?.id !== null) {
    detailDrawerEl.dataset.identityField = 'id';
    detailDrawerEl.dataset.identityValue = row.id;
  } else if (row?.codigo_serie !== undefined && row?.codigo_serie !== null) {
    detailDrawerEl.dataset.identityField = 'codigo_serie';
    detailDrawerEl.dataset.identityValue = row.codigo_serie;
  } else if (row?.cod !== undefined && row?.cod !== null) {
    detailDrawerEl.dataset.identityField = 'cod';
    detailDrawerEl.dataset.identityValue = row.cod;
  } else {
    detailDrawerEl.dataset.identityField = '';
    detailDrawerEl.dataset.identityValue = '';
  }
  const actividad = await fetchActividadForCodigoSerie(codigoSerie);
  const fields = [
    { key: 'posicion', label: 'posicion', value: row?.posicion },
    { key: 'codigo_serie', label: 'codigo_serie', value: codigoSerie },
    { key: 'titulo_serie', label: 'titulo_serie', value: row?.titulo_serie },
    { key: 'categoria', label: 'categoria', value: row?.categoria },
    { key: 'actividad', label: 'actividad', value: actividad },
    { key: 'last_change', label: 'last_change', value: row?.last_change, readOnly: true },
  ];

  fields.forEach(({ key, label, value, readOnly }) => {
    const item = document.createElement('label');
    item.className = 'detail-item';
    const labelEl = document.createElement('span');
    labelEl.className = 'detail-label';
    labelEl.textContent = label;
    const input = document.createElement('input');
    input.className = 'detail-input';
    input.type = 'text';
    input.name = key;
    input.value = value === null || value === undefined ? '' : String(value);
    input.placeholder = '—';
    if (readOnly) {
      input.readOnly = true;
    }
    input.dataset.original = input.value;
    item.appendChild(labelEl);
    item.appendChild(input);
    detailDrawerBodyEl.appendChild(item);
  });

  detailDrawerEl.hidden = false;
}

function closeDetailDrawer() {
  detailDrawerEl.hidden = true;
}

function updateActivityCreateStatus(message, isError = false) {
  if (!activityCreateStatusEl) return;
  activityCreateStatusEl.textContent = message || '';
  activityCreateStatusEl.className = isError ? 'form-status error' : 'form-status';
}

function showActivitiesView() {
  if (cuadrosViewEl) {
    cuadrosViewEl.hidden = true;
  }
  if (activitiesViewEl) {
    activitiesViewEl.hidden = false;
  }
}

function showCuadrosView() {
  if (activitiesViewEl) {
    activitiesViewEl.hidden = true;
  }
  if (cuadrosViewEl) {
    cuadrosViewEl.hidden = false;
  }
}

async function loadActividades(table) {
  if (!supabaseClient) {
    showActivitiesMessage('Configura Supabase antes de consultar actividades.', true);
    return;
  }
  if (!table) {
    showActivitiesMessage('No hay tabla de actividades configurada.', true);
    return;
  }

  showActivitiesMessage(`Consultando ${table}...`, false);
  const { data, error } = await supabaseClient.from(table).select('*');
  if (error) {
    showActivitiesMessage(mapSupabaseError(error), true);
    activitiesAccordionEl.innerHTML = '';
    return;
  }
  actividadesRows = data || [];
  renderActividadesView();
  showActivitiesMessage(`Actividades cargadas: ${actividadesRows.length}`, false);
}

function pickActivityField(candidates, fields, row) {
  return (
    candidates.find((field) => fields.includes(field)) ||
    candidates.find((field) => row?.[field] !== undefined) ||
    candidates[0]
  );
}

function getActivityFieldMap() {
  const entity = activeCatalog?.entities?.find((item) => item?.carga?.table === activeTable);
  const fields = entity?.actividades?.fields ?? [];
  const sampleRow = actividadesRows[0] || {};

  return {
    actividadCode: pickActivityField(ACTIVITY_FIELD_CANDIDATES.actividadCode, fields, sampleRow),
    actividadName: pickActivityField(ACTIVITY_FIELD_CANDIDATES.actividadName, fields, sampleRow),
  };
}

function renderActividadesView() {
  renderActividadesAccordion();
}

function setActivityRowDataset(rowEl, data) {
  rowEl.dataset.identityField = data.identityField;
  rowEl.dataset.identityValue = data.identityValue;
  rowEl.dataset.actividadField = data.actividadField;
  rowEl.dataset.actividadValue = data.actividadValue;
  rowEl.dataset.actividadName = data.actividadName ?? '';
  rowEl.dataset.nameField = data.nameField;
}

function buildActivityRowData(row, fieldMap) {
  const actividadCode = row?.[fieldMap.actividadCode] ?? '';
  const actividadName = row?.[fieldMap.actividadName] ?? '';
  const identityField = row?.id !== undefined && row?.id !== null ? 'id' : '';
  const identityValue = row?.id !== undefined && row?.id !== null ? row.id : '';
  return {
    actividadField: fieldMap.actividadCode,
    actividadValue: actividadCode ?? '',
    actividadName: actividadName ?? '',
    nameField: fieldMap.actividadName,
    identityField,
    identityValue,
  };
}

function renderActividadesAccordion() {
  if (!activitiesAccordionEl) return;
  activitiesAccordionEl.innerHTML = '';
  if (!actividadesRows.length) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'muted';
    emptyMessage.textContent = 'No hay actividades registradas.';
    activitiesAccordionEl.appendChild(emptyMessage);
    return;
  }

  const fieldMap = getActivityFieldMap();
  actividadesRows.forEach((row) => {
    const rowData = buildActivityRowData(row, fieldMap);
    const details = document.createElement('details');
    details.open = false;
    setActivityRowDataset(details, rowData);
    const summary = document.createElement('summary');
    const summaryContent = document.createElement('div');
    summaryContent.className = 'activities-summary';
    const codeSpan = document.createElement('span');
    codeSpan.className = 'code';
    codeSpan.textContent = rowData.actividadValue || '—';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = rowData.actividadName || '—';
    summaryContent.appendChild(codeSpan);
    summaryContent.appendChild(document.createTextNode(' - '));
    summaryContent.appendChild(nameSpan);
    summary.appendChild(summaryContent);
    details.appendChild(summary);

    const content = document.createElement('div');
    content.className = 'activity-detail';

    const linkedHeader = document.createElement('h4');
    linkedHeader.textContent = 'Series vinculadas';
    const linkedStatus = document.createElement('div');
    linkedStatus.className = 'muted';
    const linkedTable = document.createElement('div');
    linkedTable.className = 'activity-linked-table';
    linkedTable.dataset.loaded = 'false';

    const actions = document.createElement('div');
    actions.className = 'activity-row-actions';
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'secondary';
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', (event) => {
      event.stopPropagation();
      openActivityEditModal(details);
    });

    actions.appendChild(editButton);
    content.appendChild(actions);
    content.appendChild(linkedHeader);
    content.appendChild(linkedStatus);
    content.appendChild(linkedTable);

    details.appendChild(content);

    details.addEventListener('toggle', () => {
      if (!details.open) return;
      if (linkedTable.dataset.loaded === 'true') return;
      loadLinkedSeriesForActivity(rowData.actividadName || rowData.actividadValue, linkedStatus, linkedTable);
    });

    activitiesAccordionEl.appendChild(details);
  });
}

function getEditableActivityFields() {
  const entity = activeCatalog?.entities?.find((item) => item?.carga?.table === activeTable);
  const fields = entity?.actividades?.fields ?? [];
  const sampleRow = actividadesRows[0] || {};
  const baseFields = fields.length ? fields : Object.keys(sampleRow);
  return baseFields.filter((field) => !['id', 'created_at'].includes(field));
}

function getActivityFieldLabel(field, fieldMap) {
  if (field === fieldMap.actividadCode) return 'Código de actividad';
  if (field === fieldMap.actividadName) return 'Nombre de actividad';
  return field.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function updateActividadFields(context, updates) {
  if (!supabaseClient) {
    updateActivityEditStatus('Configura Supabase antes de guardar.', true);
    return false;
  }
  const table = getActividadesTableForActive();
  if (!table) {
    updateActivityEditStatus('No hay tabla de actividades configurada.', true);
    return false;
  }
  if (!updates || Object.keys(updates).length === 0) {
    updateActivityEditStatus('No hay cambios para guardar.', false);
    return false;
  }
  let query = supabaseClient.from(table).update(updates);
  if (context.identityField && context.identityValue) {
    query = query.eq(context.identityField, context.identityValue);
  } else if (context.actividadField && context.actividadValue) {
    query = query.eq(context.actividadField, context.actividadValue);
  } else {
    updateActivityEditStatus('No se pudo identificar la actividad para guardar.', true);
    return false;
  }
  const { error } = await query;
  if (error) {
    updateActivityEditStatus(mapSupabaseError(error), true);
    return false;
  }
  updateActivityEditStatus('Actividad actualizada.', false);
  return true;
}

function updateActivityRowDisplay(rowEl, updates, fieldMap) {
  const details = rowEl.closest('details');
  if (updates[fieldMap.actividadName] !== undefined) {
    rowEl.dataset.actividadName = updates[fieldMap.actividadName] ?? '';
    const nameLabel = details?.querySelector('.activities-summary .name');
    if (nameLabel) nameLabel.textContent = updates[fieldMap.actividadName] || '—';
  }
  if (updates[fieldMap.actividadCode] !== undefined) {
    rowEl.dataset.actividadValue = updates[fieldMap.actividadCode] ?? '';
    const codeLabel = details?.querySelector('.activities-summary .code');
    if (codeLabel) codeLabel.textContent = updates[fieldMap.actividadCode] || '—';
  }
}

function updateActividadesRowsData(context, updates) {
  if (!context || !updates) return;
  const matchById = context.identityField && context.identityValue;
  const matchByKeys = context.actividadField;
  const targetIndex = actividadesRows.findIndex((row) => {
    if (matchById) {
      return row?.[context.identityField] === context.identityValue;
    }
    if (matchByKeys) {
      return row?.[context.actividadField] === context.actividadValue;
    }
    return false;
  });
  if (targetIndex >= 0) {
    Object.entries(updates).forEach(([key, value]) => {
      actividadesRows[targetIndex][key] = value;
    });
  }
}

function openActivityEditModal(rowEl) {
  if (!activityEditModalEl || !activityEditFieldsEl) return;
  const context = {
    identityField: rowEl.dataset.identityField,
    identityValue: rowEl.dataset.identityValue,
    actividadField: rowEl.dataset.actividadField,
    actividadValue: rowEl.dataset.actividadValue,
    actividadName: rowEl.dataset.actividadName ?? '',
    nameField: rowEl.dataset.nameField || 'actividad',
    rowEl,
  };
  activityEditContext = context;
  activityEditFieldsEl.innerHTML = '';
  const fieldMap = getActivityFieldMap();
  const editableFields = getEditableActivityFields();
  const rowData = actividadesRows.find((row) => {
    if (context.identityField && context.identityValue) {
      return row?.[context.identityField] === context.identityValue;
    }
    return row?.[context.actividadField] === context.actividadValue;
  }) || {};
  editableFields.forEach((field) => {
    const label = document.createElement('label');
    label.textContent = getActivityFieldLabel(field, fieldMap);
    const input = document.createElement('input');
    input.type = 'text';
    input.name = field;
    input.value = rowData?.[field] ?? '';
    input.dataset.original = input.value;
    if (field === fieldMap.actividadName) {
      input.required = true;
    }
    label.appendChild(input);
    activityEditFieldsEl.appendChild(label);
  });
  updateActivityEditStatus('', false);
  activityEditModalEl.hidden = false;
}

function closeActivityEditModal() {
  if (!activityEditModalEl) return;
  activityEditModalEl.hidden = true;
  activityEditContext = null;
}

async function handleActivityEditSubmit(event) {
  event.preventDefault();
  if (!activityEditContext) return;
  const inputs = Array.from(activityEditFieldsEl.querySelectorAll('input[name]'));
  const updates = {};
  const missingRequired = inputs.some((input) => input.required && !normalizeInputValue(input.value));
  if (missingRequired) {
    updateActivityEditStatus('Completa los campos obligatorios antes de guardar.', true);
    return;
  }
  inputs.forEach((input) => {
    const currentValue = normalizeInputValue(input.value);
    const originalValue = normalizeInputValue(input.dataset.original ?? '');
    if (currentValue !== originalValue) {
      updates[input.name] = currentValue;
    }
  });
  if (Object.keys(updates).length === 0) {
    updateActivityEditStatus('No hay cambios para guardar.', false);
    return;
  }
  updateActivityEditStatus('Guardando cambios...', false);
  const saved = await updateActividadFields(activityEditContext, updates);
  if (!saved) return;
  inputs.forEach((input) => {
    if (updates[input.name] !== undefined) {
      input.dataset.original = input.value;
    }
  });
  const fieldMap = getActivityFieldMap();
  updateActivityRowDisplay(activityEditContext.rowEl, updates, fieldMap);
  if (updates[fieldMap.actividadName] !== undefined) {
    const details = activityEditContext.rowEl.closest('details');
    const linkedTable = details?.querySelector('.activity-linked-table');
    if (linkedTable) {
      linkedTable.dataset.loaded = 'false';
      linkedTable.innerHTML = '';
      if (details?.open) {
        const statusEl = details.querySelector('.activity-detail .muted');
        loadLinkedSeriesForActivity(updates[fieldMap.actividadName], statusEl, linkedTable);
      }
    }
  }
  updateActividadesRowsData(activityEditContext, updates);
}

function getLinkedSeriesFieldMap(rows) {
  const sampleRow = rows?.[0] ?? {};
  return {
    codigoSerie: pickActivityField(LINKED_SERIES_FIELD_CANDIDATES.codigoSerie, Object.keys(sampleRow), sampleRow),
    nombre: pickActivityField(LINKED_SERIES_FIELD_CANDIDATES.nombre, Object.keys(sampleRow), sampleRow),
  };
}

function getSeriesCargaFieldMap(rows) {
  const sampleRow = rows?.[0] ?? {};
  return {
    codigoSerie: pickActivityField(SERIES_CARGA_FIELD_CANDIDATES.codigoSerie, Object.keys(sampleRow), sampleRow),
    modelo: pickActivityField(SERIES_CARGA_FIELD_CANDIDATES.modelo, Object.keys(sampleRow), sampleRow),
  };
}

function renderLinkedSeriesTable(rows, tableEl) {
  if (!tableEl) return;
  tableEl.innerHTML = '';
  if (!rows?.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No hay series vinculadas.';
    tableEl.appendChild(empty);
    return;
  }
  const table = document.createElement('table');
  table.className = 'data-table';
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Código de serie', 'Nombre', 'Modelo'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const codigoCell = document.createElement('td');
    codigoCell.textContent = row?.codigo ?? '—';
    const nombreCell = document.createElement('td');
    nombreCell.textContent = row?.nombre ?? '—';
    const modeloCell = document.createElement('td');
    modeloCell.textContent = row?.modelo ?? '—';
    tr.appendChild(codigoCell);
    tr.appendChild(nombreCell);
    tr.appendChild(modeloCell);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableEl.appendChild(table);
}

async function loadLinkedSeriesForActivity(actividadValue, statusEl, tableEl) {
  if (!supabaseClient) {
    updateLinkedSeriesStatus(statusEl, 'Configura Supabase antes de consultar series vinculadas.', true);
    renderLinkedSeriesTable([], tableEl);
    return;
  }
  if (!actividadValue) {
    updateLinkedSeriesStatus(statusEl, 'No se pudo identificar la actividad para vinculación.', true);
    renderLinkedSeriesTable([], tableEl);
    return;
  }
  updateLinkedSeriesStatus(statusEl, 'Consultando series vinculadas...', false);
  const { data, error } = await supabaseClient
    .from('series_vinculacion')
    .select('*')
    .eq('actividad', actividadValue);
  if (error) {
    updateLinkedSeriesStatus(statusEl, mapSupabaseError(error), true);
    renderLinkedSeriesTable([], tableEl);
    return;
  }
  if (!data?.length) {
    updateLinkedSeriesStatus(statusEl, 'Series vinculadas: 0', false);
    renderLinkedSeriesTable([], tableEl);
    if (tableEl) tableEl.dataset.loaded = 'true';
    return;
  }

  const vinculacionMap = getLinkedSeriesFieldMap(data);
  const codes = Array.from(
    new Set(
      data
        .map((row) => row?.[vinculacionMap.codigoSerie])
        .filter((codigo) => codigo && String(codigo).trim() !== '')
    )
  );

  let cargaRows = [];
  if (codes.length) {
    const { data: cargaData, error: cargaError } = await supabaseClient
      .from('series_carga')
      .select('*')
      .in('codigo_serie', codes);
    if (!cargaError) {
      cargaRows = cargaData || [];
    }
  }

  const cargaMap = getSeriesCargaFieldMap(cargaRows);
  const cargaByCode = new Map(
    cargaRows.map((row) => [row?.[cargaMap.codigoSerie], row?.[cargaMap.modelo]])
  );

  const mergedRows = data.map((row) => ({
    codigo: row?.[vinculacionMap.codigoSerie] ?? '—',
    nombre: row?.[vinculacionMap.nombre] ?? '—',
    modelo: cargaByCode.get(row?.[vinculacionMap.codigoSerie]) ?? '—',
  }));

  updateLinkedSeriesStatus(statusEl, `Series vinculadas: ${mergedRows.length}`, false);
  renderLinkedSeriesTable(mergedRows, tableEl);
  if (tableEl) tableEl.dataset.loaded = 'true';
}

async function handleActivityCreateSubmit(event) {
  event.preventDefault();
  if (!supabaseClient) {
    updateActivityCreateStatus('Configura Supabase antes de guardar.', true);
    return;
  }
  const table = getActividadesTableForActive();
  if (!table) {
    updateActivityCreateStatus('No hay tabla de actividades configurada.', true);
    return;
  }
  const codigoActividad = normalizeInputValue(activityCreateCodigoActividadEl.value);
  const actividadNombre = normalizeInputValue(activityCreateNombreEl.value);
  if (!codigoActividad || !actividadNombre) {
    updateActivityCreateStatus('Completa código y nombre de la actividad.', true);
    return;
  }
  const fieldMap = getActivityFieldMap();
  updateActivityCreateStatus('Guardando actividad...', false);
  const payload = {
    [fieldMap.actividadCode]: codigoActividad,
    [fieldMap.actividadName]: actividadNombre,
  };
  const { error } = await supabaseClient.from(table).insert([payload]);
  if (error) {
    updateActivityCreateStatus(mapSupabaseError(error), true);
    return;
  }
  updateActivityCreateStatus('Actividad guardada.', false);
  activityCreateCodigoActividadEl.value = '';
  activityCreateNombreEl.value = '';
  await loadActividades(table);
}

async function openActivitiesView(table, label) {
  if (!table) {
    showMessage('No hay tabla de actividades configurada para este cuadro.', true);
    return;
  }
  activeTable = table;
  activeModelFilter = null;
  showActivitiesView();
  updateActivityCreateStatus('', false);
  showActivitiesMessage(`Gestión de actividades para ${label}.`, false);
  await loadActividades(getActividadesTableForActive());
}

async function saveDetailChanges() {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de guardar cambios.', true);
    return;
  }
  if (!activeTable) {
    showMessage('Selecciona un cuadro del catálogo antes de guardar.', true);
    return;
  }

  const identityField = detailDrawerEl.dataset.identityField;
  const identityValue = detailDrawerEl.dataset.identityValue;
  if (!identityField) {
    updateDetailStatus('No se pudo identificar el registro para guardar.', true);
    return;
  }

  const inputs = Array.from(detailDrawerBodyEl.querySelectorAll('input[name]'));
  const updates = {};
  let actividadUpdate = null;
  let actividadChanged = false;

  inputs.forEach((input) => {
    const key = input.name;
    const currentValue = normalizeInputValue(input.value);
    const originalValue = normalizeInputValue(input.dataset.original ?? '');
    if (key === 'last_change') {
      return;
    }
    if (key === 'actividad') {
      if (currentValue !== originalValue) {
        actividadUpdate = currentValue;
        actividadChanged = true;
      }
      return;
    }
    if (currentValue !== originalValue) {
      updates[key] = currentValue;
    }
  });

  const hasMainUpdates = Object.keys(updates).length > 0;
  const actividadesTable = getActividadesTableForActive();
  const codigoSerie = detailDrawerEl.dataset.codigoSerie;
  const shouldUpdateActividad = actividadChanged && actividadesTable && codigoSerie;

  if (!hasMainUpdates && !shouldUpdateActividad) {
    updateDetailStatus('No hay cambios para guardar.', false);
    return;
  }

  detailDrawerSaveEl.disabled = true;
  updateDetailStatus('Guardando cambios...', false);

  try {
    const lastChange = new Date().toISOString();
    if (hasMainUpdates) {
      updates.last_change = lastChange;
      const { error } = await supabaseClient
        .from(activeTable)
        .update(updates)
        .eq(identityField, identityValue);
      if (error) {
        throw error;
      }
    } else if (shouldUpdateActividad) {
      const { error } = await supabaseClient
        .from(activeTable)
        .update({ last_change: lastChange })
        .eq(identityField, identityValue);
      if (error) {
        throw error;
      }
    }

    if (shouldUpdateActividad) {
      const { error } = await supabaseClient
        .from(actividadesTable)
        .update({ actividad: actividadUpdate })
        .eq('cod', codigoSerie);
      if (error) {
        throw error;
      }
    }

    inputs.forEach((input) => {
      if (input.name === 'last_change') {
        input.value = lastChange;
      }
      input.dataset.original = input.value;
    });

    updateDetailStatus('Cambios guardados en Supabase.', false);
    if (activeTable) {
      await loadRows(activeTable, activeModelFilter);
    }
  } catch (error) {
    updateDetailStatus(mapSupabaseError(error), true);
  } finally {
    detailDrawerSaveEl.disabled = false;
  }
}

function init() {
  const env = window.ENV;

  updateResultsTitle(null, 0);

  if (!env) {
    vercelWarningEl.hidden = false;
    setStatus('warning', 'Sin /api/env.js', 'No se encontró configuración de entorno.', 'ENV');
    pingButton.disabled = true;
    renderCatalog([]);
    return;
  }

  const { catalog, warning } = parseCatalogOverride(env.CDC_CATALOG);
  activeCatalog = catalog;
  const entities = listEntities(activeCatalog);
  renderCatalog(entities);

  if (warning) {
    showMessage(warning, true);
  }

  const validation = validateConfig(env);
  if (!validation.valid) {
    vercelWarningEl.hidden = false;
    setStatus('warning', 'Configuración incompleta', validation.reason, 'ENV');
    pingButton.disabled = true;
    return;
  }

  if (validation.warning) {
    setStatus('warning', 'Configura Supabase', validation.warning, 'ENV');
  } else {
    setStatus('ok', 'Configuración lista', 'Variables cargadas correctamente.', 'ENV');
  }

  supabaseClient = createSupabaseClient({
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
  });

  pingButton.disabled = false;
  pingSupabase();
}

pingButton.addEventListener('click', pingSupabase);
modelModalCloseEl.addEventListener('click', closeModelModal);
openCreateModalButton.addEventListener('click', openCreateModal);
createModalCloseEl.addEventListener('click', closeCreateModal);
createPosicionSearchEl.addEventListener('click', openPositionModal);
positionModalCloseEl.addEventListener('click', closePositionModal);
positionSearchEl.addEventListener('input', (event) => {
  renderPositionOptions(event.target.value);
});
createFormEl.addEventListener('submit', handleCreateSubmit);
detailDrawerCloseEl.addEventListener('click', closeDetailDrawer);
detailDrawerSaveEl.addEventListener('click', saveDetailChanges);
detailDrawerEl.addEventListener('click', (event) => {
  if (event.target === detailDrawerEl) {
    closeDetailDrawer();
  }
});
backToCuadrosButton.addEventListener('click', () => {
  showCuadrosView();
});
activityCreateFormEl.addEventListener('submit', handleActivityCreateSubmit);
if (activitiesExpandAllButton) {
  activitiesExpandAllButton.addEventListener('click', () => {
    if (!activitiesAccordionEl) return;
    activitiesAccordionEl.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    });
  });
}
if (activitiesCollapseAllButton) {
  activitiesCollapseAllButton.addEventListener('click', () => {
    if (!activitiesAccordionEl) return;
    activitiesAccordionEl.querySelectorAll('details').forEach((detail) => {
      detail.open = false;
    });
  });
}
if (activityEditCloseEl) {
  activityEditCloseEl.addEventListener('click', closeActivityEditModal);
}
if (activityEditFormEl) {
  activityEditFormEl.addEventListener('submit', handleActivityEditSubmit);
}
if (activityEditModalEl) {
  activityEditModalEl.addEventListener('click', (event) => {
    if (event.target === activityEditModalEl) {
      closeActivityEditModal();
    }
  });
}
modelModalEl.addEventListener('click', (event) => {
  if (event.target === modelModalEl) {
    closeModelModal();
  }
});
createModalEl.addEventListener('click', (event) => {
  if (event.target === createModalEl) {
    closeCreateModal();
  }
});
positionModalEl.addEventListener('click', (event) => {
  if (event.target === positionModalEl) {
    closePositionModal();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!modelModalEl.hidden) {
      closeModelModal();
    }
    if (!createModalEl.hidden) {
      closeCreateModal();
    }
    if (!positionModalEl.hidden) {
      closePositionModal();
    }
    if (!detailDrawerEl.hidden) {
      closeDetailDrawer();
    }
    if (activityEditModalEl && !activityEditModalEl.hidden) {
      closeActivityEditModal();
    }
  }
});

filterFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!activeTable) {
    showMessage('Selecciona un cuadro del catálogo antes de aplicar filtros.', true);
    return;
  }
  await loadRows(activeTable, activeModelFilter);
});

clearFiltersButton.addEventListener('click', async () => {
  filterCodigoSerieEl.value = '';
  filterTituloSerieEl.value = '';
  filterCategoriaEl.value = '';
  if (activeTable) {
    await loadRows(activeTable, activeModelFilter);
  } else {
    showMessage('Filtros limpiados. Selecciona un cuadro para ver resultados.', false);
  }
});

expandAllButton.addEventListener('click', () => {
  if (!resultsEl) return;
  resultsEl.querySelectorAll('details').forEach((detail) => {
    detail.open = true;
  });
});

collapseAllButton.addEventListener('click', () => {
  if (!resultsEl) return;
  resultsEl.querySelectorAll('details').forEach((detail) => {
    detail.open = false;
  });
});

init();
