---
name: presupuesto-placa
description: >
  Genera presupuestos profesionales de fabricación de placas de yeso para cieloraso. Las placas se cortan
  de placas estándar argentinas (9.5 mm × 1200 mm × 2400 mm), se les aplica masilla tapa juntas para
  un acabado blanco uniforme, se lijan y se les dan dos manos de pintura. Usar cuando el usuario necesita:
  (1) Presupuestar la fabricación de placas de cieloraso, (2) Calcular materiales y mano de obra para corte,
  enmasillado, lijado y pintura de placas de yeso, (3) Optimizar el corte de placas estándar para minimizar
  desperdicio, (4) Generar un documento profesional de presupuesto de producción de placas.
---

# Presupuesto de Fabricación de Placas para Cieloraso

Generar presupuestos de producción de placas de yeso para cieloraso, cortadas a medida desde placas estándar, con terminación profesional (enmasillado, lijado y pintura).

## Especificaciones Técnicas

### Placa Estándar Argentina (materia prima)
- **Espesor**: 9.5 mm
- **Ancho**: 1200 mm (1.20 m)
- **Largo**: 2400 mm (2.40 m)
- **Superficie**: 2.88 m²
- **Peso aproximado**: ~22 kg

### Placa Personalizada (producto terminado)
- **Largo**: 1200 mm (1.20 m)
- **Ancho**: 650 mm (0.65 m)
- **Espesor**: 9.5 mm
- **Superficie por placa**: 0.78 m²

## Optimización de Corte

### Rendimiento por Placa Estándar

De cada placa estándar (1200 × 2400 mm) se obtienen **3 placas personalizadas**:

```
┌──────────────────────────────────────────────────────┐
│                  2400 mm                             │
│  ┌──────────┬──────────┬──────────┬────────┐         │
│  │          │          │          │ SOBRANTE│  1200   │
│  │  650 mm  │  650 mm  │  650 mm  │ 450 mm │   mm    │
│  │  PLACA 1 │  PLACA 2 │  PLACA 3 │        │         │
│  └──────────┴──────────┴──────────┴────────┘         │
└──────────────────────────────────────────────────────┘
```

- **Cortes necesarios**: 3 cortes rectos a lo ancho (a 650, 1300 y 1950 mm)
- **Sobrante por placa estándar**: 1200 × 450 mm = 0.54 m² (18.75% de desperdicio)
- **Aprovechamiento**: 81.25%

### Fórmula de Cálculo

```
Placas estándar necesarias = ⌈ Cantidad de placas personalizadas ÷ 3 ⌉ (redondear hacia arriba)
```

Agregar **5-10%** adicional por rotura/defectos en el proceso.

## Flujo de Trabajo de Producción

1. **Relevamiento** → Cantidad de placas requeridas + datos del espacio
2. **Cálculo de corte** → Determinar placas estándar necesarias
3. **Cálculo de materiales** → Consultar `references/materiales-placa.md`
4. **Cálculo de mano de obra** → Consultar `references/produccion-placa.md`
5. **Armado del presupuesto** → Generar documento profesional
6. **Revisión** → Validar totales y condiciones

## Datos a Solicitar al Usuario

### Obligatorios
- **Cantidad de placas** personalizadas requeridas, O bien:
- **Dimensiones del cieloraso** (largo × ancho en metros) para calcular la cantidad automáticamente
- **Precio de la placa estándar** (9.5 mm × 1200 × 2400)

### Opcionales (usar valores por defecto si no se proporcionan)
- **Tipo de pintura**: látex interior blanco (por defecto)
- **Marca de materiales**: gama media si no se especifica
- **Margen por rotura**: 10% por defecto
- **Lugar de trabajo**: taller o en obra

### Cálculo Automático desde Dimensiones del Cieloraso

Si el usuario provee las dimensiones del cieloraso en vez de la cantidad de placas:

```
Placas en largo = ⌈ largo del cieloraso (mm) ÷ 1200 ⌉
Placas en ancho = ⌈ ancho del cieloraso (mm) ÷ 650 ⌉
Total placas = Placas en largo × Placas en ancho
```

Contemplar solapes o marcos perimetrales según el sistema de instalación.

## Etapas de Producción

### Etapa 1: Corte de Placas
- Medir y marcar líneas de corte con regla T y lápiz
- Cortar con trincheta/cúter sobre guía recta (marcar un lado, quebrar, cortar papel del otro lado)
- Emparejar bordes con escofina o lija gruesa (80)
- Verificar escuadra de cada placa cortada
- Descartar placas con rotura o defecto
- **Herramientas**: regla T de 1.20m, trincheta reforzada, escofina para yeso, escuadra
- **Rendimiento**: ver `references/produccion-placa.md`

### Etapa 2: Aplicación de Masilla Tapa Juntas
- Preparar masilla según indicaciones del fabricante (si es en polvo)
- Aplicar capa uniforme con espátula ancha (250mm) sobre toda la cara vista
- Cubrir completamente el papel de la placa para lograr superficie blanca uniforme
- Extender masilla en bordes cortados para sellarlos
- Dejar secar completamente (mínimo 12-24 hs según clima y ventilación)
- **Nota**: aplicar sobre superficie limpia, sin polvo del corte
- **Rendimiento masilla**: ver `references/materiales-placa.md`

### Etapa 3: Lijado
- Lijado general con lija 150 para emparejar la masilla
- Lijado fino con lija 220 para terminación suave
- Limpiar polvo con trapo húmedo (no mojado, para no dañar la masilla)
- Inspeccionar superficie a contraluz para verificar uniformidad
- Si hay imperfecciones: retocar con masilla, dejar secar, y relijar
- **Precaución**: usar barbijo/máscara para polvo de yeso

### Etapa 4: Primera Mano de Pintura
- Aplicar sellador fijador diluido (50% agua, 50% sellador) como base si la masilla es muy porosa
- Aplicar primera mano de látex interior blanco con rodillo de pelo corto (10mm)
- Recortar bordes con pincel si es necesario
- Dejar secar mínimo 2-4 hs
- **Técnica**: pasadas uniformes en una sola dirección, sin repasar zona ya aplicada

### Etapa 5: Segunda Mano de Pintura
- Lijar suave con lija 320 entre manos (opcional, para terminación premium)
- Limpiar polvo
- Aplicar segunda mano cruzada a la primera
- Dejar secar completamente antes de manipular (mínimo 4 hs)
- Inspeccionar cobertura final

### Etapa 6: Secado, Control de Calidad y Almacenamiento
- Verificar cobertura uniforme en todas las placas
- Descartar placas con defectos visibles
- Apilar horizontalmente con separadores, cara pintada hacia arriba
- Almacenar en lugar seco y protegido del polvo
- Etiquetar lote con fecha de producción

## Formato del Presupuesto

Generar el presupuesto como **artefacto Markdown** con la siguiente estructura:

```markdown
# PRESUPUESTO DE FABRICACIÓN DE PLACAS PARA CIELORASO N° [XXXX]

**Fecha**: [fecha actual]
**Válido por**: 15 días corridos
**Cliente**: [nombre]
**Destino**: [dirección de obra o uso]

---

## ESPECIFICACIONES DEL PRODUCTO

| Característica | Valor |
|---------------|-------|
| Medida placa terminada | 1200 mm × 650 mm × 9.5 mm |
| Superficie por placa | 0.78 m² |
| Acabado | Masilla tapa juntas + 2 manos látex blanco |
| Placa base | Estándar 9.5 mm × 1200 mm × 2400 mm |

---

## 1. CÁLCULO DE PRODUCCIÓN

| Concepto | Cantidad |
|----------|---------|
| Placas personalizadas solicitadas | X unidades |
| Margen por rotura/defectos (10%) | X unidades |
| **Total placas a producir** | **X unidades** |
| Placas estándar necesarias (÷3) | X unidades |
| Superficie total de producción | X m² |

---

## 2. MATERIALES

| Material | Unidad | Cantidad | Precio unit. ($) | Subtotal ($) |
|----------|--------|----------|-------------------|-------------|
| Placa de yeso 9.5mm 1200×2400 | Unidad | X | $ | $ |
| Masilla tapa juntas | Kg/Balde | X | $ | $ |
| Lija grano 150 | Hoja | X | $ | $ |
| Lija grano 220 | Hoja | X | $ | $ |
| Sellador fijador | Litro | X | $ | $ |
| Pintura látex interior blanco | Litro | X | $ | $ |
| Rodillo pelo corto 10mm | Unidad | X | $ | $ |
| Bandeja para rodillo | Unidad | X | $ | $ |
| Trincheta reforzada (hojas) | Unidad | X | $ | $ |
| Barbijo/máscara polvo | Unidad | X | $ | $ |

**Subtotal materiales**: $X

---

## 3. MANO DE OBRA

| Etapa | Cantidad | Rendimiento | Jornales | Precio jornal ($) | Subtotal ($) |
|-------|----------|-------------|----------|-------------------|-------------|
| Corte de placas | X placas | X/jornal | X | $ | $ |
| Aplicación de masilla | X placas | X/jornal | X | $ | $ |
| Lijado | X placas | X/jornal | X | $ | $ |
| Primera mano pintura | X placas | X/jornal | X | $ | $ |
| Segunda mano pintura | X placas | X/jornal | X | $ | $ |
| Control y almacenamiento | X placas | X/jornal | X | $ | $ |

**Subtotal mano de obra**: $X

---

## 4. RESUMEN

| Concepto | Monto ($) |
|----------|-----------|
| Materiales | $X |
| Mano de obra | $X |
| Subtotal | $X |
| **Costo por placa** | **$X** |
| **Costo por m²** | **$X** |

---

## 5. CONDICIONES

- **Forma de pago**: [según acuerdo]
- **Plazo de producción**: X días hábiles
- **Entrega**: [en taller / en obra]
- **Incluye**: Materiales, mano de obra, control de calidad
- **No incluye**: Transporte, instalación, estructura de soporte
- **Observaciones**: [notas relevantes]
```

## Precios y Valores

- **Siempre preguntar al usuario** los precios actualizados de materiales y mano de obra
- Si el usuario no los tiene, dejar campos como `[A COMPLETAR]` y sugerir consultar corralones locales
- Nunca inventar precios
- Calcular siempre **costo unitario por placa** y **costo por m²** en el resumen
