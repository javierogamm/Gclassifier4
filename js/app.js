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
        <button class="secondary" data-table="${entity.carga.table}" data-mode="carga">Cargar filas (carga)</button>
        <button class="secondary" data-table="${entity.vinculacion.table}" data-mode="vinculacion">Cargar filas (vinculación)</button>
      </div>
    `;
    catalogEl.appendChild(wrapper);
  });

  catalogEl.querySelectorAll('button[data-table]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      const table = target.getAttribute('data-table');
      await loadRows(table);
    });
  });
}

async function loadRows(table) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }

  const limit = Number(limitSelect.value || 25);
  showMessage(`Consultando ${table} (límite ${limit})...`, false);

  const { data, error } = await supabaseClient.from(table).select('*').limit(limit);

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

init();
