// ============================================
// PREVIEW, PRINT & WHATSAPP MODULE
// ============================================

function renderPreview() {
  const proj = getProjectData();
  const zones = getZonesData();
  const workers = getWorkersData();
  const materials = getMaterialsData();
  const labor = getLaborData();
  const expenses = getExpensesData();
  const bt = APP.budgetType;

  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  const totalDoors = zones.reduce((s, z) => s + z.doors, 0);
  const totalWindows = zones.reduce((s, z) => s + z.windows, 0);
  const days = getEstimatedDays();

  // Calculate totals
  const materialsCost = materials.paintTotal + materials.plasterTotal;
  const laborCost = labor.total;
  let expensesCost = 0;
  expenses.forEach(e => { expensesCost += e.perDay ? e.amount * days : e.amount; });
  const contingency = parseFloat(document.getElementById('contingencyPercent').value) || 0;
  const contingencyAmt = (materialsCost + laborCost) * contingency / 100;
  const subtotal = materialsCost + laborCost + expensesCost + contingencyAmt;
  const includeIVA = document.getElementById('includeIVA').checked;
  const ivaPct = parseFloat(document.getElementById('ivaPercent').value) || 21;
  const ivaAmt = includeIVA ? subtotal * ivaPct / 100 : 0;
  const grandTotal = subtotal + ivaAmt;

  const budgetNum = 'PP-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random()*9000)+1000);
  const today = new Date().toLocaleDateString('es-AR');
  const validUntil = new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('es-AR');

  const typeLabels = { painting: 'Pintura', plasterboard: 'Placas de Cieloraso', both: 'Pintura + Placas de Cieloraso' };
  const propLabels = { casa: 'Casa', departamento: 'Departamento', oficina: 'Oficina', local: 'Local Comercial' };

  let html = `
    <div class="preview-header">
      <h1>${proj.companyName || 'PRESUPUESTO'}</h1>
      <p class="text-xs text-slate-500">${proj.companyPhone ? 'Tel: '+proj.companyPhone : ''}</p>
      <p class="text-lg font-bold mt-1">PRESUPUESTO N° ${budgetNum}</p>
      <p class="text-xs text-slate-500">Fecha: ${today} | Válido hasta: ${validUntil}</p>
    </div>

    <div class="preview-section">
      <h2>📋 DATOS DEL PROYECTO</h2>
      <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div><b>Cliente:</b> ${proj.clientName || '-'}</div>
        <div><b>Teléfono:</b> ${proj.clientPhone || '-'}</div>
        <div><b>Dirección:</b> ${proj.workAddress || '-'}</div>
        <div><b>Inmueble:</b> ${propLabels[proj.propertyType] || '-'}</div>
        <div><b>Trabajo:</b> ${typeLabels[bt]}</div>
        <div><b>Ubicación:</b> ${proj.workLocation || '-'}</div>
      </div>
    </div>

    <div class="preview-section">
      <h2>📐 RELEVAMIENTO DE SUPERFICIES</h2>
      <table class="preview-table">
        <thead><tr><th>Zona</th><th class="text-center">Pared (LxA)</th><th class="text-center">Techo (LxH)</th><th class="text-center">Puert.</th><th class="text-center">Vent.</th><th class="text-right">m² Pared</th><th class="text-right">m² Techo</th></tr></thead>
        <tbody>
          ${zones.map(z => `<tr>
            <td>${z.name}</td>
            <td class="text-center">${z.ww > 0 ? fmtNum(z.ww)+'x'+fmtNum(z.wh) : '-'}</td>
            <td class="text-center">${z.cw > 0 ? fmtNum(z.cw)+'x'+fmtNum(z.cd) : '-'}</td>
            <td class="text-center">${z.doors}</td><td class="text-center">${z.windows}</td>
            <td class="text-right">${fmtNum(z.wallArea)}</td><td class="text-right">${z.ceilingArea > 0 ? fmtNum(z.ceilingArea) : '-'}</td>
          </tr>`).join('')}
          <tr class="total-row"><td colspan="5">TOTAL</td><td class="text-right">${fmtNum(totalWall)} m²</td><td class="text-right">${fmtNum(totalCeiling)} m²</td></tr>
        </tbody>
      </table>
    </div>`;

  // Materials section
  const matSections = [];
  if ((bt === 'painting' || bt === 'both') && materials.paint.length) {
    matSections.push({ title: '🎨 Materiales de Pintura', items: materials.paint, total: materials.paintTotal });
  }
  if ((bt === 'plasterboard' || bt === 'both') && materials.plaster.length) {
    matSections.push({ title: '🔲 Materiales de Placas', items: materials.plaster, total: materials.plasterTotal });
  }

  matSections.forEach(sec => {
    html += `<div class="preview-section">
      <h2>${sec.title}</h2>
      <table class="preview-table">
        <thead><tr><th>Material</th><th class="text-center">Cant.</th><th class="text-center">Unidad</th><th class="text-right">P. Unit.</th><th class="text-right">Subtotal</th></tr></thead>
        <tbody>
          ${sec.items.map(m => `<tr><td>${m.name}</td><td class="text-center">${m.qty}</td><td class="text-center">${m.unit}</td><td class="text-right">${m.price > 0 ? fmt(m.price) : '-'}</td><td class="text-right">${m.subtotal > 0 ? fmt(m.subtotal) : '-'}</td></tr>`).join('')}
          <tr class="total-row"><td colspan="4" class="text-right">Subtotal:</td><td class="text-right">${fmt(sec.total)}</td></tr>
        </tbody>
      </table>
    </div>`;
  });

  // Labor
  html += `<div class="preview-section">
    <h2>👷 MANO DE OBRA</h2>
    <table class="preview-table">
      <thead><tr><th>Trabajador</th><th class="text-center">Rol</th><th class="text-right">Jornal</th></tr></thead>
      <tbody>
        ${workers.map(w => `<tr><td>${w.name || '-'}</td><td class="text-center">${w.role}</td><td class="text-right">${fmt(w.rate)}</td></tr>`).join('')}
      </tbody>
    </table>
    <p class="text-xs mt-2"><b>Total jornales estimados:</b> ${fmtNum(labor.totalJornales, 1)} | <b>Costo MO:</b> ${fmt(laborCost)}</p>
  </div>`;

  // Expenses
  if (expenses.length) {
    html += `<div class="preview-section">
      <h2>💸 GASTOS ADICIONALES</h2>
      <table class="preview-table">
        <thead><tr><th>Concepto</th><th class="text-right">Monto</th><th class="text-center">Tipo</th></tr></thead>
        <tbody>
          ${expenses.map(e => `<tr><td>${e.name}</td><td class="text-right">${fmt(e.amount)}</td><td class="text-center">${e.perDay ? '×día ('+days+'d)' : 'Fijo'}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="text-xs mt-1"><b>Total gastos:</b> ${fmt(expensesCost)}</p>
    </div>`;
  }

  // Modifiers
  const season = document.getElementById('season')?.value || 'summer';
  const seasonMap = { summer: '☀️ Verano', autumn: '🍂 Otoño', winter: '❄️ Invierno', spring: '🌸 Primavera' };
  const seasonStr = seasonMap[season];
  const nightWork = document.getElementById('nightWork')?.checked || false;

  // Timeline
  html += `<div class="preview-section">
    <h2>📅 PLAZO ESTIMADO</h2>
    <p class="text-sm pb-1"><b>Días calendario estimados:</b> ${days} días (incluye secado técnico)</p>
    <p class="text-xs text-slate-500">▶ <b>Época programada:</b> ${seasonStr} (Margen de lluvia y humedad aplicado al presupuesto)</p>
    ${nightWork ? `<p class="text-xs text-brand-500 mt-1">▶ <b>Modalidad:</b> Trabajo Nocturno (Jornada más costosa, acorta tiempos calendario)</p>` : ''}
  </div>`;

  // Grand Total
  html += `<div class="preview-section" style="border:2px solid #1e293b; padding:12px; border-radius:8px; background:#f8fafc;">
    <table class="preview-table" style="border:none;">
      <tbody style="border:none;">
        <tr style="border:none;"><td style="border:none;">Materiales</td><td class="text-right" style="border:none;">${fmt(materialsCost)}</td></tr>
        <tr style="border:none;"><td style="border:none;">Mano de obra</td><td class="text-right" style="border:none;">${fmt(laborCost)}</td></tr>
        <tr style="border:none;"><td style="border:none;">Gastos adicionales</td><td class="text-right" style="border:none;">${fmt(expensesCost)}</td></tr>
        ${contingency > 0 ? `<tr style="border:none;"><td style="border:none;">Imprevistos (${contingency}%)</td><td class="text-right" style="border:none;">${fmt(contingencyAmt)}</td></tr>` : ''}
        ${includeIVA ? `<tr style="border:none;"><td style="border:none;">IVA (${ivaPct}%)</td><td class="text-right" style="border:none;">${fmt(ivaAmt)}</td></tr>` : ''}
        <tr style="border:none; font-size:1.2rem;"><td style="border:none;"><b>TOTAL</b></td><td class="text-right" style="border:none;"><b>${fmt(grandTotal)}</b></td></tr>
      </tbody>
    </table>
  </div>`;

  // Conditions
  html += `<div class="preview-section" style="margin-top:16px;">
    <h2>📜 CONDICIONES</h2>
    <ul class="text-xs space-y-1 list-disc pl-4 text-slate-600">
      <li><b>Forma de pago:</b> 50% al inicio, 50% al finalizar</li>
      <li><b>Validez:</b> 15 días corridos desde la fecha</li>
      <li><b>Plazo de ejecución:</b> ${days} días hábiles estimados</li>
      <li><b>Garantía:</b> 6 meses por defectos de aplicación</li>
      <li>No incluye: trabajos de albañilería, instalaciones eléctricas ni plomería</li>
      <li>Los precios pueden variar si al iniciar la obra se detectan condiciones no previstas</li>
    </ul>
  </div>`;

  document.getElementById('previewContainer').innerHTML = html;
  // Also prepare print layout
  document.getElementById('printLayout').innerHTML = html;
}

// ============================================
// PRINT
// ============================================
function printBudget() {
  renderPreview();
  setTimeout(() => window.print(), 300);
}

// ============================================
// WHATSAPP
// ============================================
function shareWhatsApp() {
  const proj = getProjectData();
  const zones = getZonesData();
  const materials = getMaterialsData();
  const labor = getLaborData();
  const expenses = getExpensesData();
  const days = getEstimatedDays();
  const bt = APP.budgetType;
  const typeLabels = { painting: 'Pintura', plasterboard: 'Placas Cieloraso', both: 'Pintura + Placas' };
  const propLabels = { casa: 'Casa', departamento: 'Departamento', oficina: 'Oficina', local: 'Local Comercial' };

  const totalWall = zones.reduce((s, z) => s + z.wallArea, 0);
  const totalCeiling = zones.reduce((s, z) => s + z.ceilingArea, 0);
  const materialsCost = materials.paintTotal + materials.plasterTotal;
  const laborCost = labor.total;
  let expensesCost = 0;
  expenses.forEach(e => { expensesCost += e.perDay ? e.amount * days : e.amount; });
  const contingency = parseFloat(document.getElementById('contingencyPercent').value) || 0;
  const contingencyAmt = (materialsCost + laborCost) * contingency / 100;
  const subtotal = materialsCost + laborCost + expensesCost + contingencyAmt;
  const includeIVA = document.getElementById('includeIVA').checked;
  const ivaPct = parseFloat(document.getElementById('ivaPercent').value) || 21;
  const ivaAmt = includeIVA ? subtotal * ivaPct / 100 : 0;
  const grandTotal = subtotal + ivaAmt;
  const today = new Date().toLocaleDateString('es-AR');
  const validUntil = new Date(Date.now() + 15*24*60*60*1000).toLocaleDateString('es-AR');

  // Helper for clean currency without symbol duplication
  const fc = (n) => new Intl.NumberFormat('es-AR').format(Math.round(n));

  const L = []; // lines array for cleaner building

  // ── HEADER ──
  L.push(`┌─────────────────────┐`);
  L.push(`│  📋 *PRESUPUESTO*           │`);
  L.push(`│  _${typeLabels[bt]}_                      │`);
  L.push(`└─────────────────────┘`);
  L.push(``);

  // ── DATOS ──
  if (proj.companyName) {
    L.push(`🏢 *${proj.companyName}*`);
    if (proj.companyPhone) L.push(`📞 ${proj.companyPhone}`);
    L.push(``);
  }
  L.push(`📅 *Fecha:* ${today}`);
  L.push(`📆 *Válido hasta:* ${validUntil}`);
  L.push(``);
  L.push(`▸ *Cliente:* ${proj.clientName || '-'}`);
  L.push(`▸ *Teléfono:* ${proj.clientPhone || '-'}`);
  L.push(`▸ *Dirección:* ${proj.workAddress || '-'}`);
  L.push(`▸ *Inmueble:* ${propLabels[proj.propertyType] || '-'}`);
  L.push(``);

  // ── SUPERFICIES ──
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(`📐 *SUPERFICIES*`);
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(``);
  zones.forEach(z => {
    L.push(`▪️ *${z.name}*`);
    if (z.wallArea > 0) L.push(`   🧱 Paredes: ${z.ww > 0 ? fmtNum(z.ww)+'×'+fmtNum(z.wh)+'m = ' : ''}*${fmtNum(z.wallArea)} m²*`);
    if (z.doors > 0) L.push(`   🚪 ${z.doors} puerta${z.doors > 1 ? 's' : ''}`);
    if (z.windows > 0) L.push(`   🪟 ${z.windows} ventana${z.windows > 1 ? 's' : ''}`);
    if (z.ceilingArea > 0) L.push(`   ⬜ Techo: ${z.cw > 0 ? fmtNum(z.cw)+'×'+fmtNum(z.cd)+'m = ' : ''}*${fmtNum(z.ceilingArea)} m²*`);
    L.push(``);
  });
  L.push(`   📊 *Total paredes:* ${fmtNum(totalWall)} m²`);
  if (totalCeiling > 0) L.push(`   📊 *Total techos:* ${fmtNum(totalCeiling)} m²`);
  L.push(``);

  // ── MATERIALES ──
  const allMats = [...materials.paint, ...materials.plaster].filter(m => m.subtotal > 0);
  if (allMats.length > 0) {
    L.push(`━━━━━━━━━━━━━━━━━━━━`);
    L.push(`🛒 *MATERIALES*`);
    L.push(`━━━━━━━━━━━━━━━━━━━━`);
    L.push(``);

    // Separate paint and plaster materials
    const paintMats = materials.paint.filter(m => m.subtotal > 0);
    const plasterMats = materials.plaster.filter(m => m.subtotal > 0);

    if (paintMats.length > 0 && bt !== 'plasterboard') {
      if (bt === 'both') L.push(`🎨 _Pintura:_`);
      paintMats.forEach(m => {
        L.push(`  ▸ ${m.name}`);
        L.push(`     ${m.qty} ${m.unit} × $${fc(m.price)} = *$${fc(m.subtotal)}*`);
      });
      L.push(``);
    }

    if (plasterMats.length > 0 && bt !== 'painting') {
      if (bt === 'both') L.push(`🔲 _Placas:_`);
      plasterMats.forEach(m => {
        L.push(`  ▸ ${m.name}`);
        L.push(`     ${m.qty} ${m.unit} × $${fc(m.price)} = *$${fc(m.subtotal)}*`);
      });
      L.push(``);
    }

    L.push(`  💲 *Subtotal materiales: $${fc(materialsCost)}*`);
    L.push(``);
  }

  // ── MANO DE OBRA ──
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(`👷 *MANO DE OBRA*`);
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(``);
  const workers = labor.workers || [];
  workers.forEach(w => {
    const roleName = { oficial: 'Oficial', medio_oficial: 'Medio Oficial', ayudante: 'Ayudante' }[w.role] || w.role;
    L.push(`  ▸ ${w.name || 'Trabajador'} (${roleName})`);
    L.push(`     Jornal: *$${fc(w.rate)}*`);
  });
  L.push(``);
  L.push(`  ⏱️ Jornales estimados: *${fmtNum(labor.totalJornales, 1)}*`);
  L.push(`  💲 *Subtotal MO: $${fc(laborCost)}*`);
  L.push(``);

  // ── GASTOS ADICIONALES ──
  const expWithValues = expenses.filter(e => e.amount > 0);
  if (expWithValues.length > 0 || contingency > 0) {
    L.push(`━━━━━━━━━━━━━━━━━━━━`);
    L.push(`💸 *GASTOS ADICIONALES*`);
    L.push(`━━━━━━━━━━━━━━━━━━━━`);
    L.push(``);
    expWithValues.forEach(e => {
      const total = e.perDay ? e.amount * days : e.amount;
      const detail = e.perDay ? `$${fc(e.amount)} × ${days} días` : `fijo`;
      L.push(`  ▸ ${e.name} (${detail}): *$${fc(total)}*`);
    });
    if (contingency > 0) {
      L.push(`  ▸ Imprevistos (${contingency}%): *$${fc(contingencyAmt)}*`);
    }
    if (includeIVA) {
      L.push(`  ▸ IVA (${ivaPct}%): *$${fc(ivaAmt)}*`);
    }
    L.push(``);
    L.push(`  💲 *Subtotal gastos: $${fc(expensesCost + contingencyAmt + ivaAmt)}*`);
    L.push(``);
  }

  // ── PLAZO ──
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(`🗓️ *PLAZO ESTIMADO*`);
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  
  const season = document.getElementById('season')?.value || 'summer';
  const seasonMap = { summer: '☀️ Verano', autumn: '🍂 Otoño', winter: '❄️ Invierno', spring: '🌸 Primavera' };
  const nightWork = document.getElementById('nightWork')?.checked || false;

  L.push(`▸ *Días calendario totales:* ${days} días`);
  L.push(`▸ *Época programada:* ${seasonMap[season]}`);
  if (nightWork) L.push(`▸ *Modalidad:* Trabajo Nocturno`);
  L.push(`   *(Sujeto a demoras climáticas)*`);
  L.push(``);

  // ── TOTAL ──
  L.push(`╔═══════════════════╗`);
  L.push(`║                                          ║`);
  L.push(`║  💰 *TOTAL: $${fc(grandTotal)}*`);
  L.push(`║                                          ║`);
  L.push(`╚═══════════════════╝`);
  L.push(``);

  // ── DESGLOSE RÁPIDO ──
  L.push(`  _Desglose:_`);
  L.push(`  ▸ Materiales: $${fc(materialsCost)}`);
  L.push(`  ▸ Mano de obra: $${fc(laborCost)}`);
  if (expensesCost > 0) L.push(`  ▸ Gastos: $${fc(expensesCost)}`);
  if (contingency > 0) L.push(`  ▸ Imprevistos: $${fc(contingencyAmt)}`);
  if (includeIVA) L.push(`  ▸ IVA: $${fc(ivaAmt)}`);
  L.push(``);

  // ── CONDICIONES ──
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(`📜 *CONDICIONES*`);
  L.push(`━━━━━━━━━━━━━━━━━━━━`);
  L.push(``);
  L.push(`  ✅ Válido por 15 días`);
  L.push(`  💳 Pago: 50% inicio, 50% final`);
  L.push(`  🛡️ Garantía: 6 meses`);
  L.push(`  📅 Plazo: ~${days} días hábiles`);
  L.push(``);
  L.push(`  ⚠️ _No incluye: albañilería,_`);
  L.push(`  _inst. eléctricas ni plomería_`);
  L.push(``);

  // ── FOOTER ──
  if (proj.companyName || proj.companyPhone) {
    L.push(`─ ─ ─ ─ ─ ─ ─ ─ ─ ─`);
    if (proj.companyName) L.push(`🏢 *${proj.companyName}*`);
    if (proj.companyPhone) L.push(`📞 ${proj.companyPhone}`);
  }

  let text = L.join('\n');

  // Truncate if needed (WhatsApp limit)
  if (text.length > 4000) {
    // Build a shorter version with just summary
    const short = [];
    short.push(`┌─────────────────────┐`);
    short.push(`│  📋 *PRESUPUESTO*           │`);
    short.push(`│  _${typeLabels[bt]}_                      │`);
    short.push(`└─────────────────────┘`);
    short.push(``);
    short.push(`📅 ${today} | 👤 ${proj.clientName || '-'}`);
    short.push(`📍 ${proj.workAddress || '-'}`);
    short.push(``);
    short.push(`📐 *Superficie total:* ${fmtNum(totalWall + totalCeiling)} m²`);
    short.push(``);
    short.push(`╔═══════════════════╗`);
    short.push(`║  💰 *TOTAL: $${fc(grandTotal)}*`);
    short.push(`╚═══════════════════╝`);
    short.push(``);
    short.push(`  ▸ Materiales: $${fc(materialsCost)}`);
    short.push(`  ▸ Mano de obra: $${fc(laborCost)}`);
    if (expensesCost > 0) short.push(`  ▸ Gastos: $${fc(expensesCost)}`);
    short.push(``);
    short.push(`📅 Plazo: ~${days} días`);
    short.push(`✅ Válido 15 días | 💳 50%+50%`);
    short.push(``);
    short.push(`_Solicitar presupuesto detallado impreso_`);
    text = short.join('\n');
  }

  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}
