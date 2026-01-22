import { createSupabaseClient } from './services/supabaseClient.js';
import { parseCatalogOverride } from './modules/cdcCatalog.js';
import { listEntities } from './modules/cdcRegistry.js';

const statusEl = document.getElementById('status');
const statusIconEl = document.getElementById('status-icon');
const statusTextEl = document.getElementById('status-text');
const loginUserEl = document.getElementById('login-user');
const loginButton = document.getElementById('login-button');
const logoutButton = document.getElementById('logout-button');
const loginModalEl = document.getElementById('login-modal');
const loginModalCloseEl = document.getElementById('login-modal-close');
const loginFormEl = document.getElementById('login-form');
const loginNameEl = document.getElementById('login-name');
const loginPassEl = document.getElementById('login-pass');
const loginSubmitEl = document.getElementById('login-submit');
const registerSubmitEl = document.getElementById('register-submit');
const loginStatusEl = document.getElementById('login-status');
const messageEl = document.getElementById('message');
const catalogEl = document.getElementById('catalog');
const wizardSelectionHintEl = document.getElementById('wizard-selection-hint');
const exportAllButton = document.getElementById('export-all');
const resultsEl = document.getElementById('results');
const vercelWarningEl = document.getElementById('vercel-warning');
const modelModalEl = document.getElementById('model-modal');
const modelModalTitleEl = document.getElementById('model-modal-title');
const modelModalMessageEl = document.getElementById('model-modal-message');
const modelModalCloseEl = document.getElementById('model-modal-close');
const modelListEl = document.getElementById('model-list');
const modelWizardButton = document.getElementById('model-wizard-button');
const modelWizardModalEl = document.getElementById('model-wizard-modal');
const modelWizardCloseEl = document.getElementById('model-wizard-close');
const modelWizardQuestionEl = document.getElementById('model-wizard-question');
const modelWizardOptionsEl = document.getElementById('model-wizard-options');
const modelWizardResultEl = document.getElementById('model-wizard-result');
const modelWizardStatusEl = document.getElementById('model-wizard-status');
const modelWizardBackEl = document.getElementById('model-wizard-back');
const modelWizardConfirmEl = document.getElementById('model-wizard-confirm');
const languageSwitcherEl = document.getElementById('language-switcher');
const languageModalEl = document.getElementById('language-modal');
const languageModalTitleEl = document.getElementById('language-modal-title');
const languageModalMessageEl = document.getElementById('language-modal-message');
const languageModalCloseEl = document.getElementById('language-modal-close');
const languageListEl = document.getElementById('language-list');
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
const createTituloSeriesContainerEl = document.getElementById('create-titulo-series');
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
const detailDrawerHistoryEl = document.getElementById('detail-drawer-history');
const detailDrawerSaveEl = document.getElementById('detail-drawer-save');
const detailDrawerStatusEl = document.getElementById('detail-drawer-status');
const historyModalEl = document.getElementById('history-modal');
const historyModalCloseEl = document.getElementById('history-modal-close');
const historyStatusEl = document.getElementById('history-status');
const historyListEl = document.getElementById('history-list');
const cuadrosViewEl = document.getElementById('cuadros-view');
const activitiesViewEl = document.getElementById('activities-view');
const backToCuadrosButton = document.getElementById('back-to-cuadros');
const activitiesMessageEl = document.getElementById('activities-message');
const activityCreateFormEl = document.getElementById('activity-create-form');
const activityCreateCodigoActividadEl = document.getElementById('activity-create-codigo-actividad');
const activityCreateNombreEl = document.getElementById('activity-create-nombre');
const activityCreateSubmitButton = document.getElementById('activity-create-submit');
const activityCreateStatusEl = document.getElementById('activity-create-status');
const activitiesAccordionEl = document.getElementById('activities-accordion');
const activitiesExpandAllButton = document.getElementById('activities-expand-all');
const activitiesCollapseAllButton = document.getElementById('activities-collapse-all');
const activityEditModalEl = document.getElementById('activity-edit-modal');
const activityEditCloseEl = document.getElementById('activity-edit-close');
const activityEditFormEl = document.getElementById('activity-edit-form');
const activityEditFieldsEl = document.getElementById('activity-edit-fields');
const activityEditSubmitButton = document.getElementById('activity-edit-submit');
const activityEditStatusEl = document.getElementById('activity-edit-status');
const activityPickerModalEl = document.getElementById('activity-picker-modal');
const activityPickerCloseEl = document.getElementById('activity-picker-close');
const activityPickerSearchEl = document.getElementById('activity-picker-search');
const activityPickerStatusEl = document.getElementById('activity-picker-status');
const activityPickerListEl = document.getElementById('activity-picker-list');
const activityOptionsDatalistEl = document.getElementById('activity-options');

const PLACEHOLDER_PATTERNS = [
  'your-project',
  'your-supabase',
  'supabase-url',
  'anon-key',
  'service-role',
  'changeme',
  'example',
];
const NULL_MODEL_TOKEN = '__null_model__';
const MODEL_WIZARD_TREE = {
  pregunta: 'Tipo de entidad',
  opciones: {
    Ayuntamiento: {
      pregunta: 'Provincia',
      opciones: {
        Lleida: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Sí: {
              output: 'QdeCAC Híbrido ESET',
            },
            No: {
              pregunta: 'Modelo QdeCAC',
              opciones: {
                Si: {
                  pregunta: 'Completo o simplificado ESET',
                  opciones: {
                    Completo: {
                      output: 'QdeCAC',
                    },
                    Simplificado: {
                      output: 'QdeCAC Híbrido ESET',
                    },
                  },
                },
                No: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Barcelona: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Sí: {
              output: 'SETDIBA',
            },
            No: {
              pregunta: 'Modelo QdeCAC',
              opciones: {
                Si: {
                  pregunta: 'Completo o simplificado ESET',
                  opciones: {
                    Completo: {
                      output: 'QdeCAC',
                    },
                    Simplificado: {
                      output: 'QdeCAC Híbrido ESET',
                    },
                  },
                },
                No: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Tarragona: {
          pregunta: 'Modelo QdeCAC',
          opciones: {
            Si: {
              pregunta: 'Completo o simplificado ESET',
              opciones: {
                Completo: {
                  output: 'QdeCAC',
                },
                Simplificado: {
                  output: 'QdeCAC Híbrido ESET',
                },
              },
            },
            No: {
              output: 'Gestiona',
            },
          },
        },
        Girona: {
          pregunta: 'Modelo QdeCAC',
          opciones: {
            Si: {
              pregunta: 'Completo o simplificado ESET',
              opciones: {
                Completo: {
                  output: 'QdeCAC',
                },
                Simplificado: {
                  output: 'QdeCAC Híbrido ESET',
                },
              },
            },
            No: {
              output: 'Gestiona',
            },
          },
        },
        Castellón: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Castellón',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Castellón',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Pontevedra: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Pontevedra',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Pontevedra',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Valladolid: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Valladolid',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Valladolid',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Álava: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Álava',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Álava',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Teruel: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Teruel',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Teruel',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Alicante: {
          pregunta: 'Forma parte del proyecto provincial',
          opciones: {
            Si: {
              output: 'Alicante',
            },
            No: {
              pregunta: 'Usar modelo provincial o modelo gestiona',
              opciones: {
                Provincial: {
                  output: 'Alicante',
                },
                Gestiona: {
                  output: 'Gestiona',
                },
              },
            },
          },
        },
        Zaragoza: {
          output: 'Gestiona',
        },
        Burgos: {
          output: 'Gestiona',
        },
        Palencia: {
          output: 'Gestiona',
        },
        Madrid: {
          pregunta: 'Usar cuadro de la Mesa de archiverosl o modelo gestiona',
          opciones: {
            Mesa: {
              output: 'Madrid Mesa archiveros',
            },
            Gestiona: {
              output: 'Gestiona',
            },
          },
        },
      },
    },
    'Autoridad Portuaria': {
      output: 'Autoridades portuarias',
    },
  },
};

let supabaseClient = null;
let activeCatalog = null;
let pendingModelTable = null;
let activeTable = null;
let activeModelFilter = null;
let activeLanguageFilter = null;
let availableLanguages = [];
let pendingLanguageContext = null;
let activeRows = [];
let actividadesRows = [];
let activityEditContext = null;
let activityPickerContext = null;
let positionSelectionContext = null;
let currentUser = null;
let modelWizardNode = MODEL_WIZARD_TREE;
let modelWizardHistory = [];
let modelWizardSelection = null;
let pendingWizardModelSelection = null;
let lastSelectedTable = null;
const activityOptionsCache = new Map();
let activityPickerOptions = [];

const ACTIVITY_FIELD_CANDIDATES = {
  actividadCode: ['codigo_actividad', 'cod_actividad', 'codigo'],
  actividadName: ['nombre_actividad', 'actividad', 'nombre_actividad', 'nombre'],
};
const ACTIVITY_LINK_FIELD_CANDIDATES = {
  actividad: ['actividad'],
};
const LINKED_SERIES_FIELD_CANDIDATES = {
  codigoSerie: ['codigo_serie', 'cod', 'codigo'],
  nombre: ['nombre', 'titulo_serie', 'nombre_serie', 'nombre_entidad'],
  modelo: ['modelo', 'nombre_entidad', 'modelo_serie'],
};
const VINCULACION_FIELD_CANDIDATES = {
  codigoSerie: ['cod', 'codigo_serie', 'codigo'],
  actividad: ['actividad'],
};
const SERIES_CARGA_FIELD_CANDIDATES = {
  codigoSerie: ['codigo_serie', 'cod', 'codigo'],
  nombre: ['titulo_serie', 'nombre_serie', 'nombre', 'titulo'],
  modelo: ['modelo', 'nombre_entidad', 'modelo_serie'],
};
const SERIES_CARGA_EXPORT_FIELDS = [
  { header: 'Nombre Entidad', key: 'nombre_entidad' },
  { header: 'Sobrescribir', key: 'sobrescribir' },
  { header: 'Posición', key: 'posicion' },
  { header: 'Código Serie', key: 'codigo_serie' },
  { header: 'Título Serie', key: 'titulo_serie' },
  { header: 'Categoría', key: 'categoria' },
  { header: 'Unidad gestora', key: 'unidad_gestora' },
  { header: 'Libro Oficial', key: 'libro_oficial' },
  { header: 'Nivel de seguridad', key: 'nivel_seguridad' },
  { header: 'Advertencia de seguridad', key: 'advertencia_seguridad' },
  { header: 'Sensibilidad datos personales', key: 'sensibilidad_datos_personales' },
  { header: 'Nivel de confidencialidad', key: 'nivel_confidencialidad' },
  { header: 'Tipo de acceso', key: 'tipo_acceso' },
  { header: 'Condiciones de reutilización', key: 'condiciones_reutilizacion' },
  { header: 'Código de la causa de limitación', key: 'codigo_causa_limitacion' },
  { header: 'Normativa', key: 'normativa' },
  { header: 'Valor primario', key: 'valor_primario' },
  { header: 'Plazo', key: 'plazo' },
  { header: 'Valor secundario', key: 'valor_secundario' },
  { header: 'Dictamen', key: 'dictamen' },
  { header: 'Documento esencial', key: 'documento_esencial' },
  { header: 'Acción dictaminada', key: 'accion_dictaminada' },
  { header: 'Ejecución', key: 'ejecucion' },
  { header: 'Motivación', key: 'motivacion' },
];
const SERIES_VINCULACION_EXPORT_FIELDS = [
  { header: 'Nombre Entidad', key: 'nombre_entidad' },
  { header: 'Sobrescribir', key: 'sobrescribir' },
  { header: 'Cod', key: 'cod' },
  { header: 'Actividad', key: 'actividad' },
  { header: 'Plazos', key: 'plazos' },
];

function resolveModelFilter(modelValue) {
  if (modelValue === undefined) {
    return activeModelFilter ?? null;
  }
  if (modelValue === null) {
    return { value: null, isNull: true };
  }
  return { value: modelValue, isNull: false };
}

function applyModelFilterToQuery(query, modelFilter) {
  if (!modelFilter) return query;
  if (modelFilter.isNull) {
    return query.is('modelo', null);
  }
  if (modelFilter.value !== undefined) {
    return query.eq('modelo', modelFilter.value);
  }
  return query;
}

function parseModelDatasetValue(value) {
  if (!value) return undefined;
  if (value === NULL_MODEL_TOKEN) return null;
  return value;
}

function buildLinkedSeriesKey(codeValue, modelValue) {
  const codeKey = normalizeMatchValue(codeValue);
  const modelKey =
    modelValue === null || modelValue === undefined ? '__null__' : String(modelValue).trim();
  return `${codeKey}::${modelKey}`;
}

async function fetchActividadForCodigoSerie(codigoSerie, modelValue) {
  if (!supabaseClient || !codigoSerie) return null;
  const vinculacionTable = getVinculacionTableForActive();
  if (!vinculacionTable) return null;
  const vinculacionFieldMap = getVinculacionFieldMap();

  const modelFilter = resolveModelFilter(modelValue);
  let query = supabaseClient
    .from(vinculacionTable)
    .select(vinculacionFieldMap.actividad)
    .eq(vinculacionFieldMap.codigoSerie, codigoSerie)
    .limit(1);
  query = applyModelFilterToQuery(query, modelFilter);
  const { data, error } = await query;

  if (error) {
    return null;
  }

  return data?.[0]?.[vinculacionFieldMap.actividad] ?? null;
}

function getActividadesTableForActive() {
  if (!activeCatalog?.entities || !activeTable) return null;
  const entity = activeCatalog.entities.find((item) => item?.carga?.table === activeTable);
  return entity?.actividades?.table ?? null;
}

function getVinculacionTableForActive() {
  if (!activeCatalog?.entities || !activeTable) return null;
  const entity = activeCatalog.entities.find((item) => item?.carga?.table === activeTable);
  return entity?.vinculacion?.table ?? null;
}

function getVinculacionFieldMap() {
  const entity = activeCatalog?.entities?.find((item) => item?.carga?.table === activeTable);
  const fields = entity?.vinculacion?.fields ?? [];
  const sampleRow = {};
  const baseFields = fields.length ? fields : Object.keys(sampleRow);
  return {
    codigoSerie: pickActivityField(VINCULACION_FIELD_CANDIDATES.codigoSerie, baseFields, sampleRow),
    actividad: pickActivityField(VINCULACION_FIELD_CANDIDATES.actividad, baseFields, sampleRow),
  };
}

function setStatus(state, text) {
  statusEl.dataset.state = state;
  statusIconEl.textContent = state === 'ok' ? '✅' : state === 'error' ? '❌' : '⚠️';
  statusTextEl.textContent = text;
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

function showWizardSelectionHint() {
  if (!wizardSelectionHintEl) return;
  wizardSelectionHintEl.hidden = false;
}

function hideWizardSelectionHint() {
  if (!wizardSelectionHintEl) return;
  wizardSelectionHintEl.hidden = true;
}

function updateLoginStatus(message, isError = false) {
  if (!loginStatusEl) return;
  loginStatusEl.textContent = message || '';
  loginStatusEl.className = isError ? 'form-status error' : 'form-status';
}

function setAuthUser(user) {
  currentUser = user;
  if (loginUserEl && loginButton && logoutButton) {
    if (user) {
      loginUserEl.textContent = `Sesión: ${user.name}`;
      loginButton.textContent = 'Cambiar';
      logoutButton.hidden = false;
      localStorage.setItem(
        'authUser',
        JSON.stringify({ id: user.id, name: user.name, admin: user.admin === true }),
      );
    } else {
      loginUserEl.textContent = 'Sesión: sin iniciar';
      loginButton.textContent = 'Login';
      logoutButton.hidden = true;
      localStorage.removeItem('authUser');
    }
  }
  applyAccessControl();
}

function loadStoredAuthUser() {
  try {
    const stored = localStorage.getItem('authUser');
    if (!stored) return;
    const parsed = JSON.parse(stored);
    if (parsed?.name) {
      setAuthUser({ id: parsed.id, name: parsed.name, admin: parsed.admin === true });
    }
  } catch (error) {
    localStorage.removeItem('authUser');
  }
}

function userCanEdit() {
  return currentUser?.admin === true;
}

function userIsLoggedIn() {
  return Boolean(currentUser?.name);
}

function applyAccessControl() {
  const canEdit = userCanEdit();
  const isLoggedIn = userIsLoggedIn();
  if (exportAllButton) {
    exportAllButton.hidden = !canEdit;
    exportAllButton.disabled = !canEdit;
  }
  if (openCreateModalButton) {
    openCreateModalButton.disabled = !canEdit;
  }
  if (createSubmitButton) {
    createSubmitButton.disabled = !canEdit;
  }
  if (createCodigoSerieEl) {
    createCodigoSerieEl.disabled = !canEdit;
  }
  getCreateTitleInputs().forEach((input) => {
    input.disabled = !canEdit;
  });
  if (createCategoriaEl) {
    createCategoriaEl.disabled = !canEdit;
  }
  if (createPosicionEl) {
    createPosicionEl.disabled = !canEdit;
  }
  if (createPosicionSearchEl) {
    createPosicionSearchEl.disabled = !canEdit;
  }
  if (detailDrawerSaveEl) {
    detailDrawerSaveEl.disabled = !canEdit;
  }
  if (detailDrawerHistoryEl) {
    detailDrawerHistoryEl.disabled = !canEdit;
    detailDrawerHistoryEl.hidden = !canEdit;
  }
  if (detailDrawerBodyEl) {
    detailDrawerBodyEl.querySelectorAll('input').forEach((input) => {
      if (!input.hasAttribute('data-force-edit')) {
        input.readOnly = !canEdit || input.name === 'last_change';
      }
    });
  }
  if (activityCreateCodigoActividadEl) {
    activityCreateCodigoActividadEl.disabled = !canEdit;
  }
  if (activityCreateNombreEl) {
    activityCreateNombreEl.disabled = !canEdit;
  }
  if (activityCreateSubmitButton) {
    activityCreateSubmitButton.disabled = !canEdit;
  }
  if (activityEditSubmitButton) {
    activityEditSubmitButton.disabled = !canEdit;
  }
  if (activitiesAccordionEl) {
    activitiesAccordionEl.querySelectorAll('.activity-row-actions button').forEach((button) => {
      button.disabled = !canEdit;
      button.title = !canEdit ? 'Solo lectura' : '';
    });
  }
  document.querySelectorAll('[data-auth-required="true"]').forEach((button) => {
    button.disabled = !isLoggedIn;
    if (!isLoggedIn) {
      button.title = 'Inicia sesión para exportar.';
    } else {
      button.removeAttribute('title');
    }
  });
  document.querySelectorAll('[data-auth-visible="true"]').forEach((button) => {
    button.hidden = !isLoggedIn;
    button.disabled = !isLoggedIn;
    if (!isLoggedIn) {
      button.title = 'Inicia sesión para usar esta opción.';
    } else {
      button.removeAttribute('title');
    }
  });
  if (!canEdit) {
    closeCreateModal();
    if (activityEditModalEl && !activityEditModalEl.hidden) {
      closeActivityEditModal();
    }
  }
}

function getWizardOutputs(node) {
  if (!node) return [];
  if (Array.isArray(node.outputs)) return node.outputs;
  if (node.output) return [node.output];
  return [];
}

function resetModelWizard() {
  modelWizardNode = MODEL_WIZARD_TREE;
  modelWizardHistory = [];
  modelWizardSelection = null;
}

function buildModelOption(modelValue) {
  return {
    label: modelValue,
    value: modelValue,
    isNull: false,
  };
}

function animateWizardStep(element) {
  if (!element) return;
  element.classList.remove('wizard-step');
  void element.offsetWidth;
  element.classList.add('wizard-step');
}

function renderModelWizard() {
  if (!modelWizardQuestionEl || !modelWizardOptionsEl || !modelWizardResultEl) return;
  const outputs = getWizardOutputs(modelWizardNode);
  const hasOutput = outputs.length > 0;
  const question = modelWizardNode?.pregunta || 'Selecciona una opción';

  if (hasOutput && outputs.length === 1 && !modelWizardSelection) {
    [modelWizardSelection] = outputs;
  }

  modelWizardQuestionEl.textContent = hasOutput ? 'Modelo de cuadro sugerido' : question;
  modelWizardOptionsEl.innerHTML = '';
  modelWizardResultEl.innerHTML = '';
  modelWizardResultEl.hidden = !hasOutput;
  if (modelWizardConfirmEl) {
    modelWizardConfirmEl.disabled = !hasOutput || !modelWizardSelection;
    modelWizardConfirmEl.hidden = !hasOutput;
  }

  if (hasOutput) {
    const title = document.createElement('p');
    title.className = 'muted';
    title.textContent = 'Elige el modelo que deseas visualizar:';
    modelWizardResultEl.appendChild(title);

    outputs.forEach((output) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `secondary${modelWizardSelection === output ? ' is-selected' : ''}`;
      button.textContent = `Modelo de cuadro: ${output}`;
      button.addEventListener('click', () => {
        modelWizardSelection = output;
        renderModelWizard();
      });
      modelWizardResultEl.appendChild(button);
    });
  } else {
    const options = modelWizardNode?.opciones ? Object.keys(modelWizardNode.opciones) : [];
    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary';
      button.textContent = option;
      button.addEventListener('click', () => {
        const nextNode = modelWizardNode?.opciones?.[option];
        if (!nextNode) return;
        modelWizardHistory.push(modelWizardNode);
        modelWizardNode = nextNode;
        modelWizardSelection = null;
        renderModelWizard();
      });
      modelWizardOptionsEl.appendChild(button);
    });
  }

  if (modelWizardBackEl) {
    modelWizardBackEl.disabled = modelWizardHistory.length === 0;
  }
  if (modelWizardStatusEl) {
    modelWizardStatusEl.textContent = '';
  }
  animateWizardStep(modelWizardOptionsEl);
  animateWizardStep(modelWizardResultEl);
}

function openModelWizardModal() {
  if (!modelWizardModalEl) return;
  if (!userIsLoggedIn()) {
    showMessage('Inicia sesión para usar el asistente de modelo.', true);
    return;
  }
  hideWizardSelectionHint();
  resetModelWizard();
  renderModelWizard();
  modelWizardModalEl.hidden = false;
}

function closeModelWizardModal() {
  if (!modelWizardModalEl) return;
  modelWizardModalEl.hidden = true;
  if (modelWizardStatusEl) {
    modelWizardStatusEl.textContent = '';
  }
  if (!activeTable) {
    showWizardSelectionHint();
  }
}

async function applyWizardModelSelection(table, modelValue) {
  if (!table || !modelValue) return;
  await handleModelSelection(table, buildModelOption(modelValue));
}

function openLoginModal() {
  if (!loginModalEl) return;
  loginModalEl.hidden = false;
  updateLoginStatus('');
  if (loginNameEl) {
    loginNameEl.focus();
  }
}

function closeLoginModal() {
  if (!loginModalEl) return;
  loginModalEl.hidden = true;
  if (loginFormEl) {
    loginFormEl.reset();
  }
  updateLoginStatus('');
}

async function handleLogin() {
  if (!supabaseClient) {
    updateLoginStatus('Configura Supabase antes de iniciar sesión.', true);
    return;
  }

  const name = loginNameEl?.value.trim();
  const pass = loginPassEl?.value.trim();

  if (!name || !pass) {
    updateLoginStatus('Completa nombre y contraseña.', true);
    return;
  }

  loginSubmitEl.disabled = true;
  registerSubmitEl.disabled = true;
  updateLoginStatus('Validando credenciales...', false);

  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('id, name, pass, admin')
      .eq('name', name)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data || data.pass !== pass) {
      updateLoginStatus('Usuario o contraseña incorrecta.', true);
      return;
    }

    setAuthUser({ id: data.id, name: data.name, admin: data.admin === true });
    updateLoginStatus('Sesión iniciada.', false);
    closeLoginModal();
  } catch (error) {
    updateLoginStatus(mapSupabaseError(error), true);
  } finally {
    loginSubmitEl.disabled = false;
    registerSubmitEl.disabled = false;
  }
}

async function handleRegister() {
  if (!supabaseClient) {
    updateLoginStatus('Configura Supabase antes de registrarte.', true);
    return;
  }

  const name = loginNameEl?.value.trim();
  const pass = loginPassEl?.value.trim();

  if (!name || !pass) {
    updateLoginStatus('Completa nombre y contraseña.', true);
    return;
  }

  loginSubmitEl.disabled = true;
  registerSubmitEl.disabled = true;
  updateLoginStatus('Registrando usuario...', false);

  try {
    const { data: existing, error: existingError } = await supabaseClient
      .from('users')
      .select('id')
      .eq('name', name)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      updateLoginStatus('El nombre ya está registrado.', true);
      return;
    }

    const payload = { name, pass, created_at: new Date().toISOString() };
    const { data, error } = await supabaseClient
      .from('users')
      .insert(payload)
      .select('id, name, admin')
      .single();

    if (error) {
      throw error;
    }

    setAuthUser({ id: data.id, name: data.name, admin: data.admin === true });
    updateLoginStatus('Registro completado.', false);
    closeLoginModal();
  } catch (error) {
    updateLoginStatus(mapSupabaseError(error), true);
  } finally {
    loginSubmitEl.disabled = false;
    registerSubmitEl.disabled = false;
  }
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

  showMessage('Probando conexión...', false);

  const { error } = await supabaseClient.rpc('ping');

  if (error) {
    const friendly = mapSupabaseError(error);
    setStatus('error', 'Error de conexión');
    showMessage(friendly, true);
  } else {
    setStatus('ok', 'Conectado OK');
    showMessage('', false);
  }
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

function normalizeMatchValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function trimTrailingSpaces(value) {
  return String(value ?? '').replace(/\s+$/u, '');
}

function areMatchValues(a, b) {
  return normalizeMatchValue(a) === normalizeMatchValue(b);
}

function updateDetailStatus(message, isError = false) {
  if (!detailDrawerStatusEl) return;
  detailDrawerStatusEl.textContent = message || '';
  detailDrawerStatusEl.className = isError ? 'error' : 'muted';
}

function updateActivityPickerStatus(message, isError = false) {
  if (!activityPickerStatusEl) return;
  activityPickerStatusEl.textContent = message || '';
  activityPickerStatusEl.className = isError ? 'error' : 'muted';
}

function buildActivityOptionsFromRows(rows) {
  const entity = activeCatalog?.entities?.find((item) => item?.carga?.table === activeTable);
  const fields = entity?.actividades?.fields ?? [];
  const sampleRow = rows?.[0] || {};
  const baseFields = fields.length ? fields : Object.keys(sampleRow);
  const fieldMap = getActivityFieldMapFromData(baseFields, sampleRow);

  return (rows || [])
    .map((row) => {
      const name = trimTrailingSpaces(row?.[fieldMap.actividadName] ?? '');
      const code = trimTrailingSpaces(row?.[fieldMap.actividadCode] ?? '');
      return {
        name,
        code,
      };
    })
    .filter((option) => option.name || option.code)
    .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
}

function setActivityOptionsDatalist(options) {
  if (!activityOptionsDatalistEl) return;
  activityOptionsDatalistEl.innerHTML = '';
  options.forEach((option) => {
    const optionEl = document.createElement('option');
    optionEl.value = option.name;
    if (option.code) {
      optionEl.label = `${option.code} — ${option.name}`;
    }
    activityOptionsDatalistEl.appendChild(optionEl);
  });
}

function renderActivityPickerList(filterValue = '') {
  if (!activityPickerListEl) return;
  const normalizedFilter = String(filterValue ?? '').trim().toLowerCase();
  activityPickerListEl.innerHTML = '';
  const filtered = activityPickerOptions.filter((option) => {
    if (!normalizedFilter) return true;
    return (
      option.name.toLowerCase().includes(normalizedFilter) ||
      option.code.toLowerCase().includes(normalizedFilter)
    );
  });
  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No se encontraron actividades.';
    activityPickerListEl.appendChild(empty);
    return;
  }

  filtered.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary activity-picker-item';
    const nameEl = document.createElement('strong');
    nameEl.textContent = option.name || '—';
    const codeEl = document.createElement('span');
    codeEl.textContent = option.code ? `Código: ${option.code}` : 'Sin código';
    button.appendChild(nameEl);
    button.appendChild(codeEl);
    button.addEventListener('click', () => {
      if (activityPickerContext?.inputEl) {
        activityPickerContext.inputEl.value = trimTrailingSpaces(option.name || option.code);
      }
      closeActivityPickerModal();
    });
    activityPickerListEl.appendChild(button);
  });
}

async function ensureActivityOptionsLoaded() {
  const table = getActividadesTableForActive();
  if (!table || !supabaseClient) {
    activityPickerOptions = [];
    if (!table) {
      updateActivityPickerStatus('No hay tabla de actividades configurada.', true);
    } else {
      updateActivityPickerStatus('Configura Supabase antes de consultar actividades.', true);
    }
    setActivityOptionsDatalist([]);
    return;
  }
  if (activityOptionsCache.has(table)) {
    activityPickerOptions = activityOptionsCache.get(table);
    setActivityOptionsDatalist(activityPickerOptions);
    return;
  }

  updateActivityPickerStatus('Cargando actividades...', false);
  const { data, error } = await supabaseClient.from(table).select('*');
  if (error) {
    updateActivityPickerStatus(mapSupabaseError(error), true);
    activityPickerOptions = [];
    setActivityOptionsDatalist([]);
    return;
  }

  const options = buildActivityOptionsFromRows(data || []);

  activityOptionsCache.set(table, options);
  activityPickerOptions = options;
  updateActivityPickerStatus(`Actividades disponibles: ${options.length}`, false);
  setActivityOptionsDatalist(options);
}

function openActivityPickerModal(inputEl) {
  if (!activityPickerModalEl) return;
  activityPickerContext = { inputEl };
  activityPickerModalEl.hidden = false;
  if (activityPickerSearchEl) {
    activityPickerSearchEl.value = '';
  }
  renderActivityPickerList('');
}

function closeActivityPickerModal() {
  if (!activityPickerModalEl) return;
  activityPickerModalEl.hidden = true;
  activityPickerContext = null;
}

function updateHistoryStatus(message, isError = false) {
  if (!historyStatusEl) return;
  historyStatusEl.textContent = message || '';
  historyStatusEl.className = isError ? 'error' : 'muted';
}

function readDetailInputValue(inputs, name, useOriginal = false) {
  const input = inputs.find((item) => item.name === name);
  if (!input) return null;
  const rawValue = useOriginal ? input.dataset.original ?? '' : input.value;
  if (useOriginal) {
    return rawValue === '' ? null : rawValue;
  }
  return normalizeInputValue(rawValue);
}

function buildHistoryPayload(inputs, originalId, lastChange, useOriginal = false) {
  return {
    change_date: lastChange,
    change_user: currentUser?.name ?? null,
    original_id: originalId ?? null,
    original_codigo_serie: readDetailInputValue(inputs, 'codigo_serie', useOriginal),
    original_titulo_serie: readDetailInputValue(inputs, 'titulo_serie', useOriginal),
    original_categoria: readDetailInputValue(inputs, 'categoria', useOriginal),
    original_posicion: readDetailInputValue(inputs, 'posicion', useOriginal),
  };
}

function formatHistoryDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleString('es-ES');
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
    return normalizeMatchValue(raw).toLowerCase().includes(filterValue);
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

async function fetchAllRows(table, modelFilter, languageFilter) {
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
    if (languageFilter?.value !== null && languageFilter?.value !== undefined) {
      query = query.eq('idioma', languageFilter.value);
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

function normalizeLanguageValue(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function buildFileSegment(value, fallback) {
  const raw = value ?? fallback ?? '';
  const cleaned = String(raw)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned ? cleaned.toUpperCase() : String(fallback || '').toUpperCase() || 'MODELO';
}

const CSV_DELIMITER = ';';

function createCsvValue(value, delimiter = CSV_DELIMITER) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  const escapePattern = new RegExp(`[\"\\n\\r${delimiter}]`);
  if (escapePattern.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function buildCsvContent(rows, columns) {
  const headerRow = columns
    .map((column) => createCsvValue(column.header, CSV_DELIMITER))
    .join(CSV_DELIMITER);
  const dataRows = rows.map((row) =>
    columns.map((column) => createCsvValue(row?.[column.key], CSV_DELIMITER)).join(CSV_DELIMITER),
  );
  return ['\uFEFF' + headerRow, ...dataRows].join('\r\n');
}

function triggerCsvDownload(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function triggerZipDownload(filename, zipBlob) {
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function fetchRowsForExport(table, modelFilter, languageFilter) {
  const { data, error } = await fetchAllRows(table, modelFilter, languageFilter);
  if (!error) return { data, error: null };
  if (languageFilter && isMissingColumnError(error, 'idioma')) {
    return fetchAllRows(table, modelFilter, null);
  }
  return { data: null, error };
}

async function fetchVinculacionRowsForExport(table, codigoSeries, modelFilter = activeModelFilter) {
  if (!codigoSeries.length) return { data: [], error: null };
  let query = supabaseClient.from(table).select('*').in('cod', codigoSeries);
  query = applyModelFilterToQuery(query, modelFilter);
  const { data, error } = await query;
  if (!error) return { data, error: null };
  return { data: null, error };
}

function resolveDownloadModelValue(modelFilter) {
  if (!modelFilter) return null;
  if (modelFilter.isNull) return null;
  return modelFilter.value ?? modelFilter.label ?? null;
}

async function logDownload(type, modelFilter = activeModelFilter) {
  if (!supabaseClient || !userIsLoggedIn()) return;
  const payload = {
    modelo: resolveDownloadModelValue(modelFilter),
    user: currentUser?.name ?? null,
    type,
  };
  const { error } = await supabaseClient.from('downloads').insert([payload]);
  if (error) {
    console.warn('No se pudo registrar la descarga.', error);
  }
}

function collectCodigoSerieValues(rows) {
  const codes = new Set();
  (rows || []).forEach((row) => {
    const rawValue = row?.codigo_serie ?? row?.cod ?? row?.nombre_serie;
    if (rawValue === null || rawValue === undefined) return;
    const raw = String(rawValue);
    const trimmed = raw.trim();
    if (trimmed) codes.add(trimmed);
    if (raw && raw !== trimmed) codes.add(raw);
  });
  return Array.from(codes);
}

function buildModelOptions(allModels) {
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

  const normalizeModelLabel = (label) => String(label || '').trim().toLowerCase();
  return Array.from(uniqueModels.values()).sort((a, b) => {
    const aPriority = normalizeModelLabel(a.label) === 'gestiona' ? 0 : 1;
    const bPriority = normalizeModelLabel(b.label) === 'gestiona' ? 0 : 1;
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    return a.label.localeCompare(b.label, 'es', { sensitivity: 'base' });
  });
}

async function fetchModelOptions(table) {
  const batchSize = 1000;
  let from = 0;
  const allModels = [];
  let hasMore = true;

  while (hasMore) {
    const { data, error } = await supabaseClient
      .from(table)
      .select('modelo')
      .range(from, from + batchSize - 1);

    if (error) {
      return { options: [], error };
    }

    const batch = data || [];
    allModels.push(...batch);
    if (batch.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
    }
  }

  return { options: buildModelOptions(allModels), error: null };
}

async function exportCsvForModel({ cargaTable, vinculacionTable, label }) {
  if (!userIsLoggedIn()) {
    showMessage('Inicia sesión para exportar CSV.', true);
    return;
  }
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de exportar.', true);
    return;
  }
  if (!cargaTable || !vinculacionTable) {
    showMessage('No se encontró configuración de exportación para este cuadro.', true);
    return;
  }
  if (!activeTable || activeTable !== cargaTable) {
    showMessage(
      `Selecciona el cuadro ${label || cargaTable} antes de exportar sus CSV.`,
      true,
    );
    return;
  }
  if (!activeModelFilter) {
    showMessage('Selecciona un modelo antes de exportar.', true);
    return;
  }
  if (availableLanguages.length > 0 && !activeLanguageFilter) {
    showMessage('Selecciona un idioma antes de exportar.', true);
    return;
  }

  await logDownload('CSV', activeModelFilter);
  showMessage('Generando CSV...', false);

  const { data: cargaRows, error: cargaError } = await fetchRowsForExport(
    cargaTable,
    activeModelFilter,
    activeLanguageFilter,
  );
  if (cargaError) {
    showMessage(mapSupabaseError(cargaError), true);
    return;
  }

  const searchFilters = getSearchFilters();
  const visibleCargaRows = filterRowsWithHierarchy(cargaRows || [], searchFilters);
  const codigoSeries = collectCodigoSerieValues(visibleCargaRows);
  const { data: vinculacionRows, error: vinculacionError } = await fetchVinculacionRowsForExport(
    vinculacionTable,
    codigoSeries,
    activeModelFilter,
  );
  if (vinculacionError) {
    showMessage(mapSupabaseError(vinculacionError), true);
    return;
  }

  const modelSegment = buildFileSegment(activeModelFilter.label, 'MODELO');
  const languageSegment = activeLanguageFilter
    ? `_${buildFileSegment(activeLanguageFilter.label, 'IDIOMA')}`
    : '';

  const cargaFilename = `${modelSegment}${languageSegment}_CARGA.csv`;
  const vinculacionFilename = `${modelSegment}${languageSegment}_VINCULACION.csv`;

  const cargaCsv = buildCsvContent(cargaRows || [], SERIES_CARGA_EXPORT_FIELDS);
  const vinculacionCsv = buildCsvContent(vinculacionRows || [], SERIES_VINCULACION_EXPORT_FIELDS);

  triggerCsvDownload(cargaFilename, cargaCsv);
  triggerCsvDownload(vinculacionFilename, vinculacionCsv);
  showMessage('CSV generados correctamente.', false);
}

async function exportAllCsvAsZip() {
  if (!userCanEdit()) {
    showMessage('Solo los administradores pueden exportar todo.', true);
    return;
  }
  if (!userIsLoggedIn()) {
    showMessage('Inicia sesión para exportar todo.', true);
    return;
  }
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de exportar.', true);
    return;
  }
  if (!activeCatalog?.entities?.length) {
    showMessage('No se encontró catálogo para exportar.', true);
    return;
  }
  if (!window.JSZip) {
    showMessage('No se encontró JSZip para generar el ZIP.', true);
    return;
  }

  await logDownload('ZIP', null);
  showMessage('Generando ZIP con todos los CSV...', false);

  const zip = new window.JSZip();
  let fileCount = 0;
  const entities = listEntities(activeCatalog);

  for (const entity of entities) {
    const cargaTable = entity?.carga?.table;
    const vinculacionTable = entity?.vinculacion?.table;
    if (!cargaTable || !vinculacionTable) continue;

    const { options: modelOptions, error: modelError } = await fetchModelOptions(cargaTable);
    if (modelError) {
      showMessage(mapSupabaseError(modelError), true);
      return;
    }
    if (modelOptions.length === 0) {
      continue;
    }

    for (const modelOption of modelOptions) {
      const { options: languageOptions, error: languageError } = await fetchLanguageOptions(
        cargaTable,
        modelOption,
      );
      if (languageError) {
        showMessage(mapSupabaseError(languageError), true);
        return;
      }
      const languages = languageOptions.length > 0 ? languageOptions : [null];

      for (const languageOption of languages) {
        const { data: cargaRows, error: cargaError } = await fetchRowsForExport(
          cargaTable,
          modelOption,
          languageOption,
        );
        if (cargaError) {
          showMessage(mapSupabaseError(cargaError), true);
          return;
        }

        const codigoSeries = collectCodigoSerieValues(cargaRows || []);
        const { data: vinculacionRows, error: vinculacionError } =
          await fetchVinculacionRowsForExport(vinculacionTable, codigoSeries, modelOption);
        if (vinculacionError) {
          showMessage(mapSupabaseError(vinculacionError), true);
          return;
        }

        const modelLabel =
          modelOption?.label ?? (modelOption?.isNull ? '(sin modelo)' : modelOption?.value);
        const modelSegment = buildFileSegment(modelLabel, 'MODELO');
        const languageSegment = languageOption
          ? `_${buildFileSegment(languageOption.label, 'IDIOMA')}`
          : '';

        const cargaFilename = `${modelSegment}${languageSegment}_CARGA.csv`;
        const vinculacionFilename = `${modelSegment}${languageSegment}_VINCULACION.csv`;

        const cargaCsv = buildCsvContent(cargaRows || [], SERIES_CARGA_EXPORT_FIELDS);
        const vinculacionCsv = buildCsvContent(
          vinculacionRows || [],
          SERIES_VINCULACION_EXPORT_FIELDS,
        );

        zip.file(cargaFilename, cargaCsv);
        zip.file(vinculacionFilename, vinculacionCsv);
        fileCount += 2;
      }
    }
  }

  if (!fileCount) {
    showMessage('No se encontraron datos para exportar.', true);
    return;
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const stamp = new Date().toISOString().slice(0, 10);
  triggerZipDownload(`EXPORTACION_CSV_${stamp}.zip`, zipBlob);
  showMessage('ZIP generado correctamente.', false);
}

function isMissingColumnError(error, columnName) {
  const message = String(error?.message || '').toLowerCase();
  return message.includes(`column "${columnName}"`) || message.includes(`column '${columnName}'`);
}

function renderLanguageSwitcher(options, activeOption) {
  if (!languageSwitcherEl) return;
  languageSwitcherEl.innerHTML = '';
  if (!options || options.length === 0) {
    languageSwitcherEl.hidden = true;
    return;
  }
  languageSwitcherEl.hidden = false;
  const label = document.createElement('span');
  label.className = 'language-label';
  label.textContent = 'Idioma:';
  languageSwitcherEl.appendChild(label);
  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary language-button';
    button.textContent = option.label;
    if (activeOption?.value === option.value) {
      button.classList.add('active');
      button.disabled = true;
    }
    button.addEventListener('click', async () => {
      if (!activeTable || !activeModelFilter) return;
      await loadRows(activeTable, activeModelFilter, option);
    });
    languageSwitcherEl.appendChild(button);
  });
}

function setLanguageOptions(options, activeOption) {
  availableLanguages = options || [];
  activeLanguageFilter = activeOption || null;
  renderLanguageSwitcher(availableLanguages, activeLanguageFilter);
}

async function fetchLanguageOptions(table, modelFilter) {
  const batchSize = 1000;
  let from = 0;
  let allRows = [];
  let hasMore = true;

  while (hasMore) {
    let query = supabaseClient.from(table).select('idioma').range(from, from + batchSize - 1);
    if (modelFilter) {
      if (modelFilter.isNull) {
        query = query.is('modelo', null);
      } else {
        query = query.eq('modelo', modelFilter.value);
      }
    }

    const { data, error } = await query;
    if (error) {
      if (isMissingColumnError(error, 'idioma')) {
        return { options: [], error: null };
      }
      return { options: [], error };
    }
    const batch = data || [];
    allRows = allRows.concat(batch);
    if (batch.length < batchSize) {
      hasMore = false;
    } else {
      from += batchSize;
    }
  }

  const unique = new Map();
  allRows.forEach((row) => {
    const raw = normalizeLanguageValue(row?.idioma);
    if (!raw) return;
    if (!unique.has(raw)) {
      unique.set(raw, { label: raw, value: row?.idioma });
    }
  });

  const options = Array.from(unique.values()).sort((a, b) =>
    a.label.localeCompare(b.label, 'es', { sensitivity: 'base' }),
  );
  return { options, error: null };
}

function closeLanguageModal() {
  if (!languageModalEl) return;
  languageModalEl.hidden = true;
  pendingLanguageContext = null;
  if (languageModalMessageEl) {
    languageModalMessageEl.textContent = '';
  }
  if (languageListEl) {
    languageListEl.innerHTML = '';
  }
}

function openLanguageModal(table, modelFilter, options) {
  if (!languageModalEl || !languageListEl) return;
  pendingLanguageContext = { table, modelFilter, options };
  languageModalTitleEl.textContent = `Selecciona un idioma (${modelFilter?.label || 'modelo'})`;
  languageModalMessageEl.textContent = 'Este modelo tiene versiones por idioma.';
  languageListEl.innerHTML = '';
  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = option.label;
    button.addEventListener('click', async () => {
      const context = pendingLanguageContext;
      closeLanguageModal();
      if (!context?.table) return;
      setLanguageOptions(context.options, option);
      await loadRows(context.table, context.modelFilter, option);
    });
    languageListEl.appendChild(button);
  });
  languageModalEl.hidden = false;
}

function renderCatalog(entities) {
  catalogEl.innerHTML = '';
  entities.forEach((entity) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'catalog-actions-group';
    wrapper.innerHTML = `
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
      <button
        class="secondary"
        type="button"
        data-export-carga-table="${entity.carga.table}"
        data-export-vinculacion-table="${entity.vinculacion?.table || ''}"
        data-label="${entity.label}"
        data-auth-required="true"
      >
        Exportar CSV RPA
      </button>
      <button
        class="secondary"
        type="button"
        data-export-pdf="true"
        data-auth-required="true"
      >
        Exportar PDF
      </button>
    `;
    catalogEl.appendChild(wrapper);
  });

  catalogEl.querySelectorAll('button[data-table]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      hideWizardSelectionHint();
      const target = event.currentTarget;
      const table = target.getAttribute('data-table');
      const label = target.getAttribute('data-label');
      lastSelectedTable = table;
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

  catalogEl.querySelectorAll('button[data-export-carga-table]').forEach((button) => {
    button.addEventListener('click', async (event) => {
      const target = event.currentTarget;
      const cargaTable = target.getAttribute('data-export-carga-table');
      const vinculacionTable = target.getAttribute('data-export-vinculacion-table');
      const label = target.getAttribute('data-label');
      await exportCsvForModel({ cargaTable, vinculacionTable, label });
    });
  });

  catalogEl.querySelectorAll('button[data-export-pdf]').forEach((button) => {
    button.addEventListener('click', () => {
      exportPdfForModel();
    });
  });

  applyAccessControl();
}

function buildPdfHeader() {
  const modelLabel = activeModelFilter
    ? activeModelFilter.isNull
      ? '(sin modelo)'
      : activeModelFilter.label || activeModelFilter.value
    : 'Todos';
  const languageLabel = activeLanguageFilter?.label ? ` · Idioma: ${activeLanguageFilter.label}` : '';
  const searchFilters = getSearchFilters();
  const filterParts = [];
  if (searchFilters.codigoSerie) filterParts.push(`codigo_serie contiene "${searchFilters.codigoSerie}"`);
  if (searchFilters.tituloSerie) filterParts.push(`titulo_serie contiene "${searchFilters.tituloSerie}"`);
  if (searchFilters.categoria) filterParts.push(`categoria contiene "${searchFilters.categoria}"`);
  const filterLabel = filterParts.length ? `Filtros: ${filterParts.join(' · ')}` : 'Sin filtros';
  return {
    title: `Modelo: ${modelLabel}${languageLabel}`,
    filters: filterLabel,
    generatedAt: new Date().toLocaleString('es-ES'),
  };
}

function buildPrintableResults(rows) {
  const roots = buildHierarchy(rows);
  if (roots.length === 0) return null;

  const list = document.createElement('div');
  list.className = 'results-list';
  roots.forEach((node, index) => {
    const hierarchyLabel = `${index + 1}`;
    list.appendChild(createHierarchyDetails(node, 0, hierarchyLabel));
  });
  list.querySelectorAll('details').forEach((detail) => {
    detail.open = true;
  });
  list.querySelectorAll('.detail-button').forEach((button) => button.remove());
  list.querySelectorAll('.toggle-icon').forEach((icon) => icon.remove());
  return list;
}

async function exportPdfForModel() {
  if (!userIsLoggedIn()) {
    showMessage('Inicia sesión para exportar PDF.', true);
    return;
  }
  if (!activeTable || !activeModelFilter) {
    showMessage('Selecciona un modelo antes de exportar el PDF.', true);
    return;
  }
  await logDownload('PDF', activeModelFilter);
  const searchFilters = getSearchFilters();
  const visibleRows = filterRowsWithHierarchy(activeRows || [], searchFilters);
  if (!visibleRows.length) {
    showMessage('No hay resultados para exportar.', true);
    return;
  }

  const printable = buildPrintableResults(visibleRows);
  if (!printable) {
    showMessage('No hay filas raíz para exportar.', true);
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    showMessage('El navegador bloqueó la ventana de impresión.', true);
    return;
  }

  const header = buildPdfHeader();
  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Exportar PDF</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 24px;
            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #1f2933;
          }
          h1 { font-size: 20px; margin: 0 0 8px 0; }
          p { margin: 4px 0; font-size: 12px; color: #52606d; }
          .results-list { margin-top: 16px; }
          details { border: 1px solid #e4e7eb; border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; }
          summary { list-style: none; cursor: default; }
          summary::-webkit-details-marker { display: none; }
          .result-summary { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
          .result-title { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 13px; }
          .hierarchy-badge { font-weight: 600; color: #334e68; }
          .codigo-serie-badge { font-weight: 600; color: #1f2933; }
          .titulo-serie { font-weight: 500; }
          .categoria-serie { font-style: italic; color: #52606d; }
          .result-separator { color: #9fb3c8; }
          .child-list { margin-left: 24px; margin-top: 8px; display: grid; gap: 6px; }
        </style>
      </head>
      <body>
        <h1>${header.title}</h1>
        <p>${header.filters}</p>
        <p>Generado: ${header.generatedAt}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.document.body.appendChild(printable);

  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

async function loadRows(table, modelFilter = null, languageFilter = activeLanguageFilter) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }

  const filterLabel = modelFilter?.label
    ? ` · Modelo: ${modelFilter.label}`
    : modelFilter?.isNull
      ? ' · Modelo: (sin modelo)'
      : '';
  const resolvedLanguageFilter = languageFilter ?? null;
  const languageLabel = resolvedLanguageFilter?.label
    ? ` · Idioma: ${resolvedLanguageFilter.label}`
    : '';
  const searchFilters = getSearchFilters();
  const filterParts = [];
  if (searchFilters.codigoSerie) filterParts.push(`codigo_serie contiene "${searchFilters.codigoSerie}"`);
  if (searchFilters.tituloSerie) filterParts.push(`titulo_serie contiene "${searchFilters.tituloSerie}"`);
  if (searchFilters.categoria) filterParts.push(`categoria contiene "${searchFilters.categoria}"`);
  const searchLabel = filterParts.length ? ` · Filtros: ${filterParts.join(' · ')}` : '';
  showMessage(`Consultando ${table}${filterLabel}${languageLabel}${searchLabel}...`, false);

  activeTable = table;
  activeModelFilter = modelFilter;
  activeLanguageFilter = resolvedLanguageFilter;

  const { data, error } = await fetchAllRows(table, modelFilter, resolvedLanguageFilter);

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
  updateResultsTitle(modelFilter, filteredRows.length, resolvedLanguageFilter);
  renderLanguageSwitcher(availableLanguages, resolvedLanguageFilter);
  showMessage('', false);
  hideWizardSelectionHint();
}

function getRowIdentity(row, fallback) {
  const raw =
    row?.nombre_serie ?? row?.codigo_serie ?? row?.cod ?? row?.id ?? row?.nombre_entidad ?? fallback;
  if (raw === null || raw === undefined || raw === '') return fallback;
  return String(raw).trim();
}

function getRowIdentityInfo(row) {
  if (row?.id !== undefined && row?.id !== null) {
    return { field: 'id', value: String(row.id) };
  }
  if (row?.codigo_serie !== undefined && row?.codigo_serie !== null) {
    return { field: 'codigo_serie', value: String(row.codigo_serie) };
  }
  if (row?.cod !== undefined && row?.cod !== null) {
    return { field: 'cod', value: String(row.cod) };
  }
  return { field: '', value: '' };
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

  const nodes = (rows || []).map((row, index) => ({
    identity: getRowIdentity(row, `row-${index + 1}`),
    row,
    parent: null,
    children: [],
  }));

  const identityMap = new Map();
  nodes.forEach((node) => {
    if (!identityMap.has(node.identity)) {
      identityMap.set(node.identity, node);
    }
  });

  nodes.forEach((node) => {
    const parentIdentity = getParentIdentity(node.row);
    const parentNode =
      parentIdentity && identityMap.has(parentIdentity) ? identityMap.get(parentIdentity) : null;
    if (parentNode && parentNode !== node) {
      node.parent = parentNode;
      parentNode.children.push(node);
    }
  });

  const includedIdentities = new Set();
  const includeDescendants = (node) => {
    includedIdentities.add(node.identity);
    node.children.forEach((child) => includeDescendants(child));
  };
  nodes.forEach((node) => {
    if (!rowMatchesSearchFilters(node.row, normalizedFilters)) return;
    let current = node;
    while (current) {
      includedIdentities.add(current.identity);
      current = current.parent;
    }
    includeDescendants(node);
  });

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

function getDisplayValuesForRow(row) {
  return {
    codigoSerie: row?.nombre_serie || row?.codigo_serie || row?.cod || '—',
    tituloSerie:
      row?.titulo_serie || row?.nombre_entidad || row?.nombre_serie || 'Registro sin título',
    categoria: row?.categoria || row?.actividad || '—',
  };
}

function createHierarchyDetails(node, depth = 0, hierarchyLabel = '') {
  const { row } = node;
  const { codigoSerie, tituloSerie, categoria } = getDisplayValuesForRow(row);
  const toneClass = getToneForCategoria(categoria, depth);
  const hierarchyMarkup = hierarchyLabel
    ? `<span class="hierarchy-number">${hierarchyLabel}</span>`
    : '';
  const hasChildren = Boolean(node.children && node.children.length > 0);

  const details = document.createElement('details');
  const identityInfo = getRowIdentityInfo(row);
  details.className = `result-item ${toneClass}${hasChildren ? ' has-children' : ''}`;
  details.dataset.depth = depth;
  details.dataset.identityField = identityInfo.field;
  details.dataset.identityValue = identityInfo.value;
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
    <button type="button" class="detail-button" aria-label="Ver detalles" title="Ver detalles">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 9a3 3 0 1 1-2.12 5.12A3 3 0 0 1 12 9zm0-5c5 0 9.27 3.11 11 7.5C21.27 15.89 17 19 12 19S2.73 15.89 1 11.5C2.73 7.11 7 4 12 4zm0 2c-3.69 0-6.86 2.16-8.3 5.5C5.14 14.84 8.31 17 12 17s6.86-2.16 8.3-5.5C18.86 8.16 15.69 6 12 6z" />
      </svg>
    </button>
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

  if (hasSearchFilters(getSearchFilters())) {
    list.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    });
  }
}

function findResultItemElement(identityField, identityValue) {
  if (!resultsEl || !identityField) return null;
  const detailsList = resultsEl.querySelectorAll('details.result-item');
  for (const detail of detailsList) {
    if (
      detail.dataset.identityField === identityField &&
      detail.dataset.identityValue === String(identityValue)
    ) {
      return detail;
    }
  }
  return null;
}

function updateResultItemSummary(detailEl, row) {
  if (!detailEl || !row) return;
  const { codigoSerie, tituloSerie, categoria } = getDisplayValuesForRow(row);
  const codigoEl = detailEl.querySelector('.codigo-serie-badge');
  const tituloEl = detailEl.querySelector('.titulo-serie');
  const categoriaEl = detailEl.querySelector('.categoria-serie');
  if (codigoEl) codigoEl.textContent = codigoSerie;
  if (tituloEl) tituloEl.textContent = tituloSerie;
  if (categoriaEl) categoriaEl.textContent = categoria;
}

function applyUpdatesToActiveRow(identityField, identityValue, updates) {
  if (!identityField || !identityValue) return null;
  const index = activeRows.findIndex(
    (row) => String(row?.[identityField]) === String(identityValue),
  );
  if (index === -1) return null;
  activeRows[index] = { ...activeRows[index], ...updates };
  return activeRows[index];
}

function updateResultsTitle(modelFilter, count, languageFilter = null) {
  if (!resultsTitleEl) return;
  const modelLabel = modelFilter
    ? modelFilter.isNull
      ? '(sin modelo)'
      : modelFilter.label || modelFilter.value
    : 'Todos';
  const languageLabel = languageFilter?.label ? ` · Idioma: ${languageFilter.label}` : '';
  resultsTitleEl.textContent = `Modelo: ${modelLabel}${languageLabel} · Elementos cargados: ${count}`;
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

function getCreateTitleInputs() {
  if (!createTituloSeriesContainerEl) return [];
  return Array.from(
    createTituloSeriesContainerEl.querySelectorAll('input[data-create-title="true"]'),
  );
}

function renderCreateTitleInputs() {
  if (!createTituloSeriesContainerEl) return;
  createTituloSeriesContainerEl.innerHTML = '';

  const hasLanguages = availableLanguages.length > 0;
  const languageOptions = hasLanguages
    ? availableLanguages
    : [{ label: 'Título de serie', value: null }];

  languageOptions.forEach((option, index) => {
    const label = document.createElement('label');
    const text = document.createElement('span');
    text.textContent = hasLanguages
      ? `Título de serie (${option.label})`
      : 'Título de serie';
    const input = document.createElement('input');
    input.type = 'text';
    input.required = true;
    input.dataset.createTitle = 'true';
    input.name = hasLanguages ? `titulo_serie_${index + 1}` : 'titulo_serie';
    if (hasLanguages) {
      input.dataset.language = option.value ?? '';
    }
    label.appendChild(text);
    label.appendChild(input);
    createTituloSeriesContainerEl.appendChild(label);
  });
}

function openCreateModal() {
  if (!userCanEdit()) {
    showMessage('Solo los administradores pueden crear elementos.', true);
    return;
  }
  if (!activeTable) {
    showMessage('Selecciona un cuadro del catálogo antes de crear un elemento.', true);
    return;
  }
  setCreateStatus('', false);
  createCodigoSerieEl.value = '';
  renderCreateTitleInputs();
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

function setPositionInputValue(input, value) {
  if (!input) return;
  const normalizedValue = value ? String(value).trim() : '';
  input.value = normalizedValue;
  input.placeholder = normalizedValue ? '' : 'Raíz';
}

function rowMatchesPositionSearch(row, searchTerm) {
  const normalized = normalizeFilterValue(searchTerm);
  if (!normalized) return true;
  const fields = [
    row?.codigo_serie,
    row?.cod,
    row?.nombre_serie,
    row?.titulo_serie,
    row?.nombre_entidad,
    row?.categoria,
    row?.actividad,
  ];
  return fields.some((field) =>
    normalizeMatchValue(field).toLowerCase().includes(normalized),
  );
}

function filterPositionRowsWithHierarchy(rows, searchTerm) {
  if (!searchTerm) return rows || [];

  const nodes = (rows || []).map((row, index) => ({
    identity: getRowIdentity(row, `row-${index + 1}`),
    row,
    parent: null,
    children: [],
  }));

  const identityMap = new Map();
  nodes.forEach((node) => {
    if (!identityMap.has(node.identity)) {
      identityMap.set(node.identity, node);
    }
  });

  nodes.forEach((node) => {
    const parentIdentity = getParentIdentity(node.row);
    const parentNode =
      parentIdentity && identityMap.has(parentIdentity) ? identityMap.get(parentIdentity) : null;
    if (parentNode && parentNode !== node) {
      node.parent = parentNode;
      parentNode.children.push(node);
    }
  });

  const includedIdentities = new Set();
  const includeDescendants = (node) => {
    includedIdentities.add(node.identity);
    node.children.forEach((child) => includeDescendants(child));
  };

  nodes.forEach((node) => {
    if (!rowMatchesPositionSearch(node.row, searchTerm)) return;
    let current = node;
    while (current) {
      includedIdentities.add(current.identity);
      current = current.parent;
    }
    includeDescendants(node);
  });

  return (rows || []).filter((row, index) =>
    includedIdentities.has(getRowIdentity(row, `row-${index + 1}`)),
  );
}

function applyPositionSelection(value, label) {
  if (!positionSelectionContext) return;
  const { setValue, targetInput } = positionSelectionContext;
  if (typeof setValue === 'function') {
    setValue(value, label);
  } else if (targetInput) {
    setPositionInputValue(targetInput, value);
  }
  closePositionModal();
}

function createPositionHierarchyDetails(node, depth = 0, excludeCode = null) {
  const { row } = node;
  const { codigoSerie, tituloSerie, categoria } = getDisplayValuesForRow(row);
  const toneClass = getToneForCategoria(categoria, depth);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const selectValue = getCodigoSerieValue(row);
  const isDisabled =
    !selectValue || (excludeCode && selectValue === String(excludeCode).trim());

  const details = document.createElement('details');
  details.className = `result-item position-item ${toneClass}${hasChildren ? ' has-children' : ''}`;
  details.dataset.depth = depth;
  const summary = document.createElement('summary');
  summary.innerHTML = `
    <div class="result-summary">
      <div class="result-title">
        <span class="codigo-serie-badge">${codigoSerie}</span>
        <span class="result-separator">-</span>
        <span class="titulo-serie">${tituloSerie}</span>
        <span class="result-separator">-</span>
        <span class="categoria-serie">${categoria}</span>
        ${hasChildren ? '<span class="toggle-icon" aria-hidden="true"></span>' : ''}
      </div>
    </div>
  `;

  const selectButton = document.createElement('button');
  selectButton.type = 'button';
  selectButton.className = 'secondary position-select-button';
  selectButton.textContent = 'Seleccionar';
  selectButton.disabled = isDisabled;
  if (isDisabled && excludeCode) {
    selectButton.title = 'No se puede seleccionar el mismo nivel.';
  }
  selectButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (selectButton.disabled) return;
    applyPositionSelection(selectValue, selectValue);
  });
  summary.appendChild(selectButton);

  details.appendChild(summary);
  if (hasChildren) {
    const body = document.createElement('div');
    body.className = 'result-body';
    const childWrapper = document.createElement('div');
    childWrapper.className = 'child-list';
    node.children.forEach((childNode) => {
      childWrapper.appendChild(createPositionHierarchyDetails(childNode, depth + 1, excludeCode));
    });
    body.appendChild(childWrapper);
    details.appendChild(body);
  }

  return details;
}

function renderPositionHierarchy(searchTerm = '') {
  if (!positionListEl) return;
  positionListEl.innerHTML = '';

  const rootWrapper = document.createElement('div');
  rootWrapper.className = 'position-root';
  const rootButton = document.createElement('button');
  rootButton.type = 'button';
  rootButton.className = 'secondary position-select-button';
  rootButton.textContent = 'Raíz';
  rootButton.addEventListener('click', () => {
    applyPositionSelection('', 'Raíz');
  });
  rootWrapper.appendChild(rootButton);
  positionListEl.appendChild(rootWrapper);

  if (!activeRows || activeRows.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No hay datos cargados.';
    positionListEl.appendChild(empty);
    return;
  }

  const filteredRows = filterPositionRowsWithHierarchy(activeRows, searchTerm);
  const roots = buildHierarchy(filteredRows);
  if (!roots.length) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No hay resultados.';
    positionListEl.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'position-tree results-list';
  const excludeCode = positionSelectionContext?.excludeCode ?? null;
  roots.forEach((node) => {
    list.appendChild(createPositionHierarchyDetails(node, 0, excludeCode));
  });
  positionListEl.appendChild(list);

  if (searchTerm) {
    list.querySelectorAll('details').forEach((detail) => {
      detail.open = true;
    });
  }
}

function openPositionModal(context = {}) {
  positionSelectionContext = context;
  positionSearchEl.value = '';
  renderPositionHierarchy('');
  positionModalEl.hidden = false;
}

function closePositionModal() {
  positionModalEl.hidden = true;
  positionSelectionContext = null;
}

async function handleCreateSubmit(event) {
  event.preventDefault();
  if (!userCanEdit()) {
    setCreateStatus('Solo los administradores pueden crear elementos.', true);
    return;
  }
  if (!supabaseClient) {
    setCreateStatus('Configura Supabase antes de crear.', true);
    return;
  }
  if (!activeTable) {
    setCreateStatus('Selecciona un cuadro antes de crear.', true);
    return;
  }

  const codigoSerie = normalizeInputValue(createCodigoSerieEl.value);
  const tituloInputs = getCreateTitleInputs();
  if (!codigoSerie || tituloInputs.length === 0) {
    setCreateStatus('Completa código y título antes de crear.', true);
    return;
  }

  const tituloEntries = tituloInputs.map((input) => ({
    value: normalizeInputValue(input.value),
    language: input.dataset.language || null,
  }));

  const hasEmptyTitle = tituloEntries.some((entry) => !entry.value);
  if (hasEmptyTitle) {
    const message =
      availableLanguages.length > 0
        ? 'Completa todos los títulos por idioma antes de crear.'
        : 'Completa código y título antes de crear.';
    setCreateStatus(message, true);
    return;
  }

  const categoria = normalizeInputValue(createCategoriaEl.value);
  const posicion = normalizeInputValue(createPosicionEl.dataset.value ?? '');
  const basePayload = {
    codigo_serie: codigoSerie,
    last_change: new Date().toISOString(),
  };
  if (categoria !== null) {
    basePayload.categoria = categoria;
  }
  if (posicion !== null) {
    basePayload.posicion = posicion;
  }
  if (activeModelFilter) {
    basePayload.modelo = activeModelFilter.isNull ? null : activeModelFilter.value;
  }

  const payloads = tituloEntries.map((entry) => {
    const payload = { ...basePayload, titulo_serie: entry.value };
    if (availableLanguages.length > 0) {
      payload.idioma = entry.language;
    }
    return payload;
  });

  createSubmitButton.disabled = true;
  setCreateStatus('Creando elemento...', false);

  const { error } = await supabaseClient.from(activeTable).insert(payloads);
  if (error) {
    setCreateStatus(mapSupabaseError(error), true);
    createSubmitButton.disabled = false;
    return;
  }

  setCreateStatus('Elemento creado correctamente.', false);
  createSubmitButton.disabled = false;
  closeCreateModal();
  if (activeTable) {
    await loadRows(activeTable, activeModelFilter, activeLanguageFilter);
  }
}

function closeModelModal() {
  modelModalEl.hidden = true;
  pendingModelTable = null;
  modelModalMessageEl.textContent = '';
  modelListEl.innerHTML = '';
}

async function handleModelSelection(table, modelOption) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }
  setLanguageOptions([], null);
  const { options, error } = await fetchLanguageOptions(table, modelOption);
  if (error) {
    showMessage(mapSupabaseError(error), true);
    return;
  }
  if (options.length > 0) {
    openLanguageModal(table, modelOption, options);
    return;
  }
  await loadRows(table, modelOption, null);
}

async function openModelModal(table, label) {
  if (!supabaseClient) {
    showMessage('Configura Supabase antes de consultar tablas.', true);
    return;
  }

  if (pendingWizardModelSelection) {
    const modelValue = pendingWizardModelSelection;
    pendingWizardModelSelection = null;
    await applyWizardModelSelection(table, modelValue);
    return;
  }

  pendingModelTable = table;
  modelModalTitleEl.textContent = `Selecciona un modelo (${label || table})`;
  modelModalMessageEl.textContent = 'Cargando valores disponibles...';
  modelListEl.innerHTML = '';
  modelModalEl.hidden = false;

  const { options: modelOptions, error } = await fetchModelOptions(table);
  if (error) {
    modelModalMessageEl.textContent = mapSupabaseError(error);
    return;
  }

  if (modelOptions.length === 0) {
    modelModalMessageEl.textContent = 'No se encontraron valores en el campo "modelo".';
    return;
  }

  modelModalMessageEl.textContent = 'Selecciona Cuadro de Clasficación';
  modelOptions.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'secondary';
    button.textContent = option.label;
    button.addEventListener('click', async () => {
      const selectedTable = pendingModelTable;
      closeModelModal();
      if (selectedTable) {
        await handleModelSelection(selectedTable, option);
      }
    });
    modelListEl.appendChild(button);
  });
}

async function openDetailDrawer(row, title) {
  detailDrawerTitleEl.textContent = title || 'Detalles del registro';
  detailDrawerBodyEl.innerHTML = '';
  if (userCanEdit()) {
    updateDetailStatus('Edita los campos y guarda los cambios para confirmar.', false);
  } else {
    updateDetailStatus('Solo lectura: no tienes permisos de edición.', false);
  }
  detailDrawerSaveEl.disabled = !userCanEdit();
  if (detailDrawerHistoryEl) {
    const canShowHistory = userCanEdit() && activeTable === 'series_carga';
    detailDrawerHistoryEl.hidden = !canShowHistory;
    detailDrawerHistoryEl.disabled = !canShowHistory;
  }

  const codigoSerie = row?.codigo_serie ?? row?.cod ?? '';
  detailDrawerEl.dataset.codigoSerie = codigoSerie;
  const identityInfo = getRowIdentityInfo(row);
  detailDrawerEl.dataset.identityField = identityInfo.field;
  detailDrawerEl.dataset.identityValue = identityInfo.value;
  detailDrawerEl.dataset.originalId = row?.id ?? '';
  const resolvedModelValue =
    row?.modelo !== undefined
      ? row?.modelo
      : activeModelFilter?.isNull
        ? null
        : activeModelFilter?.value;
  detailDrawerEl.dataset.modelo =
    resolvedModelValue === null ? NULL_MODEL_TOKEN : resolvedModelValue ?? '';
  const actividad = await fetchActividadForCodigoSerie(codigoSerie, resolvedModelValue);
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
    input.placeholder = key === 'posicion' ? 'Raíz' : '—';
    if (readOnly || !userCanEdit()) {
      input.readOnly = true;
    }
    input.dataset.original = input.value;
    item.appendChild(labelEl);
    if (key === 'posicion') {
      const fieldWrap = document.createElement('div');
      fieldWrap.className = 'detail-position-field';
      input.readOnly = true;
      const positionButton = document.createElement('button');
      positionButton.type = 'button';
      positionButton.className = 'secondary detail-position-button';
      positionButton.textContent = 'Cambiar nivel superior';
      positionButton.disabled = !userCanEdit();
      positionButton.addEventListener('click', () => {
        openPositionModal({
          targetInput: input,
          excludeCode: codigoSerie,
          setValue: (value) => setPositionInputValue(input, value),
        });
      });
      fieldWrap.appendChild(input);
      fieldWrap.appendChild(positionButton);
      item.appendChild(fieldWrap);
    } else if (key === 'actividad') {
      input.setAttribute('list', 'activity-options');
      input.addEventListener('blur', () => {
        input.value = trimTrailingSpaces(input.value);
      });
      item.appendChild(input);
    } else {
      item.appendChild(input);
    }
    detailDrawerBodyEl.appendChild(item);
  });

  await ensureActivityOptionsLoaded();
  detailDrawerEl.hidden = false;
}

function closeDetailDrawer() {
  detailDrawerEl.hidden = true;
  closeHistoryModal();
}

function openHistoryModal() {
  if (!historyModalEl) return;
  if (!userCanEdit()) {
    updateDetailStatus('Solo los administradores pueden ver el histórico.', true);
    return;
  }
  if (activeTable !== 'series_carga') {
    updateDetailStatus('El histórico solo está disponible para series de carga.', true);
    return;
  }
  historyModalEl.hidden = false;
  loadHistoryForCurrentDetail();
}

function closeHistoryModal() {
  if (!historyModalEl) return;
  historyModalEl.hidden = true;
}

function renderHistoryList(rows) {
  if (!historyListEl) return;
  historyListEl.innerHTML = '';
  if (!rows.length) {
    const empty = document.createElement('div');
    empty.className = 'muted';
    empty.textContent = 'No hay cambios registrados para esta serie.';
    historyListEl.appendChild(empty);
    return;
  }

  rows.forEach((row) => {
    const entry = document.createElement('div');
    entry.className = 'history-entry';

    const meta = document.createElement('div');
    meta.className = 'history-meta';
    const dateEl = document.createElement('span');
    dateEl.textContent = `Fecha: ${formatHistoryDate(row.change_date)}`;
    const userEl = document.createElement('span');
    userEl.textContent = `Usuario: ${row.change_user || '—'}`;
    meta.appendChild(dateEl);
    meta.appendChild(userEl);

    const fields = document.createElement('div');
    fields.className = 'history-fields';
    [
      { key: 'original_codigo_serie', label: 'Código serie' },
      { key: 'original_titulo_serie', label: 'Título serie' },
      { key: 'original_categoria', label: 'Categoría' },
      { key: 'original_posicion', label: 'Posición' },
    ].forEach(({ key, label }) => {
      const field = document.createElement('div');
      field.className = 'history-field';
      const title = document.createElement('span');
      title.textContent = label;
      const value = document.createElement('div');
      const rawValue = row?.[key];
      value.textContent = rawValue === null || rawValue === undefined || rawValue === '' ? '—' : rawValue;
      field.appendChild(title);
      field.appendChild(value);
      fields.appendChild(field);
    });

    const actions = document.createElement('div');
    actions.className = 'history-actions';
    const revertButton = document.createElement('button');
    revertButton.type = 'button';
    revertButton.className = 'secondary';
    revertButton.textContent = 'Revertir';
    revertButton.disabled = !userCanEdit();
    revertButton.addEventListener('click', () => handleHistoryRevert(row));
    actions.appendChild(revertButton);

    entry.appendChild(meta);
    entry.appendChild(fields);
    entry.appendChild(actions);
    historyListEl.appendChild(entry);
  });
}

async function loadHistoryForCurrentDetail() {
  if (!supabaseClient) {
    updateHistoryStatus('Configura Supabase antes de consultar histórico.', true);
    renderHistoryList([]);
    return;
  }
  const originalId = detailDrawerEl?.dataset.originalId;
  if (!originalId) {
    updateHistoryStatus('No se pudo identificar el registro para histórico.', true);
    renderHistoryList([]);
    return;
  }
  updateHistoryStatus('Cargando histórico...', false);
  const { data, error } = await supabaseClient
    .from('carga_historic')
    .select('*')
    .eq('original_id', originalId)
    .order('change_date', { ascending: false });
  if (error) {
    updateHistoryStatus(mapSupabaseError(error), true);
    renderHistoryList([]);
    return;
  }
  updateHistoryStatus(`Cambios registrados: ${(data || []).length}`, false);
  renderHistoryList(data || []);
}

async function handleHistoryRevert(historyRow) {
  if (!userCanEdit()) {
    updateHistoryStatus('Solo los administradores pueden revertir cambios.', true);
    return;
  }
  if (!supabaseClient) {
    updateHistoryStatus('Configura Supabase antes de revertir.', true);
    return;
  }
  if (activeTable !== 'series_carga') {
    updateHistoryStatus('La reversión solo aplica a series de carga.', true);
    return;
  }
  const identityField = detailDrawerEl.dataset.identityField;
  const identityValue = detailDrawerEl.dataset.identityValue;
  const originalId = detailDrawerEl.dataset.originalId;
  if (!identityField || !identityValue) {
    updateHistoryStatus('No se pudo identificar el registro para revertir.', true);
    return;
  }

  const inputs = Array.from(detailDrawerBodyEl.querySelectorAll('input[name]'));
  const lastChange = new Date().toISOString();
  const historyPayload = buildHistoryPayload(inputs, originalId, lastChange, false);
  const updates = {
    codigo_serie: historyRow?.original_codigo_serie ?? null,
    titulo_serie: historyRow?.original_titulo_serie ?? null,
    categoria: historyRow?.original_categoria ?? null,
    posicion: historyRow?.original_posicion ?? null,
    last_change: lastChange,
  };

  updateHistoryStatus('Revirtiendo cambios...', false);
  try {
    const { error } = await supabaseClient
      .from(activeTable)
      .update(updates)
      .eq(identityField, identityValue);
    if (error) {
      throw error;
    }

    const { error: historyError } = await supabaseClient
      .from('carga_historic')
      .insert([historyPayload]);

    inputs.forEach((input) => {
      if (input.name in updates) {
        const value = updates[input.name];
        input.value = value === null || value === undefined ? '' : String(value);
        input.dataset.original = input.value;
      }
      if (input.name === 'last_change') {
        input.value = lastChange;
        input.dataset.original = lastChange;
      }
    });

    if (updates.codigo_serie !== null && updates.codigo_serie !== undefined) {
      detailDrawerEl.dataset.codigoSerie = updates.codigo_serie;
      if (identityField === 'codigo_serie') {
        detailDrawerEl.dataset.identityValue = updates.codigo_serie;
      }
    }

    if (historyError) {
      updateHistoryStatus('Revertido, pero no se pudo registrar el histórico.', true);
      updateDetailStatus('Revertido con advertencia en histórico.', true);
    } else {
      updateHistoryStatus('Reversión aplicada y registrada.', false);
      updateDetailStatus('Valores revertidos y guardados.', false);
    }

    if (activeTable) {
      await loadRows(activeTable, activeModelFilter, activeLanguageFilter);
    }
    await loadHistoryForCurrentDetail();
  } catch (error) {
    updateHistoryStatus(mapSupabaseError(error), true);
  }
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
  const options = buildActivityOptionsFromRows(actividadesRows);
  activityOptionsCache.set(table, options);
  if (table === getActividadesTableForActive()) {
    activityPickerOptions = options;
    setActivityOptionsDatalist(options);
  }
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

function getActivityFieldMapFromData(fields, sampleRow) {
  return {
    actividadCode: pickActivityField(ACTIVITY_FIELD_CANDIDATES.actividadCode, fields, sampleRow),
    actividadName: pickActivityField(ACTIVITY_FIELD_CANDIDATES.actividadName, fields, sampleRow),
    actividadLink: pickActivityField(
      ACTIVITY_LINK_FIELD_CANDIDATES.actividad,
      fields,
      sampleRow,
    ),
  };
}

function getActivityFieldMap() {
  const entity = activeCatalog?.entities?.find((item) => item?.carga?.table === activeTable);
  const fields = entity?.actividades?.fields ?? [];
  const sampleRow = actividadesRows[0] || {};
  const baseFields = fields.length ? fields : Object.keys(sampleRow);

  return getActivityFieldMapFromData(baseFields, sampleRow);
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
  rowEl.dataset.actividadLinkValue = data.actividadLinkValue ?? '';
  rowEl.dataset.nameField = data.nameField;
}

function buildActivityRowData(row, fieldMap) {
  const actividadCode = row?.[fieldMap.actividadCode] ?? '';
  const actividadName = row?.[fieldMap.actividadName] ?? '';
  const actividadLinkValue =
    row?.[fieldMap.actividadLink] ?? row?.[fieldMap.actividadName] ?? actividadCode;
  const identityField = row?.id !== undefined && row?.id !== null ? 'id' : '';
  const identityValue = row?.id !== undefined && row?.id !== null ? row.id : '';
  return {
    actividadField: fieldMap.actividadCode,
    actividadValue: actividadCode ?? '',
    actividadName: actividadName ?? '',
    actividadLinkValue: actividadLinkValue ?? '',
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
    editButton.disabled = !userCanEdit();
    if (!userCanEdit()) {
      editButton.title = 'Solo lectura';
    }
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
      loadLinkedSeriesForActivity(
        rowData.actividadLinkValue || rowData.actividadName || rowData.actividadValue,
        linkedStatus,
        linkedTable,
      );
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
  if (updates[fieldMap.actividadLink] !== undefined) {
    rowEl.dataset.actividadLinkValue = updates[fieldMap.actividadLink] ?? '';
  } else if (
    updates[fieldMap.actividadName] !== undefined &&
    fieldMap.actividadLink === fieldMap.actividadName
  ) {
    rowEl.dataset.actividadLinkValue = updates[fieldMap.actividadName] ?? '';
  }
}

function updateActividadesRowsData(context, updates) {
  if (!context || !updates) return;
  const matchById = context.identityField && context.identityValue;
  const matchByKeys = context.actividadField;
  const targetIndex = actividadesRows.findIndex((row) => {
    if (matchById) {
      return areMatchValues(row?.[context.identityField], context.identityValue);
    }
    if (matchByKeys) {
      return areMatchValues(row?.[context.actividadField], context.actividadValue);
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
  if (!userCanEdit()) {
    showActivitiesMessage('Solo los administradores pueden editar actividades.', true);
    return;
  }
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
      return areMatchValues(row?.[context.identityField], context.identityValue);
    }
    return areMatchValues(row?.[context.actividadField], context.actividadValue);
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
  if (!userCanEdit()) {
    updateActivityEditStatus('Solo los administradores pueden guardar cambios.', true);
    return;
  }
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
    modelo: pickActivityField(LINKED_SERIES_FIELD_CANDIDATES.modelo, Object.keys(sampleRow), sampleRow),
  };
}

function getSeriesCargaFieldMap(rows) {
  const sampleRow = rows?.[0] ?? {};
  return {
    codigoSerie: pickActivityField(SERIES_CARGA_FIELD_CANDIDATES.codigoSerie, Object.keys(sampleRow), sampleRow),
    nombre: pickActivityField(SERIES_CARGA_FIELD_CANDIDATES.nombre, Object.keys(sampleRow), sampleRow),
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
  const actividadMatchValue = normalizeMatchValue(actividadValue);
  if (!actividadMatchValue) {
    updateLinkedSeriesStatus(statusEl, 'No se pudo identificar la actividad para vinculación.', true);
    renderLinkedSeriesTable([], tableEl);
    return;
  }
  updateLinkedSeriesStatus(statusEl, 'Consultando series vinculadas...', false);
  const modelFilter = resolveModelFilter();
  let query = supabaseClient
    .from('series_vinculacion')
    .select('*')
    .ilike('actividad', `${actividadMatchValue}%`);
  query = applyModelFilterToQuery(query, modelFilter);
  const { data, error } = await query;
  if (error) {
    updateLinkedSeriesStatus(statusEl, mapSupabaseError(error), true);
    renderLinkedSeriesTable([], tableEl);
    return;
  }
  const matchedRows = (data || []).filter((row) => areMatchValues(row?.actividad, actividadMatchValue));
  if (!matchedRows.length) {
    updateLinkedSeriesStatus(statusEl, 'Series vinculadas: 0', false);
    renderLinkedSeriesTable([], tableEl);
    if (tableEl) tableEl.dataset.loaded = 'true';
    return;
  }

  const vinculacionMap = getLinkedSeriesFieldMap(matchedRows);
  const codes = new Set();
  matchedRows.forEach((row) => {
    const rawCode = row?.[vinculacionMap.codigoSerie];
    const modelValue = row?.[vinculacionMap.modelo];
    if (rawCode === null || rawCode === undefined) return;
    const raw = String(rawCode);
    const trimmed = raw.trim();
    if (trimmed) codes.add(trimmed);
    if (raw && raw !== trimmed) codes.add(raw);
  });

  let cargaRows = [];
  if (codes.size) {
    let cargaQuery = supabaseClient
      .from('series_carga')
      .select('*')
      .in('codigo_serie', Array.from(codes));
    cargaQuery = applyModelFilterToQuery(cargaQuery, modelFilter);
    const { data: cargaData, error: cargaError } = await cargaQuery;
    if (!cargaError) {
      cargaRows = cargaData || [];
    }
  }

  const cargaMap = getSeriesCargaFieldMap(cargaRows);
  const cargaByKey = new Map();
  cargaRows.forEach((row) => {
    const key = normalizeMatchValue(row?.[cargaMap.codigoSerie]);
    if (!key) return;
    const modelValue = row?.[cargaMap.modelo];
    cargaByKey.set(buildLinkedSeriesKey(key, modelValue), {
      nombre: row?.[cargaMap.nombre],
      modelo: modelValue,
    });
  });

  const mergedRows = matchedRows.map((row) => {
    const codigoRaw = row?.[vinculacionMap.codigoSerie];
    const codigoKey = normalizeMatchValue(codigoRaw);
    const modelValue = row?.[vinculacionMap.modelo];
    const cargaInfo = codigoKey ? cargaByKey.get(buildLinkedSeriesKey(codigoKey, modelValue)) : null;
    return {
      codigo: codigoRaw ?? '—',
      nombre: cargaInfo?.nombre ?? '—',
      modelo: modelValue ?? cargaInfo?.modelo ?? '—',
    };
  });

  updateLinkedSeriesStatus(statusEl, `Series vinculadas: ${mergedRows.length}`, false);
  renderLinkedSeriesTable(mergedRows, tableEl);
  if (tableEl) tableEl.dataset.loaded = 'true';
}

async function handleActivityCreateSubmit(event) {
  event.preventDefault();
  if (!userCanEdit()) {
    updateActivityCreateStatus('Solo los administradores pueden crear actividades.', true);
    return;
  }
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
  if (!userCanEdit()) {
    updateDetailStatus('Solo los administradores pueden guardar cambios.', true);
    return;
  }
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
  const vinculacionTable = getVinculacionTableForActive();
  const vinculacionFieldMap = getVinculacionFieldMap();
  const codigoSerie = detailDrawerEl.dataset.codigoSerie;
  const shouldUpdateActividad = actividadChanged && vinculacionTable && codigoSerie;
  const originalId = detailDrawerEl.dataset.originalId || null;
  const shouldLogHistory = activeTable === 'series_carga' && hasMainUpdates;

  if (!hasMainUpdates && !shouldUpdateActividad) {
    updateDetailStatus('No hay cambios para guardar.', false);
    return;
  }

  detailDrawerSaveEl.disabled = true;
  updateDetailStatus('Guardando cambios...', false);

  try {
    const lastChange = new Date().toISOString();
    const rowUpdates = { ...updates };
    if (hasMainUpdates) {
      updates.last_change = lastChange;
      rowUpdates.last_change = lastChange;
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
      rowUpdates.last_change = lastChange;
    }

    if (shouldUpdateActividad) {
      const modelValue = parseModelDatasetValue(detailDrawerEl.dataset.modelo);
      const modelFilter = resolveModelFilter(modelValue);
      let vinculacionQuery = supabaseClient
        .from(vinculacionTable)
        .update({ [vinculacionFieldMap.actividad]: actividadUpdate })
        .eq(vinculacionFieldMap.codigoSerie, codigoSerie);
      vinculacionQuery = applyModelFilterToQuery(vinculacionQuery, modelFilter);
      const { error } = await vinculacionQuery;
      if (error) {
        throw error;
      }
    }

    let historyWarning = false;
    if (shouldLogHistory) {
      const historyPayload = buildHistoryPayload(inputs, originalId, lastChange, true);
      const { error } = await supabaseClient.from('carga_historic').insert([historyPayload]);
      if (error) {
        historyWarning = true;
      }
    }

    inputs.forEach((input) => {
      if (input.name === 'last_change') {
        input.value = lastChange;
      }
      input.dataset.original = input.value;
    });

    const updatedRow = applyUpdatesToActiveRow(identityField, identityValue, rowUpdates);
    if (updatedRow) {
      const detailEl = findResultItemElement(identityField, identityValue);
      updateResultItemSummary(detailEl, updatedRow);
      if (detailEl && updates[identityField] !== undefined) {
        detailEl.dataset.identityValue = String(updates[identityField]);
      }
    }
    if (updates.codigo_serie !== undefined) {
      detailDrawerEl.dataset.codigoSerie = updates.codigo_serie ?? '';
    }
    if (updates[identityField] !== undefined) {
      detailDrawerEl.dataset.identityValue = String(updates[identityField]);
    }
    if (updatedRow) {
      const { tituloSerie } = getDisplayValuesForRow(updatedRow);
      detailDrawerTitleEl.textContent = tituloSerie;
    }

    if (historyWarning) {
      updateDetailStatus('Cambios guardados, pero no se pudo registrar el histórico.', true);
    } else {
      updateDetailStatus('Cambios guardados en Supabase.', false);
    }
  } catch (error) {
    updateDetailStatus(mapSupabaseError(error), true);
  } finally {
    detailDrawerSaveEl.disabled = false;
  }
}

async function fetchEnvConfig() {
  try {
    const response = await fetch('/api/config', { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function init() {
  const env = await fetchEnvConfig();

  updateResultsTitle(null, 0);
  loadStoredAuthUser();
  applyAccessControl();

  if (!env) {
    vercelWarningEl.hidden = false;
    setStatus('warning', 'Sin /api/config');
    showMessage('No se encontró configuración de entorno.', true);
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
    setStatus('warning', 'Configuración incompleta');
    showMessage(validation.reason, true);
    return;
  }

  if (validation.warning) {
    setStatus('warning', 'Configura Supabase');
    showMessage(validation.warning, true);
  } else {
    setStatus('ok', 'Configuración lista');
    showMessage('', false);
  }

  supabaseClient = createSupabaseClient({
    supabaseUrl: env.SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY,
  });

  pingSupabase();
}
if (loginButton) {
  loginButton.addEventListener('click', openLoginModal);
}
if (modelWizardButton) {
  modelWizardButton.addEventListener('click', openModelWizardModal);
}
if (logoutButton) {
  logoutButton.addEventListener('click', () => {
    setAuthUser(null);
  });
}
if (exportAllButton) {
  exportAllButton.addEventListener('click', exportAllCsvAsZip);
}
if (loginModalCloseEl) {
  loginModalCloseEl.addEventListener('click', closeLoginModal);
}
if (modelWizardCloseEl) {
  modelWizardCloseEl.addEventListener('click', closeModelWizardModal);
}
if (loginFormEl) {
  loginFormEl.addEventListener('submit', (event) => {
    event.preventDefault();
    handleLogin();
  });
}
if (loginSubmitEl) {
  loginSubmitEl.addEventListener('click', handleLogin);
}
if (registerSubmitEl) {
  registerSubmitEl.addEventListener('click', handleRegister);
}
if (modelWizardBackEl) {
  modelWizardBackEl.addEventListener('click', () => {
    if (modelWizardHistory.length === 0) return;
    modelWizardNode = modelWizardHistory.pop();
    modelWizardSelection = null;
    renderModelWizard();
  });
}
if (modelWizardConfirmEl) {
  modelWizardConfirmEl.addEventListener('click', async () => {
    if (!modelWizardSelection) {
      if (modelWizardStatusEl) {
        modelWizardStatusEl.textContent = 'Selecciona un modelo para continuar.';
      }
      return;
    }
    const selectedModel = modelWizardSelection;
    closeModelWizardModal();
    if (!activeTable) {
      if (lastSelectedTable) {
        await applyWizardModelSelection(lastSelectedTable, selectedModel);
        return;
      }
      pendingWizardModelSelection = selectedModel;
      showMessage('', false);
      return;
    }
    await applyWizardModelSelection(activeTable, selectedModel);
  });
}
modelModalCloseEl.addEventListener('click', closeModelModal);
if (languageModalCloseEl) {
  languageModalCloseEl.addEventListener('click', closeLanguageModal);
}
openCreateModalButton.addEventListener('click', openCreateModal);
createModalCloseEl.addEventListener('click', closeCreateModal);
createPosicionSearchEl.addEventListener('click', () => {
  openPositionModal({
    targetInput: createPosicionEl,
    setValue: setPositionValue,
  });
});
positionModalCloseEl.addEventListener('click', closePositionModal);
positionSearchEl.addEventListener('input', (event) => {
  renderPositionHierarchy(event.target.value);
});
createFormEl.addEventListener('submit', handleCreateSubmit);
detailDrawerCloseEl.addEventListener('click', closeDetailDrawer);
if (detailDrawerHistoryEl) {
  detailDrawerHistoryEl.addEventListener('click', openHistoryModal);
}
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
if (activityPickerCloseEl) {
  activityPickerCloseEl.addEventListener('click', closeActivityPickerModal);
}
if (activityPickerSearchEl) {
  activityPickerSearchEl.addEventListener('input', (event) => {
    renderActivityPickerList(event.target.value);
  });
}
if (activityPickerModalEl) {
  activityPickerModalEl.addEventListener('click', (event) => {
    if (event.target === activityPickerModalEl) {
      closeActivityPickerModal();
    }
  });
}
if (loginModalEl) {
  loginModalEl.addEventListener('click', (event) => {
    if (event.target === loginModalEl) {
      closeLoginModal();
    }
  });
}
if (languageModalEl) {
  languageModalEl.addEventListener('click', (event) => {
    if (event.target === languageModalEl) {
      closeLanguageModal();
    }
  });
}
if (historyModalCloseEl) {
  historyModalCloseEl.addEventListener('click', closeHistoryModal);
}
if (historyModalEl) {
  historyModalEl.addEventListener('click', (event) => {
    if (event.target === historyModalEl) {
      closeHistoryModal();
    }
  });
}
if (modelWizardModalEl) {
  modelWizardModalEl.addEventListener('click', (event) => {
    if (event.target === modelWizardModalEl) {
      closeModelWizardModal();
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
    if (historyModalEl && !historyModalEl.hidden) {
      closeHistoryModal();
    }
    if (activityEditModalEl && !activityEditModalEl.hidden) {
      closeActivityEditModal();
    }
    if (activityPickerModalEl && !activityPickerModalEl.hidden) {
      closeActivityPickerModal();
    }
    if (loginModalEl && !loginModalEl.hidden) {
      closeLoginModal();
    }
    if (languageModalEl && !languageModalEl.hidden) {
      closeLanguageModal();
    }
    if (modelWizardModalEl && !modelWizardModalEl.hidden) {
      closeModelWizardModal();
    }
  }
});

filterFormEl.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!activeTable) {
    showMessage('Selecciona un cuadro del catálogo antes de aplicar filtros.', true);
    return;
  }
  await loadRows(activeTable, activeModelFilter, activeLanguageFilter);
});

clearFiltersButton.addEventListener('click', async () => {
  filterCodigoSerieEl.value = '';
  filterTituloSerieEl.value = '';
  filterCategoriaEl.value = '';
  if (activeTable) {
    await loadRows(activeTable, activeModelFilter, activeLanguageFilter);
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
