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

  // --- PLACAS Y ESTRUCTURA (Durlock) ---
  'Placa yeso 9.5mm': 11000,              // por unidad (1.20x2.40m)
  'Masilla tapa juntas': 2500,            // por kg
  'Soleras 35mm': 3500,                   // por tira de 2.60m
  'Montantes 34mm': 4000,                 // por tira de 2.60m
  'Tornillos T1': 30,                     // por unidad (caja 100 = 3000)
  'Tornillos T2': 35,                     // por unidad (caja 100 = 3500)
  'Cinta papel/tramada': 5000,            // por rollo de 90m
  'Fijaciones (Tarugo+Tornillo+Arandela)': 180, // por conjunto sumando arandela
  'Alambre galv. Nº14': 3000,             // por kg
  'Hojas trincheta': 500,                 // por unidad
  'Barbijos/máscaras': 600,               // por unidad
  'Rodillo pelo corto 22cm': 6500,

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
    // Checkbox is nth-child(1), so name is nth-child(2)
    const nameCell = row.querySelector('td:nth-child(2)');
    const priceInput = row.querySelector('.material-price-input');
    if (!nameCell || !priceInput) return;
    
    // Don't overwrite existing user inputs
    if (priceInput.value && parseFloat(priceInput.value) > 0) return; 
    
    const name = nameCell.textContent.trim().toLowerCase();
    if (!name) return; // Prevent empty string matching everything

    let price = 0;
    
    // Try substring matching for reference keywords
    for (const [key, val] of Object.entries(REF_PRICES)) {
      if (name.includes(key.toLowerCase())) { 
        price = val; 
        break; 
      }
    }
    
    if (price > 0) {
      priceInput.value = price;
    }
  });
}
