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
  let customPlates = parseInt(document.getElementById('customPlateCount').value) || 0;
  if (customPlates === 0 && ceilingArea > 0) {
    customPlates = Math.ceil(ceilingArea / 0.78);
    document.getElementById('customPlateCount').value = customPlates;
  }
  const margin = (parseInt(document.getElementById('breakageMargin').value) || 10) / 100;
  const totalPlates = Math.ceil(customPlates * (1 + margin));
  const stdPlates = Math.ceil(totalPlates / 3);
  const surfaceM2 = totalPlates * 0.78;

  const materials = [
    { name: 'Placa yeso 9.5mm (1200×2400)', qty: stdPlates, unit: 'unidades', price: 0 },
    { name: 'Masilla tapa juntas', qty: Math.ceil(surfaceM2 / 2.5 * 1.1), unit: 'kg', price: 0 },
    { name: 'Lija grano 150', qty: Math.ceil(totalPlates / 10), unit: 'hojas', price: 0 },
    { name: 'Lija grano 220', qty: Math.ceil(totalPlates / 12), unit: 'hojas', price: 0 },
    { name: 'Sellador fijador', qty: Math.ceil(surfaceM2 / 10), unit: 'litros', price: 0 },
    { name: 'Pintura látex blanco (2 manos)', qty: Math.ceil(surfaceM2 * 2 / 11), unit: 'litros', price: 0 },
    { name: 'Hojas trincheta', qty: Math.ceil(totalPlates / 15), unit: 'unidades', price: 0 },
    { name: 'Barbijos/máscaras', qty: Math.max(1, Math.ceil(totalPlates / 30)), unit: 'unidades', price: 0 },
    { name: 'Rodillo pelo corto 22cm', qty: 1, unit: 'unidad', price: 0 },
    { name: 'Bandeja rodillo', qty: 1, unit: 'unidad', price: 0 },
  ];

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
