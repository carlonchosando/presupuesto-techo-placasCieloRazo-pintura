---
name: presupuesto-pintura
description: >
  Genera presupuestos profesionales de pintura para interiores y exteriores de viviendas, departamentos,
  oficinas y locales comerciales. Incluye todas las etapas: relevamiento, preparación de superficies
  (lijado, reparación de grietas, sellado), imprimación, enduido, aplicación de pintura (látex, sintético,
  esmalte), terminaciones y limpieza final. Usar cuando el usuario necesita: (1) Crear un presupuesto
  de pintura nuevo, (2) Calcular materiales y mano de obra para pintar, (3) Estimar costos de preparación
  y pintado de paredes/techos/aberturas, (4) Generar un documento profesional de presupuesto de pintura.
---

# Presupuesto de Pintura Profesional

Generar presupuestos detallados y profesionales de pintura, cubriendo todas las etapas del proceso desde el relevamiento inicial hasta la limpieza y entrega final.

## Flujo de Trabajo

1. **Relevamiento** → Recopilar datos del espacio (superficies, estado, tipo de pintura deseada)
2. **Diagnóstico** → Evaluar estado de superficies y determinar trabajos necesarios
3. **Cálculo de materiales** → Consultar tabla de rendimientos (ver `references/rendimientos.md`)
4. **Cálculo de mano de obra** → Estimar jornales por etapa (ver `references/mano-de-obra.md`)
5. **Armado del presupuesto** → Generar documento con formato profesional
6. **Revisión** → Validar totales, agregar condiciones y garantía

## Datos a Solicitar al Usuario

Recopilar la siguiente información antes de generar el presupuesto:

### Obligatorios
- **Tipo de inmueble**: casa, departamento, oficina, local comercial
- **Ambientes a pintar**: listado con dimensiones (largo × ancho × alto) o m² aproximados
- **Superficies**: paredes, techos, aberturas (puertas, ventanas, marcos)
- **Estado actual**: pintura existente (buena, regular, mala, sin pintura), presencia de humedad, grietas, descascaramiento
- **Tipo de pintura deseada**: látex interior, látex exterior, esmalte sintético, membrana, impermeabilizante

### Opcionales (usar valores por defecto si no se proporcionan)
- **Altura estándar de pared**: 2.60 m por defecto
- **Color**: si requiere base oscura, estimar una mano adicional
- **Cantidad de manos**: 2 manos por defecto (3 si cambia de color oscuro a claro)
- **Marca de pintura preferida**: usar gama media si no se especifica
- **Plazo de ejecución deseado**

## Etapas del Trabajo de Pintura

Incluir TODAS las etapas aplicables en el presupuesto. Marcar N/A si no aplica.

### Etapa 1: Protección y Preparación del Espacio
- Cubrir pisos con cartón/nylon
- Cubrir muebles que no se puedan retirar
- Encintar marcos, zócalos, tomacorrientes, artefactos de iluminación
- Retirar accesorios (tapas de toma, percheros, cortinas)
- Señalización de zona de trabajo

### Etapa 2: Remoción y Limpieza Inicial
- Rasquetear pintura suelta o descascarada
- Eliminar pintura tipo cal/temple con espátula y agua
- Lavar superficies con solución desengrasante si hay grasa/nicotina
- Tratar manchas de humedad con solución fungicida/antimoho
- Remover papel tapiz (si existe)

### Etapa 3: Reparación de Superficies
- Reparar grietas finas (< 1mm) con masilla para interiores
- Reparar grietas medias (1-3mm) con enduido + malla de fibra de vidrio
- Reparar grietas gruesas (> 3mm) con mortero + malla + enduido
- Reparar agujeros de clavos/tarugos con masilla
- Reconstruir sectores de revoque dañado (presupuestar como adicional)
- Sellar juntas entre marcos y paredes con sellador acrílico

### Etapa 4: Lijado General
- Primer lijado grueso (lija 80-100) para emparejar reparaciones
- Lijado fino (lija 150-220) para alisar superficies
- Limpieza de polvo con trapo húmedo después de lijar
- En superficies de madera: lijar a favor de la veta

### Etapa 5: Aplicación de Imprimación (Primer/Sellador)
- Aplicar sellador fijador en superficies nuevas/porosas
- Aplicar fondo antioxidante en superficies metálicas
- Aplicar imprimante en superficies de madera
- Tiempo de secado: respetar indicaciones del fabricante (mínimo 4-6 hs)

### Etapa 6: Aplicación de Enduido
- Primera mano de enduido plástico con espátula ancha
- Lijado intermedio (lija 220) después de secado
- Segunda mano de enduido en dirección cruzada
- Lijado final fino (lija 280-320)
- Limpieza de polvo
- **Nota**: en techos evaluar si es necesario o si se trabaja solo con sellador

### Etapa 7: Retoque de Grietas Post-Enduido
- Inspeccionar líneas de grietas que reaparecieron
- Retocar con masilla fina
- Lijar puntual (lija 280)
- Limpiar polvo

### Etapa 8: Primera Mano de Pintura
- Recortar bordes y rincones con pincel
- Aplicar primera mano con rodillo en paños uniformes
- Técnica: en paredes de arriba hacia abajo, en techos en dirección de la luz
- Tiempo de secado entre manos: según fabricante (mínimo 4 hs látex, 12 hs esmalte)

### Etapa 9: Segunda Mano de Pintura (y adicionales)
- Inspeccionar cobertura de primera mano
- Aplicar segunda mano cruzada a la primera
- Evaluar necesidad de tercera mano (cambios de color, colores pastel sobre oscuro)

### Etapa 10: Terminaciones y Detalles
- Pintar marcos de puertas y ventanas (esmalte sintético generalmente)
- Pintar zócalos
- Pintar molduras de techo/rosetas
- Retirar cinta de enmascarar antes de secado completo
- Retoques puntuales con pincel fino
- Reinstalar accesorios retirados

### Etapa 11: Limpieza Final y Entrega
- Retirar protecciones de pisos y muebles
- Limpiar salpicaduras de pintura en pisos/vidrios/griferías
- Barrer y limpiar el espacio de trabajo
- Retirar residuos y materiales sobrantes
- Inspección final con el cliente
- Entrega de sobrantes de pintura identificados por ambiente/color

## Cálculo de Superficies

### Fórmulas Estándar
- **Pared sin aberturas**: largo × alto = m²
- **Pared con puerta estándar (0.80 × 2.00 m)**: (largo × alto) - 1.60 m²
- **Pared con ventana estándar (1.50 × 1.20 m)**: (largo × alto) - 1.80 m²
- **Techo**: largo × ancho = m²
- **Descontar aberturas** siempre del total

### Factor de Desperdicio
- Agregar **10%** en materiales por desperdicio y retoques
- En superficies muy irregulares agregar **15%**

## Formato del Presupuesto

Generar el presupuesto como **artefacto Markdown** con la siguiente estructura:

```markdown
# PRESUPUESTO DE PINTURA N° [XXXX]

**Fecha**: [fecha actual]
**Válido por**: 15 días corridos
**Cliente**: [nombre]
**Dirección de obra**: [dirección]
**Tipo de inmueble**: [tipo]

---

## 1. RELEVAMIENTO

| Ambiente | Largo (m) | Ancho (m) | Alto (m) | Sup. Paredes (m²) | Sup. Techo (m²) | Aberturas | Estado |
|----------|-----------|-----------|----------|--------------------|------------------|-----------|--------|
| ...      | ...       | ...       | ...      | ...                | ...              | ...       | ...    |

**Total superficies paredes**: X m²
**Total superficies techos**: X m²
**Total aberturas**: X unidades

---

## 2. TRABAJOS A REALIZAR

### Preparación de superficies
| Ítem | Descripción | Superficie (m²) | Precio unit. ($/m²) | Subtotal ($) |
|------|-------------|-----------------|---------------------|-------------|

### Pintura
| Ítem | Descripción | Superficie (m²) | Manos | Precio unit. ($/m²) | Subtotal ($) |
|------|-------------|-----------------|-------|---------------------|-------------|

### Terminaciones
| Ítem | Descripción | Unidad | Cantidad | Precio unit. ($) | Subtotal ($) |
|------|-------------|--------|----------|-------------------|-------------|

---

## 3. MATERIALES

| Material | Unidad | Cantidad | Precio unit. ($) | Subtotal ($) |
|----------|--------|----------|-------------------|-------------|

**Subtotal materiales**: $X

---

## 4. MANO DE OBRA

| Etapa | Jornales | Precio jornal ($) | Subtotal ($) |
|-------|----------|-------------------|-------------|

**Subtotal mano de obra**: $X

---

## 5. RESUMEN

| Concepto | Monto ($) |
|----------|-----------|
| Materiales | $X |
| Mano de obra | $X |
| Subtotal | $X |
| IVA (21%) | $X |
| **TOTAL** | **$X** |

---

## 6. CONDICIONES

- **Forma de pago**: 50% al inicio, 50% al finalizar (o según acuerdo)
- **Plazo de ejecución**: X días hábiles
- **Garantía**: [meses] por defectos de aplicación
- **No incluye**: [listar explícitamente]
- **Incluye**: Materiales, mano de obra, limpieza final
- **Observaciones**: [notas relevantes]

---

## 7. GARANTÍA

Se garantiza la correcta aplicación de los materiales por un plazo de [X] meses.
La garantía no cubre: fisuras estructurales, filtraciones de humedad no tratadas previamente,
daños por terceros o modificaciones posteriores.
```

## Precios y Valores

- **Siempre preguntar al usuario** los precios actualizados de materiales y mano de obra.
- Si el usuario no los tiene, consultar `references/rendimientos.md` para rendimientos estándar y sugerir que investigue precios en corralones locales.
- Nunca inventar precios — dejar campos marcados como `[A COMPLETAR]` si no se dispone del dato.

## Consideraciones Profesionales

- Diferenciar entre pintura de **interiores y exteriores** (productos distintos)
- En exteriores agregar: impermeabilizante, membrana líquida, tratamiento anti-humedad
- Contemplar **acceso difícil**: agregar costo de andamio o escalera extensible si altura > 3m
- **Climatología**: no pintar con humedad > 80%, temperatura < 10°C o > 35°C, lluvia
- Si hay **plomo** en pintura existente (casas pre-1980): advertir y presupuestar remoción segura
- Evaluar si las **instalaciones eléctricas** están en condiciones antes de trabajar
- Incluir nota sobre **ventilación** durante y después del trabajo
