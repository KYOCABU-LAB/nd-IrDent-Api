# 🦷 Estructura del Sistema Dental - Odontograma

## 📋 Índice

1. [Visión General](#visión-general)
2. [Estructura de Tablas](#estructura-de-tablas)
3. [Matrices Visuales por Tipo de Diente](#matrices-visuales-por-tipo-de-diente)
4. [Configuraciones de Superficie](#configuraciones-de-superficie)
5. [Ejemplos de Datos](#ejemplos-de-datos)
6. [Flujo de Trabajo](#flujo-de-trabajo)

---

## 🎯 Visión General

El sistema de odontograma permite registrar diagnósticos dentales en superficies específicas de cada diente. Cada tipo de diente tiene una configuración de matriz visual diferente según su anatomía.

### Numeración FDI (Estándar Mundial)

```
    18  17  16  15  14  13  12  11 | 21  22  23  24  25  26  27  28
    ---------------------------------------------------|---------------------------------------------------
    48  47  46  45  44  43  42  41 | 31  32  33  34  35  36  37  38

Cuadrantes:
- 1️⃣ Superior Derecho (11-18)
- 2️⃣ Superior Izquierdo (21-28)
- 3️⃣ Inferior Izquierdo (31-38)
- 4️⃣ Inferior Derecho (41-48)
```

---

## 🗄️ Estructura de Tablas

### 1. **ConfiguracionSuperficie**

Define el "molde" de matriz para cada tipo de diente.

| Campo         | Tipo   | Descripción                       |
| ------------- | ------ | --------------------------------- |
| `id`          | INT    | ID único                          |
| `tipo_diente` | ENUM   | INCISIVO, CANINO, PREMOLAR, MOLAR |
| `filas`       | INT    | Número de filas (siempre 3)       |
| `columnas`    | INT    | Número de columnas (3 o 5)        |
| `descripcion` | STRING | Descripción de la configuración   |

### 2. **SuperficieDental**

Define cada "casilla" activa de la matriz.

| Campo                       | Tipo    | Descripción                                  |
| --------------------------- | ------- | -------------------------------------------- |
| `id`                        | INT     | ID único                                     |
| `configuracionSuperficieId` | INT     | FK a ConfiguracionSuperficie                 |
| `fila`                      | INT     | Posición fila (0, 1, 2)                      |
| `columna`                   | INT     | Posición columna (0-4)                       |
| `codigo`                    | STRING  | Código de superficie (V, M, D, L, O)         |
| `cara_anatomica`            | ENUM    | VESTIBULAR, LINGUAL, MESIAL, DISTAL, OCLUSAL |
| `ubicacion_especifica`      | STRING  | Descripción específica                       |
| `es_activa`                 | BOOLEAN | Si la superficie es clickeable               |

### 3. **Diente**

Los 32 dientes permanentes.

| Campo           | Tipo   | Descripción                       |
| --------------- | ------ | --------------------------------- |
| `id`            | INT    | ID único                          |
| `numero_diente` | STRING | Numeración FDI (11, 12, ..., 48)  |
| `nombre_diente` | STRING | Nombre completo del diente        |
| `tipo_diente`   | ENUM   | INCISIVO, CANINO, PREMOLAR, MOLAR |

### 4. **ConfiguracionDiente**

Relaciona cada diente con su configuración de superficie.

| Campo                       | Tipo | Descripción                  |
| --------------------------- | ---- | ---------------------------- |
| `dienteId`                  | INT  | FK a Diente                  |
| `configuracionSuperficieId` | INT  | FK a ConfiguracionSuperficie |

### 5. **HallazgosPaciente**

Diagnósticos específicos por diente/superficie.

| Campo                  | Tipo | Descripción                      |
| ---------------------- | ---- | -------------------------------- |
| `id_diente`            | INT  | FK a Diente                      |
| `id_superficie_dental` | INT  | FK a SuperficieDental (opcional) |
| `id_paciente`          | INT  | FK a Paciente                    |
| `id_hallazgo`          | INT  | FK a Hallazgos                   |
| `observaciones`        | TEXT | Notas adicionales                |

---

## 🎨 Matrices Visuales por Tipo de Diente

### 🦷 INCISIVOS y CANINOS (3x3 - Centro Vacío)

```
┌─────────┬─────────┬─────────┐
│    V    │   V2    │   V3    │  ← Fila 0: VESTIBULAR (frente)
│ Cervical│  Medio  │ Incisal │
├─────────┼─────────┼─────────┤
│    M    │   ❌    │    D    │  ← Fila 1: MESIAL/DISTAL (lados)
│ Completa│  Vacío  │Completa │
├─────────┼─────────┼─────────┤
│    L    │   L2    │   L3    │  ← Fila 2: LINGUAL (atrás)
│ Cervical│  Medio  │ Incisal │
└─────────┴─────────┴─────────┘

Superficies Activas: 8 (sin centro)
Razón: No tienen superficie oclusal
```

### 🦷 PREMOLARES (3x3 - Centro Oclusal)

```
┌─────────┬─────────┬─────────┐
│    V    │   V2    │   V3    │  ← Fila 0: VESTIBULAR
│ Cervical│  Medio  │ Oclusal │
├─────────┼─────────┼─────────┤
│    M    │    O    │    D    │  ← Fila 1: MESIAL/OCLUSAL/DISTAL
│ Completa│ Oclusal │Completa │
├─────────┼─────────┼─────────┤
│    L    │   L2    │   L3    │  ← Fila 2: LINGUAL
│ Cervical│  Medio  │ Oclusal │
└─────────┴─────────┴─────────┘

Superficies Activas: 9 (con centro oclusal)
Razón: Tienen superficie oclusal simple
```

### 🦷 MOLARES (3x5 - Centro Oclusal Complejo)

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│    V    │   V2    │   V3    │   V4    │   V5    │  ← Fila 0: VESTIBULAR
│ Cervical│  Medio  │ Oclusal │  Medio  │ Cervical│
├─────────┼─────────┼─────────┼─────────┼─────────┤
│    M    │   O1    │   O2    │   O3    │    D    │  ← Fila 1: MESIAL/OCLUSAL/DISTAL
│ Completa│  Fosa   │  Fosa   │  Fosa   │Completa │
│         │ Mesial  │ Central │ Distal  │         │
├─────────┼─────────┼─────────┼─────────┼─────────┤
│    L    │   L2    │   L3    │   L4    │   L5    │  ← Fila 2: LINGUAL
│ Cervical│  Medio  │ Oclusal │  Medio  │ Cervical│
└─────────┴─────────┴─────────┴─────────┴─────────┘

Superficies Activas: 15 (oclusal compleja)
Razón: Tienen múltiples fosas y cúspides
```

---

## ⚙️ Configuraciones de Superficie

### Configuración por Tipo

| Tipo Diente | Filas | Columnas | Superficies Activas | Centro              |
| ----------- | ----- | -------- | ------------------- | ------------------- |
| INCISIVO    | 3     | 3        | 8                   | ❌ Vacío            |
| CANINO      | 3     | 3        | 8                   | ❌ Vacío            |
| PREMOLAR    | 3     | 3        | 9                   | ✅ Oclusal          |
| MOLAR       | 3     | 5        | 15                  | ✅ Oclusal Complejo |

### Códigos de Superficie

| Código                | Cara Anatómica | Descripción                                |
| --------------------- | -------------- | ------------------------------------------ |
| `V`, `V2`, `V3`       | VESTIBULAR     | Superficie frontal (hacia labios/mejillas) |
| `L`, `L2`, `L3`       | LINGUAL        | Superficie posterior (hacia lengua)        |
| `M`                   | MESIAL         | Superficie hacia el centro de la boca      |
| `D`                   | DISTAL         | Superficie hacia atrás de la boca          |
| `O`, `O1`, `O2`, `O3` | OCLUSAL        | Superficie de masticación                  |

---

## 📊 Ejemplos de Datos

### Ejemplo: Incisivo Central Superior Derecho (11)

```sql
-- Configuración
ConfiguracionSuperficie: {
  id: 1,
  tipo_diente: 'INCISIVO',
  filas: 3,
  columnas: 3
}

-- Superficies (solo activas)
SuperficieDental: [
  {fila: 0, col: 0, codigo: 'V',  cara: 'VESTIBULAR'},
  {fila: 0, col: 1, codigo: 'V2', cara: 'VESTIBULAR'},
  {fila: 0, col: 2, codigo: 'V3', cara: 'VESTIBULAR'},
  {fila: 1, col: 0, codigo: 'M',  cara: 'MESIAL'},
  // ❌ NO existe: {fila: 1, col: 1} - centro vacío
  {fila: 1, col: 2, codigo: 'D',  cara: 'DISTAL'},
  {fila: 2, col: 0, codigo: 'L',  cara: 'LINGUAL'},
  {fila: 2, col: 1, codigo: 'L2', cara: 'LINGUAL'},
  {fila: 2, col: 2, codigo: 'L3', cara: 'LINGUAL'}
]
```

### Ejemplo: Primer Molar Superior Derecho (16)

```sql
-- Configuración
ConfiguracionSuperficie: {
  id: 4,
  tipo_diente: 'MOLAR',
  filas: 3,
  columnas: 5
}

-- Superficies (todas activas)
SuperficieDental: [
  {fila: 0, col: 0, codigo: 'V',  cara: 'VESTIBULAR'},
  {fila: 0, col: 1, codigo: 'V2', cara: 'VESTIBULAR'},
  {fila: 0, col: 2, codigo: 'V3', cara: 'VESTIBULAR'},
  {fila: 0, col: 3, codigo: 'V4', cara: 'VESTIBULAR'},
  {fila: 0, col: 4, codigo: 'V5', cara: 'VESTIBULAR'},
  {fila: 1, col: 0, codigo: 'M',  cara: 'MESIAL'},
  {fila: 1, col: 1, codigo: 'O1', cara: 'OCLUSAL'},
  {fila: 1, col: 2, codigo: 'O2', cara: 'OCLUSAL'},
  {fila: 1, col: 3, codigo: 'O3', cara: 'OCLUSAL'},
  {fila: 1, col: 4, codigo: 'D',  cara: 'DISTAL'},
  // ... fila 2 (lingual)
]
```

---

## 🔄 Flujo de Trabajo

### 1. **Inicialización del Sistema**

```bash
npm run db:reset  # Resetea y ejecuta seed
```

### 2. **Consulta de Configuración**

```sql
-- Obtener configuración para un diente específico
SELECT cs.*, sd.*
FROM Diente d
JOIN ConfiguracionDiente cd ON d.id = cd.dienteId
JOIN ConfiguracionSuperficie cs ON cd.configuracionSuperficieId = cs.id
JOIN SuperficieDental sd ON cs.id = sd.configuracionSuperficieId
WHERE d.numero_diente = '16'
ORDER BY sd.fila, sd.columna;
```

### 3. **Registro de Diagnóstico**

```sql
-- Registrar caries en superficie vestibular del diente 16
INSERT INTO HallazgosPaciente (
  id_diente, id_superficie_dental, id_paciente,
  id_doctor, id_hallazgo, observaciones
) VALUES (
  16, 45, 123, 1, 5, 'Caries profunda en tercio cervical'
);
```

### 4. **Consulta de Odontograma**

```sql
-- Obtener odontograma completo de un paciente
SELECT
  d.numero_diente,
  d.nombre_diente,
  sd.fila,
  sd.columna,
  sd.codigo,
  h.nombre_hallazgo,
  hp.observaciones
FROM Diente d
LEFT JOIN HallazgosPaciente hp ON d.id = hp.id_diente
LEFT JOIN SuperficieDental sd ON hp.id_superficie_dental = sd.id
LEFT JOIN Hallazgos h ON hp.id_hallazgo = h.id
WHERE hp.id_paciente = 123
ORDER BY d.numero_diente, sd.fila, sd.columna;
```

---

## 🎯 Ventajas del Sistema

1. **Flexibilidad**: Cada tipo de diente tiene su configuración específica
2. **Precisión**: Diagnósticos por superficie específica
3. **Escalabilidad**: Fácil agregar nuevos tipos de hallazgos
4. **Estándar**: Usa numeración FDI reconocida mundialmente
5. **Visual**: Matrices que reflejan la anatomía real

---

## 🚀 Próximos Desarrollos

1. **APIs REST**: Endpoints para consultar/actualizar odontogramas
2. **Frontend Interactivo**: Grillas clickeables por superficie
3. **Reportes**: Historial dental por paciente
4. **Imágenes**: Asociar radiografías a diagnósticos
5. **Plantillas**: Configuraciones personalizadas por clínica
