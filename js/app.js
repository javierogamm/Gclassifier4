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
const detailDrawerEl = document.getElementById('detail-drawer');
const detailDrawerTitleEl = document.getElementById('detail-drawer-title');
const detailDrawerBodyEl = document.getElementById('detail-drawer-body');
const detailDrawerCloseEl = document.getElementById('detail-drawer-close');

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

function getSearchFilters() {
  return {
    codigoSerie: filterCodigoSerieEl.value.trim(),
    tituloSerie: filterTituloSerieEl.value.trim(),
    categoria: filterCategoriaEl.value.trim(),
  };
}

async function fetchAllRows(table, modelFilter, searchFilters) {
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

    if (searchFilters?.codigoSerie) {
      query = query.ilike('codigo_serie', `%${searchFilters.codigoSerie}%`);
    }
    if (searchFilters?.tituloSerie) {
      query = query.ilike('titulo_serie', `%${searchFilters.tituloSerie}%`);
    }
    if (searchFilters?.categoria) {
      query = query.ilike('categoria', `%${searchFilters.categoria}%`);
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
      <div>
        <strong>${entity.label}</strong>
        <div class="muted">Carga: ${entity.carga.table} · Vinculación: ${entity.vinculacion.table}</div>
      </div>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button class="secondary" data-table="${entity.carga.table}" data-label="${entity.label}">Seleccionar cuadro (Carga)</button>
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

  const { data, error } = await fetchAllRows(table, modelFilter, searchFilters);

  if (error) {
    const friendly = mapSupabaseError(error);
    showMessage(friendly, true);
    resultsEl.innerHTML = `<p class="error">${friendly}</p>`;
    return;
  }

  renderResults(data || []);
  showMessage(`Resultados cargados: ${data?.length || 0} filas.`, false);
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

  return roots;
}

function createHierarchyDetails(node) {
  const { row } = node;
  const codigoSerie = row?.nombre_serie || row?.codigo_serie || row?.cod || '—';
  const tituloSerie =
    row?.titulo_serie || row?.nombre_entidad || row?.nombre_serie || 'Registro sin título';
  const categoria = row?.categoria || row?.actividad || '—';

  const details = document.createElement('details');
  details.className = 'result-item';
  const summary = document.createElement('summary');
  summary.innerHTML = `
    <div class="result-summary">
      <strong>${tituloSerie}</strong>
      <div class="result-meta">
        <span><strong>Código:</strong> ${codigoSerie}</span>
        <span><strong>Categoría:</strong> ${categoria}</span>
      </div>
    </div>
    <button type="button" class="secondary">Ver detalles</button>
  `;

  const detailButton = summary.querySelector('button');
  detailButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openDetailDrawer(row, tituloSerie);
  });

  const body = document.createElement('div');
  body.className = 'result-body';
  if (!node.children || node.children.length === 0) {
    body.innerHTML = '<p class="muted">Sin elementos asociados.</p>';
  } else {
    const childWrapper = document.createElement('div');
    childWrapper.className = 'child-list';
    node.children.forEach((childNode) => {
      childWrapper.appendChild(createHierarchyDetails(childNode));
    });
    body.appendChild(childWrapper);
  }

  details.appendChild(summary);
  details.appendChild(body);

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

  roots.forEach((node) => {
    list.appendChild(createHierarchyDetails(node));
  });

  resultsEl.innerHTML = '';
  resultsEl.appendChild(list);
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

function openDetailDrawer(row, title) {
  detailDrawerTitleEl.textContent = title || 'Detalles del registro';
  detailDrawerBodyEl.innerHTML = '';

  Object.entries(row || {}).forEach(([key, value]) => {
    const item = document.createElement('div');
    item.className = 'detail-item';
    const label = document.createElement('strong');
    label.textContent = key;
    const valueEl = document.createElement('span');
    if (value === null || value === undefined || value === '') {
      valueEl.textContent = '—';
    } else if (typeof value === 'object') {
      valueEl.textContent = JSON.stringify(value);
    } else {
      valueEl.textContent = String(value);
    }
    item.appendChild(label);
    item.appendChild(valueEl);
    detailDrawerBodyEl.appendChild(item);
  });

  detailDrawerEl.hidden = false;
}

function closeDetailDrawer() {
  detailDrawerEl.hidden = true;
}

function init() {
  const env = window.ENV;

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
detailDrawerCloseEl.addEventListener('click', closeDetailDrawer);
detailDrawerEl.addEventListener('click', (event) => {
  if (event.target === detailDrawerEl) {
    closeDetailDrawer();
  }
});
modelModalEl.addEventListener('click', (event) => {
  if (event.target === modelModalEl) {
    closeModelModal();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!modelModalEl.hidden) {
      closeModelModal();
    }
    if (!detailDrawerEl.hidden) {
      closeDetailDrawer();
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

init();
