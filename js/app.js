// ============================================
// PRESUPUESTO PRO - Main App Controller
// ============================================

// --- Global State ---
const APP = {
  currentStep: 1,
  totalSteps: 8,
  project: {},
  zones: [],
  workers: [],
  budgetType: 'painting',
  expenses: [],
  zoneCounter: 0,
  workerCounter: 0,
  expenseCounter: 0
};

// --- Step Labels ---
const STEP_LABELS = ['Proyecto','Zonas','Equipo','Tipo','Materiales','Gastos','Cronograma','Presupuesto'];

// --- Default Expenses ---
const DEFAULT_EXPENSES = [
  { name: 'Movilidad / Combustible', amount: 0, perDay: true },
  { name: 'Peajes', amount: 0, perDay: false },
  { name: 'Alquiler andamio', amount: 0, perDay: true },
  { name: 'Contenedor residuos', amount: 0, perDay: false },
  { name: 'Seguro ART / Cobertura', amount: 0, perDay: false },
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderStepper();
  addZone();
  addWorker();
  initDefaultExpenses();
  bindEvents();
  goToStep(APP.currentStep);
  autoSelectSeason();
});

function autoSelectSeason() {
  const m = new Date().getMonth();
  const sel = document.getElementById('season');
  if (m >= 11 || m <= 1) sel.value = 'summer';
  else if (m <= 4) sel.value = 'autumn';
  else if (m <= 7) sel.value = 'winter';
  else sel.value = 'spring';
}

// ============================================
// STEPPER
// ============================================
function renderStepper() {
  const c = document.getElementById('stepper');
  c.innerHTML = STEP_LABELS.map((label, i) => {
    const num = i + 1;
    return `<div class="stepper-item" data-stepnum="${num}">
      <div class="stepper-line"></div>
      <div class="stepper-circle">${num}</div>
      <span class="stepper-label">${label}</span>
    </div>`;
  }).join('');
  c.querySelectorAll('.stepper-item').forEach(item => {
    item.addEventListener('click', () => {
      const n = parseInt(item.dataset.stepnum);
      if (n <= APP.currentStep + 1) goToStep(n);
    });
  });
}

function updateStepper() {
  document.querySelectorAll('.stepper-item').forEach(item => {
    const n = parseInt(item.dataset.stepnum);
    item.classList.toggle('active', n === APP.currentStep);
    item.classList.toggle('completed', n < APP.currentStep);
    if (n < APP.currentStep) {
      item.querySelector('.stepper-circle').innerHTML = '✓';
    } else {
      item.querySelector('.stepper-circle').innerHTML = n;
    }
  });
  document.getElementById('stepIndicator').textContent = `Paso ${APP.currentStep} de ${APP.totalSteps}`;
}

// ============================================
// NAVIGATION
// ============================================
function goToStep(n) {
  if (n < 1 || n > APP.totalSteps) return;
  APP.currentStep = n;
  document.querySelectorAll('.step-section').forEach(s => {
    s.classList.add('hidden');
  });
  const target = document.getElementById(`step-${n}`);
  if (target) { target.classList.remove('hidden'); target.classList.add('animate-fade-in'); }
  
  document.getElementById('prevBtn').disabled = n === 1;
  const nextBtn = document.getElementById('nextBtn');
  if (n === APP.totalSteps) {
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.classList.remove('hidden');
  }
  
  updateStepper();
  
  // Trigger calculations on certain steps
  if (n === 5) calculateMaterials();
  if (n === 6) updateExpensesSummary();
  if (n === 7) calculateTimeline();
  if (n === 8) renderPreview();
  
  saveState();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function bindEvents() {
  document.getElementById('nextBtn').addEventListener('click', () => goToStep(APP.currentStep + 1));
  document.getElementById('prevBtn').addEventListener('click', () => goToStep(APP.currentStep - 1));
  document.getElementById('addZoneBtn').addEventListener('click', addZone);
  document.getElementById('addWorkerBtn').addEventListener('click', addWorker);
  document.getElementById('addExpenseBtn').addEventListener('click', () => addExpense('', 0, false));
  
  // Budget type selection
  document.querySelectorAll('.budget-type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.budget-type-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      APP.budgetType = card.dataset.type;
      toggleBudgetSections();
    });
  });

  // IVA toggle
  document.getElementById('includeIVA').addEventListener('change', (e) => {
    document.getElementById('ivaPercent').disabled = !e.target.checked;
    updateExpensesSummary();
  });
  document.getElementById('contingencyPercent').addEventListener('input', updateExpensesSummary);
  document.getElementById('ivaPercent').addEventListener('input', updateExpensesSummary);

  // Print & WhatsApp
  document.getElementById('printBtn').addEventListener('click', printBudget);
  document.getElementById('whatsappBtn').addEventListener('click', shareWhatsApp);
  
  // Night work toggle based on property type
  document.getElementById('propertyType').addEventListener('change', (e) => {
    const nightRow = document.getElementById('nightWork').closest('.form-group');
    if (e.target.value === 'local') {
      nightRow.style.opacity = '1';
    } else {
      nightRow.style.opacity = '0.5';
      document.getElementById('nightWork').checked = false;
    }
  });
}

function toggleBudgetSections() {
  const t = APP.budgetType;
  document.getElementById('paintConfig').classList.toggle('hidden', t === 'plasterboard');
  document.getElementById('plasterConfig').classList.toggle('hidden', t === 'painting');
  document.getElementById('paintMaterialsSection').classList.toggle('hidden', t === 'plasterboard');
  document.getElementById('plasterMaterialsSection').classList.toggle('hidden', t === 'painting');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(msg, type = 'info') {
  const c = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

// ============================================
// UTILITY
// ============================================
function fmt(n) { return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n); }
function fmtNum(n, d = 2) { return Number(n).toFixed(d); }
function uid() { return 'id_' + (++APP.zoneCounter) + '_' + Date.now(); }

// ============================================
// LOCAL STORAGE
// ============================================
function saveState() {
  try {
    const data = { project: getProjectData(), zones: getZonesData(), workers: getWorkersData(), budgetType: APP.budgetType, currentStep: APP.currentStep };
    localStorage.setItem('presupuestoPro', JSON.stringify(data));
  } catch(e) {}
}

function loadState() {
  try {
    const d = JSON.parse(localStorage.getItem('presupuestoPro'));
    if (d) APP.currentStep = d.currentStep || 1;
  } catch(e) {}
}

function getProjectData() {
  return {
    clientName: document.getElementById('clientName')?.value || '',
    clientPhone: document.getElementById('clientPhone')?.value || '',
    workAddress: document.getElementById('workAddress')?.value || '',
    propertyType: document.getElementById('propertyType')?.value || 'casa',
    workLocation: document.getElementById('workLocation')?.value || 'interior',
    companyName: document.getElementById('companyName')?.value || '',
    companyPhone: document.getElementById('companyPhone')?.value || '',
  };
}
