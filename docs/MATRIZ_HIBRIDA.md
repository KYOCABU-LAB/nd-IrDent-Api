# 🎨 Matriz Híbrida - Configuración Avanzada

## 🎯 Concepto: Matriz 3x3 con Centro Expandido

Esta es una configuración alternativa donde mantenemos una matriz base de 3x3, pero el centro se expande a múltiples subdivisiones para mayor precisión en la superficie oclusal.

---

## 🦷 Matriz Híbrida para Molares

### Configuración Visual

```
┌─────────┬─────────────────────────────────────┬─────────┐
│    V    │               V2                    │   V3    │  ← Fila 0: VESTIBULAR
│ Cervical│             Medio                   │ Incisal │
├─────────┼─────────┬─────────┬─────────┬───────┼─────────┤
│    M    │   O1    │   O2    │   O3    │  O4   │    D    │  ← Fila 1: MESIAL/OCLUSAL/DISTAL
│ Completa│  Fosa   │  Fosa   │  Fosa   │ Fosa  │Completa │    (Centro expandido a 4 columnas)
│         │ Mesial  │ Central │ Central │ Distal│         │
├─────────┼─────────┴─────────┴─────────┴───────┼─────────┤
│    L    │               L2                    │   L3    │  ← Fila 2: LINGUAL
│ Cervical│             Medio                   │ Incisal │
└─────────┴─────────────────────────────────────┴─────────┘
```

### Implementación en Base de Datos

#### Configuración de Superficie

```sql
ConfiguracionSuperficie: {
  tipo_diente: 'MOLAR_HIBRIDO',
  filas: 3,
  columnas: 6,  -- Base 3 + Centro expandido 4 = 6 total
  descripcion: 'Matriz híbrida 3x3 con centro oclusal expandido'
}
```

#### Superficies Dentales

```sql
SuperficieDental: [
  -- Fila 0: Vestibular (3 columnas normales)
  {fila: 0, col: 0, codigo: 'V',  cara: 'VESTIBULAR', ubicacion: 'tercio_cervical'},
  {fila: 0, col: 1, codigo: 'V2', cara: 'VESTIBULAR', ubicacion: 'tercio_medio', colspan: 4},
  {fila: 0, col: 5, codigo: 'V3', cara: 'VESTIBULAR', ubicacion: 'tercio_incisal'},

  -- Fila 1: Mesial + Centro Expandido + Distal (6 columnas)
  {fila: 1, col: 0, codigo: 'M',  cara: 'MESIAL',   ubicacion: 'completa'},
  {fila: 1, col: 1, codigo: 'O1', cara: 'OCLUSAL',  ubicacion: 'fosa_mesial'},
  {fila: 1, col: 2, codigo: 'O2', cara: 'OCLUSAL',  ubicacion: 'fosa_central_1'},
  {fila: 1, col: 3, codigo: 'O3', cara: 'OCLUSAL',  ubicacion: 'fosa_central_2'},
  {fila: 1, col: 4, codigo: 'O4', cara: 'OCLUSAL',  ubicacion: 'fosa_distal'},
  {fila: 1, col: 5, codigo: 'D',  cara: 'DISTAL',   ubicacion: 'completa'},

  -- Fila 2: Lingual (3 columnas normales)
  {fila: 2, col: 0, codigo: 'L',  cara: 'LINGUAL', ubicacion: 'tercio_cervical'},
  {fila: 2, col: 1, codigo: 'L2', cara: 'LINGUAL', ubicacion: 'tercio_medio', colspan: 4},
  {fila: 2, col: 5, codigo: 'L3', cara: 'LINGUAL', ubicacion: 'tercio_incisal'}
]
```

---

## 🎨 Representación Visual Detallada

### Como se ve en la Interfaz

```
┌───────────────────────────────────────────────────────────┐
│                    DIENTE 16 - MOLAR                     │
├─────────┬─────────────────────────────────────┬─────────┤
│    V    │ ████████████ V2 ████████████       │   V3    │
│ (click) │           (clickeable)              │ (click) │
├─────────┼─────────┬─────────┬─────────┬───────┼─────────┤
│    M    │   O1    │   O2    │   O3    │  O4   │    D    │
│ (click) │ (click) │ (click) │ (click) │(click)│ (click) │
├─────────┼─────────┴─────────┴─────────┴───────┼─────────┤
│    L    │ ████████████ L2 ████████████       │   L3    │
│ (click) │           (clickeable)              │ (click) │
└─────────┴─────────────────────────────────────┴─────────┘
```

### Ventajas de la Matriz Híbrida

1. **Precisión Oclusal**: 4 zonas específicas en la superficie de masticación
2. **Simplicidad Visual**: Mantiene la estructura 3x3 familiar
3. **Flexibilidad**: Permite diagnósticos muy específicos en molares
4. **Compatibilidad**: Funciona con el sistema existente

---

## 🔧 Implementación en el Seed

Agregar esta configuración al seed actual:

```typescript
// Configuración híbrida para molares complejos
prisma.configuracionSuperficie.upsert({
  where: { tipo_diente: 'MOLAR_HIBRIDO' },
  update: {},
  create: {
    tipo_diente: 'MOLAR_HIBRIDO',
    columnas: 6,
    descripcion: 'Configuración híbrida 3x3 con centro oclusal expandido (4 zonas)',
  },
}),

// Superficies para matriz híbrida
const superficiesMolarHibrido = [
  // Fila 0: Vestibular (con colspan)
  {
    fila: 0, columna: 0, codigo: 'V', cara: 'VESTIBULAR',
    ubicacion: 'tercio_cervical', activa: true,
    desc: 'Vestibular tercio cervical'
  },
  {
    fila: 0, columna: 1, codigo: 'V2', cara: 'VESTIBULAR',
    ubicacion: 'tercio_medio_expandido', activa: true,
    desc: 'Vestibular tercio medio (expandido)', colspan: 4
  },
  {
    fila: 0, columna: 5, codigo: 'V3', cara: 'VESTIBULAR',
    ubicacion: 'tercio_incisal', activa: true,
    desc: 'Vestibular tercio incisal'
  },

  // Fila 1: Centro expandido (6 columnas)
  {
    fila: 1, columna: 0, codigo: 'M', cara: 'MESIAL',
    ubicacion: 'completa', activa: true,
    desc: 'Superficie mesial completa'
  },
  {
    fila: 1, columna: 1, codigo: 'O1', cara: 'OCLUSAL',
    ubicacion: 'fosa_mesial', activa: true,
    desc: 'Oclusal fosa mesial'
  },
  {
    fila: 1, columna: 2, codigo: 'O2', cara: 'OCLUSAL',
    ubicacion: 'fosa_central_1', activa: true,
    desc: 'Oclusal fosa central anterior'
  },
  {
    fila: 1, columna: 3, codigo: 'O3', cara: 'OCLUSAL',
    ubicacion: 'fosa_central_2', activa: true,
    desc: 'Oclusal fosa central posterior'
  },
  {
    fila: 1, columna: 4, codigo: 'O4', cara: 'OCLUSAL',
    ubicacion: 'fosa_distal', activa: true,
    desc: 'Oclusal fosa distal'
  },
  {
    fila: 1, columna: 5, codigo: 'D', cara: 'DISTAL',
    ubicacion: 'completa', activa: true,
    desc: 'Superficie distal completa'
  },

  // Fila 2: Lingual (con colspan)
  {
    fila: 2, columna: 0, codigo: 'L', cara: 'LINGUAL',
    ubicacion: 'tercio_cervical', activa: true,
    desc: 'Lingual tercio cervical'
  },
  {
    fila: 2, columna: 1, codigo: 'L2', cara: 'LINGUAL',
    ubicacion: 'tercio_medio_expandido', activa: true,
    desc: 'Lingual tercio medio (expandido)', colspan: 4
  },
  {
    fila: 2, columna: 5, codigo: 'L3', cara: 'LINGUAL',
    ubicacion: 'tercio_incisal', activa: true,
    desc: 'Lingual tercio incisal'
  }
];
```

---

## 🎯 Casos de Uso

### Ejemplo: Diagnóstico Específico

```
Paciente: Juan Pérez
Diente: 16 (Primer Molar Superior Derecho)
Diagnóstico:
- Caries en O2 (fosa central anterior)
- Obturación en O3 (fosa central posterior)
- Superficie V2 sana (vestibular medio)
```

### Consulta SQL

```sql
SELECT
  d.numero_diente,
  sd.codigo,
  sd.ubicacion_especifica,
  h.nombre_hallazgo
FROM HallazgosPaciente hp
JOIN Diente d ON hp.id_diente = d.id
JOIN SuperficieDental sd ON hp.id_superficie_dental = sd.id
JOIN Hallazgos h ON hp.id_hallazgo = h.id
WHERE d.numero_diente = '16' AND hp.id_paciente = 123;
```

---

## 🚀 Implementación Frontend

### CSS Grid para Matriz Híbrida

```css
.molar-hibrido {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 2px;
}

.superficie-v2 {
  grid-column: 2 / 6; /* Ocupa columnas 2-5 */
  grid-row: 1;
}

.superficie-l2 {
  grid-column: 2 / 6; /* Ocupa columnas 2-5 */
  grid-row: 3;
}
```

Esta configuración híbrida te da lo mejor de ambos mundos: simplicidad visual con precisión diagnóstica avanzada. ¿Te gusta esta aproximación?
