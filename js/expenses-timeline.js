// ============================================
// EXPENSES MODULE
// ============================================

function initDefaultExpenses() {
  DEFAULT_EXPENSES.forEach(exp => addExpense(exp.name, exp.amount, exp.perDay));
}

function addExpense(name, amount, perDay) {
  APP.expenseCounter++;
  const id = 'expense_' + APP.expenseCounter;
  const html = `
    <div class="expense-row" id="${id}">
      <div class="flex items-center gap-2">
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div class="sm:col-span-1">
            <input type="text" class="form-input py-2 text-sm expense-name" value="${name}" placeholder="Descripción del gasto" oninput="updateExpensesSummary()">
          </div>
          <div>
            <input type="number" class="form-input py-2 text-sm expense-amount" value="${amount}" placeholder="$0" min="0" step="100" inputmode="numeric" oninput="updateExpensesSummary()">
          </div>
          <div class="flex items-center gap-2">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" class="sr-only peer expense-perday" ${perDay ? 'checked' : ''} onchange="updateExpensesSummary()">
              <div class="w-9 h-5 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span class="text-xs text-slate-400">×día</span>
          </div>
        </div>
        <button class="btn-remove" onclick="removeExpense('${id}')" title="Eliminar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>`;
  document.getElementById('expensesContainer').insertAdjacentHTML('beforeend', html);
}

function removeExpense(id) {
  const el = document.getElementById(id);
  el.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => { el.remove(); updateExpensesSummary(); }, 300);
}

function getExpensesData() {
  const expenses = [];
  document.querySelectorAll('.expense-row').forEach(row => {
    const name = row.querySelector('.expense-name')?.value || '';
    const amount = parseFloat(row.querySelector('.expense-amount')?.value) || 0;
    const perDay = row.querySelector('.expense-perday')?.checked || false;
    if (name || amount > 0) expenses.push({ name, amount, perDay });
  });
  return expenses;
}

function getEstimatedDays() {
  const el = document.getElementById('calendarDays');
  if (!el) return 10;
  const match = el.textContent.match(/(\d+)/);
  return match ? parseInt(match[1]) : 10;
}

function updateExpensesSummary() {
  const expenses = getExpensesData();
  const days = getEstimatedDays();
  let total = 0;
  expenses.forEach(e => { total += e.perDay ? e.amount * days : e.amount; });

  const contingency = parseFloat(document.getElementById('contingencyPercent').value) || 0;
  const materialsData = getMaterialsData();
  const laborData = getLaborData();
  const subtotalBase = materialsData.paintTotal + materialsData.plasterTotal + laborData.total;
  const contingencyAmount = subtotalBase * contingency / 100;
  total += contingencyAmount;

  const includeIVA = document.getElementById('includeIVA').checked;
  const ivaPercent = parseFloat(document.getElementById('ivaPercent').value) || 21;
  const ivaAmount = includeIVA ? (subtotalBase + total) * ivaPercent / 100 : 0;

  document.getElementById('totalExpenses').textContent = fmt(total + ivaAmount);
}

// ============================================
// TIMELINE MODULE
// ============================================

const RAIN_FACTORS = { summer: 1.15, autumn: 1.25, winter: 1.20, spring: 1.20 };
const DRYING_DAYS = { painting: 3, plasterboard: 4, both: 5 };

function calculateTimeline() {
  const zones = getZonesData();
  const workers = getWorkersData();
  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  const totalArea = totalWall + totalCeiling;
  const bt = APP.budgetType;
  const condition = document.getElementById('surfaceCondition')?.value || 'regular';
  const numWorkers = Math.max(1, workers.length);

  let stages = [];
  let totalJornales = 0;

  // Painting stages
  if (bt === 'painting' || bt === 'both') {
    const cf = CONDITION_FACTORS[condition];
    const paintStages = [
      { name: 'Protección y preparación', jornales: totalArea / 100, color: 'bg-slate-500' },
      { name: 'Remoción y limpieza', jornales: condition === 'good' ? 0 : totalArea / 30 * cf, color: 'bg-red-500' },
      { name: 'Reparación de superficies', jornales: condition === 'good' ? totalArea / 50 : totalArea / 20 * cf, color: 'bg-orange-500' },
      { name: 'Lijado general', jornales: totalArea / 40, color: 'bg-yellow-500' },
      { name: 'Sellador/Imprimación', jornales: totalArea / 80, color: 'bg-lime-500' },
      { name: 'Enduido (2 manos)', jornales: totalArea / 25 * 2, color: 'bg-green-500' },
      { name: 'Lijado fino', jornales: totalArea / 65, color: 'bg-teal-500' },
      { name: 'Pintura (2+ manos)', jornales: totalArea / 50 * (parseInt(document.getElementById('paintCoats')?.value) || 2), color: 'bg-blue-500' },
      { name: 'Terminaciones', jornales: Math.max(0.5, zones.reduce((s, z) => s + z.doors * 0.2 + z.windows * 0.15, 0)), color: 'bg-indigo-500' },
      { name: 'Limpieza final', jornales: totalArea / 80, color: 'bg-purple-500' },
    ];
    stages = stages.concat(paintStages);
  }

  // Plasterboard stages
  if (bt === 'plasterboard' || bt === 'both') {
    const type = document.getElementById('plasterType')?.value || 'modular';
    let plasterStages = [];
    
    if (type === 'continuo') {
      const area = parseFloat(document.getElementById('plasterTotalArea')?.value) || totalCeiling;
      plasterStages = [
        { name: 'Estructura y emplacado', jornales: area / 15, color: 'bg-amber-500' },
        { name: 'Tomado de juntas', jornales: area / 20, color: 'bg-orange-400' },
        { name: 'Lijado general', jornales: area / 30, color: 'bg-yellow-400' },
        { name: 'Pintura (2 manos)', jornales: area / 25, color: 'bg-sky-400' }
      ];
    } else {
      const customPlates = parseInt(document.getElementById('customPlateCount')?.value) || Math.ceil(totalCeiling / 0.78);
      plasterStages = [
        { name: 'Corte de placas', jornales: customPlates / 35, color: 'bg-amber-500' },
        { name: 'Aplicación masilla', jornales: customPlates / 30, color: 'bg-orange-400' },
        { name: 'Lijado placas', jornales: customPlates / 35, color: 'bg-yellow-400' },
        { name: '1ra mano pintura placas', jornales: customPlates / 45, color: 'bg-sky-400' },
        { name: '2da mano pintura placas', jornales: customPlates / 50, color: 'bg-sky-500' },
        { name: 'Control/Almacenamiento', jornales: customPlates / 70, color: 'bg-emerald-400' },
      ];
    }
    stages = stages.concat(plasterStages);
  }

  // Filter out zero stages
  stages = stages.filter(s => s.jornales > 0.05);
  totalJornales = stages.reduce((s, st) => s + st.jornales, 0);
  
  const baseDays = Math.ceil(totalJornales / numWorkers);
  const season = document.getElementById('season').value;
  const rainFactor = RAIN_FACTORS[season];
  const nightWork = document.getElementById('nightWork').checked;
  const nightFactor = nightWork ? 0.7 : 1;
  const dryingDays = DRYING_DAYS[bt] || 3;
  const rainDaysExtra = Math.ceil(baseDays * (rainFactor - 1));
  const calendarDays = Math.ceil((baseDays + dryingDays) * nightFactor + rainDaysExtra);

  // Render timeline bars
  const container = document.getElementById('timelineContainer');
  const maxJ = Math.max(...stages.map(s => s.jornales));
  container.innerHTML = stages.map(s => {
    const pct = Math.max(8, (s.jornales / maxJ) * 100);
    return `<div class="flex items-center gap-2">
      <span class="text-xs text-slate-400 w-40 sm:w-48 text-right truncate flex-shrink-0">${s.name}</span>
      <div class="flex-1">
        <div class="timeline-bar ${s.color}" style="width:${pct}%">${fmtNum(s.jornales, 1)}j</div>
      </div>
    </div>`;
  }).join('');

  // Update summary
  document.getElementById('totalJornales').textContent = fmtNum(totalJornales, 1);
  document.getElementById('totalDays').textContent = baseDays + ' días';
  document.getElementById('rainDays').textContent = '+' + rainDaysExtra + ' días';
  document.getElementById('calendarDays').textContent = calendarDays + ' días';
}

function getLaborData() {
  const zones = getZonesData();
  const workers = getWorkersData();
  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  const totalArea = totalWall + totalCeiling;
  const bt = APP.budgetType;
  const condition = document.getElementById('surfaceCondition')?.value || 'regular';
  const cf = CONDITION_FACTORS[condition] || 1;

  let totalJornales = 0;

  if (bt === 'painting' || bt === 'both') {
    totalJornales += totalArea / 100; // Protección
    totalJornales += condition !== 'good' ? totalArea / 30 * cf : 0; // Remoción
    totalJornales += condition === 'good' ? totalArea / 50 : totalArea / 20 * cf; // Reparación
    totalJornales += totalArea / 40; // Lijado
    totalJornales += totalArea / 80; // Sellador
    totalJornales += totalArea / 25 * 2; // Enduido
    totalJornales += totalArea / 65; // Lijado fino
    const coats = parseInt(document.getElementById('paintCoats')?.value) || 2;
    totalJornales += totalArea / 50 * coats; // Pintura
    totalJornales += Math.max(0.5, zones.reduce((s, z) => s + z.doors * 0.2 + z.windows * 0.15, 0));
    totalJornales += totalArea / 80; // Limpieza
  }

  if (bt === 'plasterboard' || bt === 'both') {
    const type = document.getElementById('plasterType')?.value || 'modular';
    if (type === 'continuo') {
      const area = parseFloat(document.getElementById('plasterTotalArea')?.value) || totalCeiling;
      totalJornales += (area / 15) + (area / 20) + (area / 30) + (area / 25);
    } else {
      const customPlates = parseInt(document.getElementById('customPlateCount')?.value) || Math.ceil(totalCeiling / 0.78);
      totalJornales += customPlates / 35 + customPlates / 30 + customPlates / 35 + customPlates / 45 + customPlates / 50 + customPlates / 70;
    }
  }

  // Calculate cost: distribute jornales across workers proportionally
  const avgRate = workers.length ? workers.reduce((s, w) => s + w.rate, 0) / workers.length : 0;
  
  // Night work surcharge: 40% extra for nocturnal shifts
  const nightWork = document.getElementById('nightWork')?.checked || false;
  const nightSurcharge = nightWork ? 1.4 : 1;
  const total = totalJornales * avgRate * nightSurcharge;

  return { totalJornales, avgRate, total, workers, nightWork, nightSurcharge };
}
