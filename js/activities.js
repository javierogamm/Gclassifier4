import { createSupabaseClient } from './services/supabaseClient.js';
import { parseCatalogOverride, DEFAULT_CDC_CATALOG } from './modules/cdcCatalog.js';

const statusEl = document.getElementById('status');
const statusIconEl = document.getElementById('status-icon');
const statusTextEl = document.getElementById('status-text');
const statusBadgeEl = document.getElementById('status-badge');
const statusDetailEl = document.getElementById('status-detail');
const messageEl = document.getElementById('message');
const vercelWarningEl = document.getElementById('vercel-warning');
const resultsEl = document.getElementById('results');
const resultsTitleEl = document.getElementById('results-title');
const filterFormEl = document.getElementById('filter-form');
const filterCodigoEl = document.getElementById('filter-codigo');
const filterMateriaEl = document.getElementById('filter-materia');
const filterActividadEl = document.getElementById('filter-actividad');
const clearFiltersButton = document.getElementById('clear-filters');
const viewCollapsedButton = document.getElementById('view-collapsed');
const viewExpandedButton = document.getElementById('view-expanded');
const detailModalEl = document.getElementById('detail-modal');
const detailModalTitleEl = document.getElementById('detail-modal-title');
const detailModalBodyEl = document.getElementById('detail-modal-body');
const detailModalCloseEl = document.getElementById('detail-modal-close');

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
let activeRows = [];
let activeView = 'collapsed';
let activeCatalog = DEFAULT_CDC_CATALOG;

function setStatus(state, text, detail, badge = 'ENV') {
  statusEl.dataset.state = state;
  statusIconEl.textContent = state === 'ok' ? '✅' : state === 'error' ? '❌' : '⚠️';
  statusTextEl.textContent = text;
  statusDetailEl.textContent = detail || '';
  statusBadgeEl.textContent = badge;
}

function showMessage(message, isError = false) {
  if (!messageEl) return;
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

function normalizeFilterValue(value) {
  if (!value) return '';
  return String(value).trim().toLowerCase();
}

function getSearchFilters() {
  return {
    codigo: filterCodigoEl.value.trim(),
    materia: filterMateriaEl.value.trim(),
    actividad: filterActividadEl.value.trim(),
  };
}

function rowMatchesField(row, fields, filterValue) {
  if (!filterValue) return true;
  return fields.some((field) => {
    const raw = row?.[field];
    if (raw === null || raw === undefined) return false;
    return String(raw).toLowerCase().includes(filterValue);
  });
}

function getCodigoActividad(row) {
  const raw = row?.codigo_actividades ?? row?.codigo_actividad;
  return raw === null || raw === undefined ? '' : String(raw).trim();
}

function getCodigoMateria(row) {
  const raw = row?.codigo_materia ?? row?.codigo_materias;
  return raw === null || raw === undefined ? '' : String(raw).trim();
}

function getMateriaLabel(row) {
  const raw = row?.materia ?? row?.nombre_materia ?? row?.materia_nombre;
  return raw === null || raw === undefined ? '—' : String(raw).trim();
}

function getActividadLabel(row) {
  const raw = row?.actividades ?? row?.actividad ?? row?.nombre_actividad ?? '';
  return raw === null || raw === undefined ? '' : String(raw).trim();
}

function getCatalogTables() {
  const entity = activeCatalog?.entities?.[0];
  return {
    cargaTable: entity?.carga?.table ?? null,
    vinculacionTable: entity?.vinculacion?.table ?? null,
  };
}

async function fetchAllRows(table) {
  const batchSize = 1000;
  let from = 0;
  let allRows = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabaseClient
      .from(table)
      .select('*')
      .range(from, from + batchSize - 1);

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

function updateResultsTitle(count) {
  if (!resultsTitleEl) return;
  resultsTitleEl.textContent = `Actividades: ${count}`;
}

function normalizeFilters(filters) {
  return {
    codigo: normalizeFilterValue(filters.codigo),
    materia: normalizeFilterValue(filters.materia),
    actividad: normalizeFilterValue(filters.actividad),
  };
}

function groupRows(rows) {
  const groups = new Map();

  (rows || []).forEach((row) => {
    const codigoMateria = getCodigoMateria(row) || '—';
    const materia = getMateriaLabel(row);
    const key = `${codigoMateria}::${materia}`;
    if (!groups.has(key)) {
      groups.set(key, {
        codigoMateria,
        materia,
        rows: [],
      });
    }
    groups.get(key).rows.push(row);
  });

  return Array.from(groups.values()).sort((a, b) =>
    a.codigoMateria.localeCompare(b.codigoMateria, 'es', { sensitivity: 'base', numeric: true }),
  );
}

function rowMatchesFilters(row, filters) {
  return (
    rowMatchesField(
      { codigo_actividades: getCodigoActividad(row) },
      ['codigo_actividades'],
      filters.codigo,
    ) &&
    rowMatchesField({ materia: getMateriaLabel(row) }, ['materia'], filters.materia) &&
    rowMatchesField({ actividad: getActividadLabel(row) }, ['actividad'], filters.actividad)
  );
}

function groupMatchesFilters(group, filters) {
  const materiaMatches = filters.materia
    ? String(group.materia).toLowerCase().includes(filters.materia)
    : false;
  const codigoMatches = filters.codigo
    ? String(group.codigoMateria).toLowerCase().includes(filters.codigo)
    : false;
  return materiaMatches || codigoMatches;
}

function filterGroups(rows, filters) {
  const normalized = normalizeFilters(filters);
  const hasFilters = Object.values(normalized).some((value) => Boolean(value));
  const groups = groupRows(rows);

  if (!hasFilters) {
    return groups;
  }

  const filteredGroups = [];
  groups.forEach((group) => {
    const groupMatches = groupMatchesFilters(group, normalized);
    const visibleRows = groupMatches
      ? group.rows
      : group.rows.filter((row) => rowMatchesFilters(row, normalized));
    if (visibleRows.length > 0) {
      filteredGroups.push({ ...group, rows: visibleRows });
    }
  });

  return filteredGroups;
}

function renderCollapsed(groups) {
  resultsEl.innerHTML = '';

  if (!groups || groups.length === 0) {
    resultsEl.innerHTML = '<p class="muted">No hay actividades para mostrar.</p>';
    return;
  }

  groups.forEach((group) => {
    const details = document.createElement('details');
    details.className = 'activity-group';

    const summary = document.createElement('summary');
    summary.innerHTML = `
      <div class="activity-summary">
        <span class="activity-summary-title">
          ${group.codigoMateria} - ${group.materia} (${group.rows.length})
        </span>
        <span class="muted">Desplegar</span>
      </div>
    `;

    const list = document.createElement('div');
    list.className = 'activity-list';

    group.rows.forEach((row) => {
      const item = document.createElement('div');
      item.className = 'activity-row';
      const codigoActividad = getCodigoActividad(row) || '—';
      const actividad = getActividadLabel(row) || '—';
      item.innerHTML = `
        <div class="activity-name">
          <span>${codigoActividad}</span>
          <span>-</span>
          <span>${actividad}</span>
        </div>
      `;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';
      button.textContent = 'Ver detalles';
      button.addEventListener('click', () => openDetalleActividad(row));
      item.appendChild(button);
      list.appendChild(item);
    });

    details.appendChild(summary);
    details.appendChild(list);
    resultsEl.appendChild(details);
  });
}

function renderExpanded(groups) {
  resultsEl.innerHTML = '';

  if (!groups || groups.length === 0) {
    resultsEl.innerHTML = '<p class="muted">No hay actividades para mostrar.</p>';
    return;
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>codigo_actividades</th>
        <th>actividades</th>
        <th>codigo_materia</th>
        <th>materia</th>
        <th></th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  groups.forEach((group) => {
    group.rows.forEach((row) => {
      const tr = document.createElement('tr');
      const codigoActividad = getCodigoActividad(row) || '—';
      const actividad = getActividadLabel(row) || '—';
      const codigoMateria = getCodigoMateria(row) || '—';
      const materia = getMateriaLabel(row) || '—';
      tr.innerHTML = `
        <td>${codigoActividad}</td>
        <td>${actividad}</td>
        <td>${codigoMateria}</td>
        <td>${materia}</td>
        <td></td>
      `;
      const actionCell = tr.querySelector('td:last-child');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';
      button.textContent = 'Ver detalles';
      button.addEventListener('click', () => openDetalleActividad(row));
      actionCell.appendChild(button);
      tbody.appendChild(tr);
    });
  });

  resultsEl.appendChild(table);
}

function renderResults() {
  const filters = getSearchFilters();
  const groups = filterGroups(activeRows, filters);
  const totalRows = groups.reduce((acc, group) => acc + group.rows.length, 0);
  updateResultsTitle(totalRows);

  if (activeView === 'expanded') {
    renderExpanded(groups);
  } else {
    renderCollapsed(groups);
  }
}

async function openDetalleActividad(row) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar detalles.', true);
    return;
  }

  const actividad = getActividadLabel(row) || '—';
  detailModalTitleEl.textContent = `Actividad: ${actividad}`;
  detailModalBodyEl.innerHTML = '<p class="muted">Cargando detalles...</p>';
  detailModalEl.hidden = false;

  const { vinculacionTable, cargaTable } = getCatalogTables();
  if (!vinculacionTable || !cargaTable) {
    detailModalBodyEl.innerHTML = '<p class="error">No hay tablas configuradas para el detalle.</p>';
    return;
  }

  const { data: vincRows, error } = await supabaseClient
    .from(vinculacionTable)
    .select('cod, nombre_entidad, nombre_serie, titulo_serie')
    .eq('actividad', actividad);

  if (error) {
    detailModalBodyEl.innerHTML = `<p class="error">${mapSupabaseError(error)}</p>`;
    return;
  }

  const rows = vincRows || [];
  if (rows.length === 0) {
    detailModalBodyEl.innerHTML = '<p class="muted">No hay series vinculadas a esta actividad.</p>';
    return;
  }

  const codigos = Array.from(
    new Set(rows.map((item) => item?.cod).filter((value) => value !== null && value !== undefined)),
  ).map((value) => String(value));

  let modelosByCodigo = new Map();
  if (codigos.length > 0) {
    const { data: cargaRows, error: cargaError } = await supabaseClient
      .from(cargaTable)
      .select('codigo_serie, modelo')
      .in('codigo_serie', codigos);

    if (cargaError) {
      detailModalBodyEl.innerHTML = `<p class="error">${mapSupabaseError(cargaError)}</p>`;
      return;
    }

    (cargaRows || []).forEach((item) => {
      const codigo = item?.codigo_serie;
      if (codigo !== null && codigo !== undefined && !modelosByCodigo.has(String(codigo))) {
        modelosByCodigo.set(String(codigo), item?.modelo ?? '—');
      }
    });
  }

  const table = document.createElement('table');
  table.innerHTML = `
    <thead>
      <tr>
        <th>codigo_serie</th>
        <th>nombre_serie</th>
        <th>modelo</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector('tbody');
  rows.forEach((item) => {
    const codigoSerie = item?.cod ?? '—';
    const nombreSerie = item?.nombre_entidad ?? item?.nombre_serie ?? item?.titulo_serie ?? '—';
    const modelo = modelosByCodigo.get(String(codigoSerie)) ?? '—';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${codigoSerie}</td>
      <td>${nombreSerie}</td>
      <td>${modelo}</td>
    `;
    tbody.appendChild(tr);
  });

  detailModalBodyEl.innerHTML = '';
  detailModalBodyEl.appendChild(table);
}

function closeDetailModal() {
  detailModalEl.hidden = true;
}

function setView(mode) {
  activeView = mode;
  viewCollapsedButton.classList.toggle('active', mode === 'collapsed');
  viewExpandedButton.classList.toggle('active', mode === 'expanded');
  renderResults();
}

async function loadActivities() {
  showMessage('Consultando actividades...', false);
  const { data, error } = await fetchAllRows('actividades');
  if (error) {
    const friendly = mapSupabaseError(error);
    showMessage(friendly, true);
    resultsEl.innerHTML = `<p class="error">${friendly}</p>`;
    return;
  }

  activeRows = data || [];
  renderResults();
  showMessage(`Resultados cargados: ${activeRows.length} filas.`, false);
}

function init() {
  const env = window.ENV;

  updateResultsTitle(0);
  setView('collapsed');

  if (!env) {
    vercelWarningEl.hidden = false;
    setStatus('warning', 'Sin /api/env.js', 'No se encontró configuración de entorno.', 'ENV');
    resultsEl.innerHTML = '<p class="muted">Sin configuración de entorno.</p>';
    return;
  }

  const { catalog } = parseCatalogOverride(env.CDC_CATALOG);
  activeCatalog = catalog || DEFAULT_CDC_CATALOG;

  const validation = validateConfig(env);
  if (!validation.valid) {
    vercelWarningEl.hidden = false;
    setStatus('warning', 'Configuración incompleta', validation.reason, 'ENV');
    resultsEl.innerHTML = '<p class="muted">Configura Supabase para ver actividades.</p>';
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

  loadActivities();
}

filterFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  renderResults();
});

clearFiltersButton.addEventListener('click', () => {
  filterCodigoEl.value = '';
  filterMateriaEl.value = '';
  filterActividadEl.value = '';
  renderResults();
});

viewCollapsedButton.addEventListener('click', () => setView('collapsed'));
viewExpandedButton.addEventListener('click', () => setView('expanded'));

detailModalCloseEl.addEventListener('click', closeDetailModal);

detailModalEl.addEventListener('click', (event) => {
  if (event.target === detailModalEl) {
    closeDetailModal();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !detailModalEl.hidden) {
    closeDetailModal();
  }
});

init();
