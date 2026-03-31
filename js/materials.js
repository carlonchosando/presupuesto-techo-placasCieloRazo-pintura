// ============================================
// MATERIALS CALCULATION MODULE
// ============================================

const PAINT_YIELDS = {
  economic: { yield: 9, coats: 2 },
  medium: { yield: 11, coats: 2 },
  premium: { yield: 13, coats: 2 }
};

const CONDITION_FACTORS = { good: 0.8, regular: 1.0, bad: 1.4 };

function calculateMaterials() {
  const zones = getZonesData();
  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  const totalArea = totalWall + totalCeiling;
  const bt = APP.budgetType;

  if (bt === 'painting' || bt === 'both') calcPaintMaterials(totalArea, totalWall, totalCeiling, zones);
  if (bt === 'plasterboard' || bt === 'both') calcPlasterMaterials(totalCeiling, zones);

  toggleBudgetSections();

  // Apply reference prices and recalculate
  setTimeout(() => {
    applyDefaultPrices('paintMaterialsBody');
    applyDefaultPrices('plasterMaterialsBody');
    updateMaterialsTotal('paintMaterialsBody', 'paintMaterialsTotal');
    updateMaterialsTotal('plasterMaterialsBody', 'plasterMaterialsTotal');
  }, 50);
}

function calcPaintMaterials(totalArea, wallArea, ceilingArea, zones) {
  const quality = document.getElementById('paintQuality').value;
  const coats = parseInt(document.getElementById('paintCoats').value) || 2;
  const condition = document.getElementById('surfaceCondition').value;
  const cf = CONDITION_FACTORS[condition];
  const py = PAINT_YIELDS[quality];
  const waste = condition === 'bad' ? 1.15 : 1.10;

  const totalDoors = zones.reduce((s, z) => s + z.doors, 0);
  const totalWindows = zones.reduce((s, z) => s + z.windows, 0);
  const perimAberturas = (totalDoors * 5.6) + (totalWindows * 5.4);

  const materials = [
    { name: 'Sellador fijador', qty: Math.ceil((totalArea / 10) * waste), unit: 'litros', price: 0 },
    { name: 'Enduido plástico', qty: Math.ceil((totalArea / 2) * cf * waste), unit: 'kg', price: 0 },
    { name: `Pintura látex (${coats} manos)`, qty: Math.ceil((totalArea * coats / py.yield) * waste), unit: 'litros', price: 0 },
    { name: 'Lija grano 80', qty: Math.ceil(totalArea * cf / 4), unit: 'hojas', price: 0 },
    { name: 'Lija grano 150', qty: Math.ceil(totalArea / 6.5), unit: 'hojas', price: 0 },
    { name: 'Lija grano 220', qty: Math.ceil(totalArea / 8), unit: 'hojas', price: 0 },
    { name: 'Cinta enmascarar', qty: Math.max(1, Math.ceil(perimAberturas / 25)), unit: 'rollos', price: 0 },
    { name: 'Nylon protector', qty: Math.max(1, Math.ceil(ceilingArea / 100)), unit: 'rollos', price: 0 },
    { name: 'Espátula 250mm', qty: 1, unit: 'unidad', price: 0 },
    { name: 'Rodillo lana 22cm', qty: 1, unit: 'unidad', price: 0 },
    { name: 'Bandeja rodillo', qty: 1, unit: 'unidad', price: 0 },
    { name: 'Pincel 2"', qty: 1, unit: 'unidad', price: 0 },
  ];

  if (totalDoors > 0 || totalWindows > 0) {
    const esmalteLt = Math.ceil(((totalDoors * 3.2) + (totalWindows * 2.4)) / 11 * waste);
    materials.push({ name: 'Esmalte sintético (aberturas)', qty: Math.max(1, esmalteLt), unit: 'litros', price: 0 });
  }

  renderMaterialsTable('paintMaterialsBody', materials, 'paintMaterialsTotal', 'paint');
}

function calcPlasterMaterials(ceilingArea, zones) {
  // Use manual area if entered, otherwise initialize with zones ceiling area
  const areaInput = document.getElementById('plasterTotalArea');
  if (!areaInput.value || parseFloat(areaInput.value) === 0) {
    areaInput.value = ceilingArea.toFixed(2);
  }
  const effectiveArea = parseFloat(areaInput.value) || 0;

  const type = document.getElementById('plasterType').value;
  const margin = (parseInt(document.getElementById('breakageMargin').value) || 10) / 100;
  const areaWithMargin = effectiveArea * (1 + margin);
  
  let stdPlates = 0;
  let surfaceM2 = 0;
  let customPlatesWithMargin = 0;

  if (type === 'continuo') {
    stdPlates = Math.ceil(areaWithMargin / 2.88); // 1.20x2.40m = 2.88m2
    surfaceM2 = stdPlates * 2.88;
  } else {
    // Modular
    const w = parseFloat(document.getElementById('plateWidth').value) || 120;
    const h = parseFloat(document.getElementById('plateHeight').value) || 65;
    const plateAreaM2 = (w / 100) * (h / 100);
    
    let baseCustomPlates = parseInt(document.getElementById('customPlateCount').value) || 0;
    if (baseCustomPlates === 0 && plateAreaM2 > 0) {
      baseCustomPlates = Math.ceil(effectiveArea / plateAreaM2);
      document.getElementById('customPlateCount').value = baseCustomPlates;
    }
    
    customPlatesWithMargin = Math.ceil(baseCustomPlates * (1 + margin));
    
    // Fit calculation inside 120x240 standard plate
    const fit1 = Math.floor(120 / w) * Math.floor(240 / h);
    const fit2 = Math.floor(120 / h) * Math.floor(240 / w);
    const platesPerSheet = Math.max(fit1, fit2, 1);
    
    stdPlates = Math.ceil(customPlatesWithMargin / platesPerSheet);
    surfaceM2 = customPlatesWithMargin * plateAreaM2;
  }

  const cutsApprox = type === 'continuo' ? stdPlates : customPlatesWithMargin;

  let materials = [
    { name: 'Placa yeso 9.5mm (1.20×2.40m)', qty: stdPlates, unit: 'unidades', price: 0 }
  ];

  if (type === 'continuo') {
    // Calculos según manuales técnicos (normas Durlock/Knauf / ISO) por m²
    // Separación montantes cada 40cm para cielorraso estándar
    materials = materials.concat([
      { name: 'Masilla tapa juntas (Nóminal: 0.9kg/m²)', qty: Math.ceil(surfaceM2 * 0.9), unit: 'kg', price: 0 },
      { name: 'Soleras 35mm (2.60m) - 0.38 un/m²', qty: Math.ceil(surfaceM2 * 0.38), unit: 'tiras', price: 0 },
      { name: 'Montantes 34mm (2.60m) - 1.20 un/m²', qty: Math.ceil(surfaceM2 * 1.20), unit: 'tiras', price: 0 },
      { name: 'Tornillos T1 (Estructura) - 18 un/m²', qty: Math.ceil(surfaceM2 * 18), unit: 'unidades', price: 0 },
      { name: 'Tornillos T2 (Placas) - 20 un/m²', qty: Math.ceil(surfaceM2 * 20), unit: 'unidades', price: 0 },
      { name: 'Cinta papel/tramada (Rollo 90m) - 1.65m/m²', qty: Math.ceil((surfaceM2 * 1.65) / 90), unit: 'rollos', price: 0 },
      { name: 'Fijaciones y Tarugo Nº8 - 6 un/m²', qty: Math.ceil(surfaceM2 * 6), unit: 'unidades', price: 0 },
      { name: 'Alambre galv. Nº14 (Tensores) - 0.15kg/m²', qty: Math.ceil(surfaceM2 * 0.15), unit: 'kg', price: 0 },
    ]);
  } else {
    // Para placas modulares mantengo estimaciones de masilla simplificadas
    materials = materials.concat([
      { name: 'Masilla tapa juntas', qty: Math.ceil(surfaceM2 * 0.44), unit: 'kg', price: 0 }
    ]);
  }

  materials = materials.concat([
    { name: 'Lija grano 150', qty: Math.ceil(cutsApprox / (type === 'continuo' ? 4 : 10)), unit: 'hojas', price: 0 },
    { name: 'Lija grano 220', qty: Math.ceil(cutsApprox / (type === 'continuo' ? 5 : 12)), unit: 'hojas', price: 0 },
    { name: 'Sellador fijador', qty: Math.ceil(surfaceM2 / 10), unit: 'litros', price: 0 },
    { name: 'Pintura látex blanco (2 manos)', qty: Math.ceil(surfaceM2 * 2 / 11), unit: 'litros', price: 0 },
    { name: 'Hojas trincheta', qty: Math.ceil(cutsApprox / (type === 'continuo' ? 5 : 15)), unit: 'unidades', price: 0 },
    { name: 'Barbijos/máscaras', qty: Math.max(1, Math.ceil(cutsApprox / 30)), unit: 'unidades', price: 0 },
    { name: 'Rodillo pelo corto 22cm', qty: 1, unit: 'unidad', price: 0 },
    { name: 'Bandeja rodillo', qty: 1, unit: 'unidad', price: 0 }
  ]);

  renderMaterialsTable('plasterMaterialsBody', materials, 'plasterMaterialsTotal', 'plaster');
}

function renderMaterialsTable(bodyId, materials, totalId, prefix) {
  const body = document.getElementById(bodyId);
  // Preserve existing prices and toggle states
  const existingPrices = {};
  const existingToggles = {};
  body.querySelectorAll('tr').forEach(row => {
    const nameCell = row.querySelector('td:nth-child(2)');
    const priceInput = row.querySelector('.material-price-input');
    const toggle = row.querySelector('.material-toggle');
    if (nameCell && priceInput) existingPrices[nameCell.textContent.trim()] = priceInput.value;
    if (nameCell && toggle) existingToggles[nameCell.textContent.trim()] = toggle.checked;
  });

  // Short unit labels for mobile
  const shortUnit = { litros: 'lt', kg: 'kg', hojas: 'hj', rollos: 'rl', unidad: 'un', unidades: 'un' };

  body.innerHTML = materials.map((m, i) => {
    const savedPrice = existingPrices[m.name] || m.price || '';
    const isChecked = existingToggles[m.name] !== undefined ? existingToggles[m.name] : true;
    const sub = (savedPrice && isChecked) ? (parseFloat(savedPrice) * m.qty) : 0;
    const u = shortUnit[m.unit] || m.unit;
    const dimClass = isChecked ? '' : 'opacity-30';
    return `<tr class="border-b border-white/5 hover:bg-white/5 ${dimClass}" data-material-row>
      <td class="py-2 px-1 text-center" style="width:30px">
        <input type="checkbox" class="material-toggle" ${isChecked ? 'checked' : ''} onchange="toggleMaterialRow(this, '${bodyId}', '${totalId}')">
      </td>
      <td class="py-2 pr-1 text-slate-300 text-sm">${m.name}</td>
      <td class="py-2 px-1 text-center font-semibold text-sm" data-qty="${m.qty}">${m.qty} <span class="text-slate-500 text-xs">${u}</span></td>
      <td class="py-2 px-1" style="width:85px"><input type="number" class="material-price-input" data-prefix="${prefix}" data-idx="${i}" value="${savedPrice}" placeholder="$0" min="0" step="1" inputmode="numeric" ${isChecked ? '' : 'disabled'} oninput="updateMaterialsTotal('${bodyId}','${totalId}')"></td>
      <td class="py-2 pl-1 text-right font-semibold material-subtotal text-sm" style="min-width:75px">${sub > 0 ? fmt(sub) : '-'}</td>
    </tr>`;
  }).join('');
  updateMaterialsTotal(bodyId, totalId);
}

function toggleMaterialRow(checkbox, bodyId, totalId) {
  const row = checkbox.closest('tr');
  const priceInput = row.querySelector('.material-price-input');
  if (checkbox.checked) {
    row.classList.remove('opacity-30');
    priceInput.disabled = false;
  } else {
    row.classList.add('opacity-30');
    priceInput.disabled = true;
  }
  updateMaterialsTotal(bodyId, totalId);
}

function updateMaterialsTotal(bodyId, totalId) {
  const body = document.getElementById(bodyId);
  let total = 0;
  body.querySelectorAll('tr').forEach(row => {
    const toggle = row.querySelector('.material-toggle');
    const isActive = toggle ? toggle.checked : true;
    const qtyCell = row.querySelector('[data-qty]');
    const qty = parseFloat(qtyCell?.dataset.qty) || 0;
    const price = parseFloat(row.querySelector('.material-price-input')?.value) || 0;
    const sub = isActive ? qty * price : 0;
    row.querySelector('.material-subtotal').textContent = sub > 0 ? fmt(sub) : '-';
    total += sub;
  });
  document.getElementById(totalId).textContent = fmt(total);
}

function getMaterialsData() {
  const result = { paint: [], plaster: [], paintTotal: 0, plasterTotal: 0 };
  ['paintMaterialsBody', 'plasterMaterialsBody'].forEach(bodyId => {
    const isPaint = bodyId.includes('paint');
    const body = document.getElementById(bodyId);
    let total = 0;
    body.querySelectorAll('tr').forEach(row => {
      const toggle = row.querySelector('.material-toggle');
      const isActive = toggle ? toggle.checked : true;
      if (!isActive) return; // Skip excluded materials
      const name = row.querySelector('td:nth-child(2)')?.textContent || '';
      const qtyCell = row.querySelector('[data-qty]');
      const qty = parseFloat(qtyCell?.dataset.qty) || 0;
      const unit = qtyCell?.textContent?.replace(/[0-9.\s]/g, '').trim() || '';
      const price = parseFloat(row.querySelector('.material-price-input')?.value) || 0;
      const sub = qty * price;
      total += sub;
      (isPaint ? result.paint : result.plaster).push({ name, qty, unit, price, subtotal: sub });
    });
    if (isPaint) result.paintTotal = total; else result.plasterTotal = total;
  });
  return result;
}
