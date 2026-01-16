import { createSupabaseClient } from './services/supabaseClient.js';
import { parseCatalogOverride } from './modules/cdcCatalog.js';
import { listEntities } from './modules/cdcRegistry.js';

const statusEl = document.getElementById('status');
const statusIconEl = document.getElementById('status-icon');
const statusTextEl = document.getElementById('status-text');
const statusBadgeEl = document.getElementById('status-badge');
const statusDetailEl = document.getElementById('status-detail');
const pingButton = document.getElementById('ping-button');
const limitSelect = document.getElementById('limit-select');
const messageEl = document.getElementById('message');
const catalogEl = document.getElementById('catalog');
const resultsEl = document.getElementById('results');
const vercelWarningEl = document.getElementById('vercel-warning');
const modelModalEl = document.getElementById('model-modal');
const modelModalTitleEl = document.getElementById('model-modal-title');
const modelModalMessageEl = document.getElementById('model-modal-message');
const modelModalCloseEl = document.getElementById('model-modal-close');
const modelListEl = document.getElementById('model-list');

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

  const limit = Number(limitSelect.value || 25);
  const filterLabel = modelFilter?.label
    ? ` · Modelo: ${modelFilter.label}`
    : modelFilter?.isNull
      ? ' · Modelo: (sin modelo)'
      : '';
  showMessage(`Consultando ${table}${filterLabel} (límite ${limit})...`, false);

  let query = supabaseClient.from(table).select('*').limit(limit);
  if (modelFilter) {
    if (modelFilter.isNull) {
      query = query.is('modelo', null);
    } else {
      query = query.eq('modelo', modelFilter.value);
    }
  }
  const { data, error } = await query;

  if (error) {
    const friendly = mapSupabaseError(error);
    showMessage(friendly, true);
    resultsEl.innerHTML = `<p class="error">${friendly}</p>`;
    return;
  }

  renderTable(data || []);
  showMessage(`Resultados cargados: ${data?.length || 0} filas.`, false);
}

function renderTable(rows) {
  if (!rows || rows.length === 0) {
    resultsEl.innerHTML = '<p class="muted">No hay filas para mostrar.</p>';
    return;
  }

  const columns = Object.keys(rows[0]);
  const header = columns.map((col) => `<th>${col}</th>`).join('');
  const body = rows
    .map((row) => {
      const cells = columns.map((col) => `<td>${row[col] ?? ''}</td>`).join('');
      return `<tr>${cells}</tr>`;
    })
    .join('');

  resultsEl.innerHTML = `
    <table>
      <thead><tr>${header}</tr></thead>
      <tbody>${body}</tbody>
    </table>
  `;
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

  const { data, error } = await supabaseClient.from(table).select('modelo').limit(1000);

  if (error) {
    modelModalMessageEl.textContent = mapSupabaseError(error);
    return;
  }

  const uniqueModels = new Map();
  (data || []).forEach((row) => {
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
modelModalEl.addEventListener('click', (event) => {
  if (event.target === modelModalEl) {
    closeModelModal();
  }
});
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modelModalEl.hidden) {
    closeModelModal();
  }
});

init();
