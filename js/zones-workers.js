// ============================================
// ZONES MODULE
// ============================================

function addZone() {
  APP.zoneCounter++;
  const id = 'zone_' + APP.zoneCounter;
  const zoneNum = document.querySelectorAll('.zone-card').length + 1;
  const html = `
    <div class="zone-card" id="${id}">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold text-brand-400 uppercase tracking-wider">Zona ${zoneNum}</span>
        <button class="btn-remove" onclick="removeZone('${id}')" title="Eliminar zona">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="space-y-3">
        <div class="form-group">
          <label class="form-label">Nombre de la zona</label>
          <input type="text" class="form-input zone-name" placeholder="Ej: Ingreso, Living, Dormitorio" oninput="updateZoneSummary()">
        </div>
        <div class="mb-2"><span class="text-xs font-semibold text-brand-300">📐 PAREDES</span></div>
        <div class="grid grid-cols-2 gap-3 mb-1">
          <div class="form-group">
            <label class="form-label">Largo total / Perímetro (m)</label>
            <input type="number" class="form-input zone-wall-width" placeholder="0.00" min="0" step="0.01" inputmode="decimal" oninput="updateZoneSummary()">
          </div>
          <div class="form-group">
            <label class="form-label">Alto (m)</label>
            <input type="number" class="form-input zone-wall-height" placeholder="0.00" min="0" step="0.01" value="2.60" inputmode="decimal" oninput="updateZoneSummary()">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="form-group">
            <label class="form-label text-slate-400">Puertas (cant.)</label>
            <input type="number" class="form-input zone-doors" value="0" min="0" step="1" inputmode="numeric" oninput="updateZoneSummary()" title="Se descuentan de la pared">
          </div>
          <div class="form-group">
            <label class="form-label text-slate-400">Ventanas (cant.)</label>
            <input type="number" class="form-input zone-windows" value="0" min="0" step="1" inputmode="numeric" oninput="updateZoneSummary()" title="Se descuentan de la pared">
          </div>
        </div>

        <div class="mb-2"><span class="text-xs font-semibold text-blue-300">🔲 CIELORRASO</span></div>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div class="form-group">
            <label class="form-label">Largo (m)</label>
            <input type="number" class="form-input zone-ceil-width" placeholder="0.00" min="0" step="0.01" inputmode="decimal" oninput="updateZoneSummary()">
          </div>
          <div class="form-group">
            <label class="form-label">Ancho (m)</label>
            <input type="number" class="form-input zone-ceil-depth" placeholder="0.00" min="0" step="0.01" inputmode="decimal" oninput="updateZoneSummary()">
          </div>
        </div>
        <div class="p-2 rounded-lg bg-brand-500/10 text-center flex justify-around">
          <div><span class="text-xs text-slate-400">Paredes: </span><span class="text-sm font-bold text-brand-400 zone-wall-display">0.00 m²</span></div>
          <div><span class="text-xs text-slate-400">Cielorraso: </span><span class="text-sm font-bold text-blue-400 zone-ceiling-display">0.00 m²</span></div>
        </div>
      </div>
    </div>`;
  document.getElementById('zonesContainer').insertAdjacentHTML('beforeend', html);
  updateZoneSummary();
  showToast('Zona agregada', 'success');
}

function removeZone(id) {
  const cards = document.querySelectorAll('.zone-card');
  if (cards.length <= 1) { showToast('Debe haber al menos una zona', 'error'); return; }
  const el = document.getElementById(id);
  el.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => { el.remove(); renumberZones(); updateZoneSummary(); }, 300);
}

function renumberZones() {
  document.querySelectorAll('.zone-card').forEach((card, i) => {
    card.querySelector('.text-brand-400').textContent = `Zona ${i + 1}`;
  });
}

function toggleCeiling(checkbox, zoneId) {
  // Legacy function kept for interface safety if referenced elsewhere, but unused now
}

function getZonesData() {
  const zones = [];
  document.querySelectorAll('.zone-card').forEach(card => {
    const ww = parseFloat(card.querySelector('.zone-wall-width')?.value) || 0;
    const wh = parseFloat(card.querySelector('.zone-wall-height')?.value) || 0;
    const cw = parseFloat(card.querySelector('.zone-ceil-width')?.value) || 0;
    const cd = parseFloat(card.querySelector('.zone-ceil-depth')?.value) || 0;
    const doors = parseInt(card.querySelector('.zone-doors')?.value) || 0;
    const windows = parseInt(card.querySelector('.zone-windows')?.value) || 0;
    
    const wallArea = Math.max(0, (ww * wh) - (doors * 1.60) - (windows * 1.80));
    const ceilingArea = cw * cd;

    zones.push({
      name: card.querySelector('.zone-name')?.value || `Zona ${zones.length + 1}`,
      ww, wh, cw, cd, doors, windows, // Expose raw dims for PDF
      wallArea, ceilingArea,
      totalArea: wallArea + ceilingArea
    });
  });
  return zones;
}

function updateZoneSummary() {
  const zones = getZonesData();
  // Update individual zone displays
  document.querySelectorAll('.zone-card').forEach((card, i) => {
    if (zones[i]) {
      const wD = card.querySelector('.zone-wall-display');
      if(wD) wD.textContent = fmtNum(zones[i].wallArea) + ' m²';
      const cD = card.querySelector('.zone-ceiling-display');
      if(cD) cD.textContent = fmtNum(zones[i].ceilingArea) + ' m²';
    }
  });
  // Update totals
  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  document.getElementById('totalWallArea').textContent = fmtNum(totalWall) + ' m²';
  document.getElementById('totalCeilingArea').textContent = fmtNum(totalCeiling) + ' m²';
  document.getElementById('totalArea').textContent = fmtNum(totalWall + totalCeiling) + ' m²';
  const summary = document.getElementById('zoneSummary');
  if (zones.length > 0 && (totalWall > 0 || totalCeiling > 0)) {
    summary.classList.remove('hidden');
  } else {
    summary.classList.add('hidden');
  }
}

// ============================================
// WORKERS MODULE
// ============================================

function addWorker() {
  APP.workerCounter++;
  const id = 'worker_' + APP.workerCounter;
  const num = document.querySelectorAll('.worker-card').length + 1;
  const defaultRate = REF_PRICES['oficial'] || 35000;
  const html = `
    <div class="worker-card" id="${id}">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Trabajador ${num}</span>
        <button class="btn-remove" onclick="removeWorker('${id}')" title="Eliminar">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="form-group">
          <label class="form-label">Nombre</label>
          <input type="text" class="form-input worker-name" placeholder="Nombre" oninput="updateWorkerSummary()">
        </div>
        <div class="form-group">
          <label class="form-label">Rol</label>
          <select class="form-input worker-role" onchange="applyWorkerRate(this); updateWorkerSummary()">
            <option value="oficial">Oficial</option>
            <option value="medio_oficial">Medio Oficial</option>
            <option value="ayudante">Ayudante</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Jornal ($)</label>
          <input type="number" class="form-input worker-rate" placeholder="0" min="0" step="100" inputmode="numeric" value="${defaultRate}" oninput="updateWorkerSummary()">
        </div>
      </div>
    </div>`;
  document.getElementById('workersContainer').insertAdjacentHTML('beforeend', html);
  updateWorkerSummary();
  if (APP.workerCounter > 1) showToast('Trabajador agregado', 'success');
}

function applyWorkerRate(selectEl) {
  const role = selectEl.value;
  const card = selectEl.closest('.worker-card');
  const rateInput = card.querySelector('.worker-rate');
  const refRate = REF_PRICES[role] || 0;
  if (refRate > 0) rateInput.value = refRate;
}

function removeWorker(id) {
  const cards = document.querySelectorAll('.worker-card');
  if (cards.length <= 1) { showToast('Debe haber al menos un trabajador', 'error'); return; }
  const el = document.getElementById(id);
  el.style.animation = 'slideOut 0.3s ease forwards';
  setTimeout(() => { el.remove(); renumberWorkers(); updateWorkerSummary(); }, 300);
}

function renumberWorkers() {
  document.querySelectorAll('.worker-card').forEach((card, i) => {
    card.querySelector('.text-blue-400').textContent = `Trabajador ${i + 1}`;
  });
}

function getWorkersData() {
  const workers = [];
  document.querySelectorAll('.worker-card').forEach(card => {
    workers.push({
      name: card.querySelector('.worker-name')?.value || '',
      role: card.querySelector('.worker-role')?.value || 'oficial',
      rate: parseFloat(card.querySelector('.worker-rate')?.value) || 0
    });
  });
  return workers;
}

function updateWorkerSummary() {
  const workers = getWorkersData();
  document.getElementById('totalWorkers').textContent = workers.length;
  const totalRate = workers.reduce((s, w) => s + w.rate, 0);
  document.getElementById('avgDailyRate').textContent = fmt(totalRate);
  const summary = document.getElementById('workerSummary');
  summary.classList.toggle('hidden', workers.length === 0);
}
