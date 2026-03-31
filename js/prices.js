// ============================================
// REFERENCE PRICES (Argentina Q1 2026)
// Precios orientativos - el usuario puede editarlos
// Fuente: relevamiento mercado argentino Mar 2026
// ============================================

const REF_PRICES = {
  // --- PINTURA ---
  'Sellador fijador': 7500,         // por litro (concentrado)
  'Enduido plástico': 6000,         // por kg
  'Pintura látex (2 manos)': 5500,  // por litro (calidad media)
  'Pintura látex (3 manos)': 5500,
  'Lija grano 80': 800,             // por hoja
  'Lija grano 150': 800,
  'Lija grano 220': 900,
  'Cinta enmascarar': 2500,         // por rollo 50m
  'Nylon protector': 5000,          // por rollo
  'Espátula 250mm': 8500,           // unidad
  'Rodillo lana 22cm': 7000,        // unidad
  'Bandeja rodillo': 4500,          // unidad
  'Pincel 2"': 4000,                // unidad
  'Esmalte sintético (aberturas)': 8000, // por litro

  // --- PLACAS ---
  'Placa yeso 9.5mm (1200×2400)': 12000,  // por unidad
  'Masilla tapa juntas': 3500,             // por kg
  'Sellador fijador ': 7500,              // (plasterboard version, space to differentiate)
  'Pintura látex blanco (2 manos)': 5500,
  'Hojas trincheta': 500,                  // por unidad
  'Barbijos/máscaras': 600,                // por unidad
  'Rodillo pelo corto 22cm': 6500,
  'Bandeja rodillo ': 4500,               // space to differentiate

  // --- MANO DE OBRA (jornal referencia) ---
  'oficial': 35000,
  'medio_oficial': 28000,
  'ayudante': 22000,
};

// Apply default prices to materials when they render
function applyDefaultPrices(bodyId) {
  const body = document.getElementById(bodyId);
  if (!body) return;
  body.querySelectorAll('tr').forEach(row => {
    const nameCell = row.querySelector('td:first-child');
    const priceInput = row.querySelector('.material-price-input');
    if (!nameCell || !priceInput) return;
    if (priceInput.value && parseFloat(priceInput.value) > 0) return; // Don't overwrite user input
    const name = nameCell.textContent.trim();
    // Try exact match first, then partial match
    let price = REF_PRICES[name];
    if (!price) {
      for (const [key, val] of Object.entries(REF_PRICES)) {
        if (name.includes(key.trim()) || key.trim().includes(name)) { price = val; break; }
      }
    }
    if (price) {
      priceInput.value = price;
    }
  });
}
