import { PrismaClient } from 'generated/prisma';

const prisma = new PrismaClient();

export async function seedDentalRecords() {
  console.log(
    '🦷 Iniciando seed de registros dentales con terminología odontológica correcta...',
  );

  try {
    // 1. CONFIGURACIONES DE SUPERFICIE POR TIPO DE DIENTE
    console.log('📊 Creando configuraciones de superficie...');
    const configuracionesSuperficie = await Promise.all([
      prisma.configuracionSuperficie.upsert({
        where: { tipo_diente: 'INCISIVO' },
        update: {},
        create: {
          tipo_diente: 'INCISIVO',
          columnas: 3,
          descripcion:
            'Configuración 3x3 para incisivos - con superficie incisal',
        },
      }),
      prisma.configuracionSuperficie.upsert({
        where: { tipo_diente: 'CANINO' },
        update: {},
        create: {
          tipo_diente: 'CANINO',
          columnas: 3,
          descripcion:
            'Configuración 3x3 para caninos - con superficie incisal',
        },
      }),
      prisma.configuracionSuperficie.upsert({
        where: { tipo_diente: 'PREMOLAR' },
        update: {},
        create: {
          tipo_diente: 'PREMOLAR',
          columnas: 3,
          descripcion:
            'Configuración 3x3 para premolares - con superficie oclusal',
        },
      }),
      prisma.configuracionSuperficie.upsert({
        where: { tipo_diente: 'MOLAR' },
        update: {},
        create: {
          tipo_diente: 'MOLAR',
          columnas: 5,
          descripcion:
            'Configuración 3x5 para molares - con superficie oclusal compleja',
        },
      }),
    ]);

    console.log(
      `✅ Creadas ${configuracionesSuperficie.length} configuraciones de superficie`,
    );

    // 2. DIENTES ESTÁNDAR (32 DIENTES PERMANENTES - NUMERACIÓN FDI)
    console.log('🦷 Creando dientes estándar...');

    const dientes = [
      // CUADRANTE 1 (Superior Derecho)
      { numero: '18', nombre: 'Tercer Molar Superior Derecho', tipo: 'MOLAR' },
      { numero: '17', nombre: 'Segundo Molar Superior Derecho', tipo: 'MOLAR' },
      { numero: '16', nombre: 'Primer Molar Superior Derecho', tipo: 'MOLAR' },
      {
        numero: '15',
        nombre: 'Segundo Premolar Superior Derecho',
        tipo: 'PREMOLAR',
      },
      {
        numero: '14',
        nombre: 'Primer Premolar Superior Derecho',
        tipo: 'PREMOLAR',
      },
      { numero: '13', nombre: 'Canino Superior Derecho', tipo: 'CANINO' },
      {
        numero: '12',
        nombre: 'Incisivo Lateral Superior Derecho',
        tipo: 'INCISIVO',
      },
      {
        numero: '11',
        nombre: 'Incisivo Central Superior Derecho',
        tipo: 'INCISIVO',
      },

      // CUADRANTE 2 (Superior Izquierdo)
      {
        numero: '21',
        nombre: 'Incisivo Central Superior Izquierdo',
        tipo: 'INCISIVO',
      },
      {
        numero: '22',
        nombre: 'Incisivo Lateral Superior Izquierdo',
        tipo: 'INCISIVO',
      },
      { numero: '23', nombre: 'Canino Superior Izquierdo', tipo: 'CANINO' },
      {
        numero: '24',
        nombre: 'Primer Premolar Superior Izquierdo',
        tipo: 'PREMOLAR',
      },
      {
        numero: '25',
        nombre: 'Segundo Premolar Superior Izquierdo',
        tipo: 'PREMOLAR',
      },
      {
        numero: '26',
        nombre: 'Primer Molar Superior Izquierdo',
        tipo: 'MOLAR',
      },
      {
        numero: '27',
        nombre: 'Segundo Molar Superior Izquierdo',
        tipo: 'MOLAR',
      },
      {
        numero: '28',
        nombre: 'Tercer Molar Superior Izquierdo',
        tipo: 'MOLAR',
      },

      // CUADRANTE 3 (Inferior Izquierdo)
      {
        numero: '38',
        nombre: 'Tercer Molar Inferior Izquierdo',
        tipo: 'MOLAR',
      },
      {
        numero: '37',
        nombre: 'Segundo Molar Inferior Izquierdo',
        tipo: 'MOLAR',
      },
      {
        numero: '36',
        nombre: 'Primer Molar Inferior Izquierdo',
        tipo: 'MOLAR',
      },
      {
        numero: '35',
        nombre: 'Segundo Premolar Inferior Izquierdo',
        tipo: 'PREMOLAR',
      },
      {
        numero: '34',
        nombre: 'Primer Premolar Inferior Izquierdo',
        tipo: 'PREMOLAR',
      },
      { numero: '33', nombre: 'Canino Inferior Izquierdo', tipo: 'CANINO' },
      {
        numero: '32',
        nombre: 'Incisivo Lateral Inferior Izquierdo',
        tipo: 'INCISIVO',
      },
      {
        numero: '31',
        nombre: 'Incisivo Central Inferior Izquierdo',
        tipo: 'INCISIVO',
      },

      // CUADRANTE 4 (Inferior Derecho)
      {
        numero: '41',
        nombre: 'Incisivo Central Inferior Derecho',
        tipo: 'INCISIVO',
      },
      {
        numero: '42',
        nombre: 'Incisivo Lateral Inferior Derecho',
        tipo: 'INCISIVO',
      },
      { numero: '43', nombre: 'Canino Inferior Derecho', tipo: 'CANINO' },
      {
        numero: '44',
        nombre: 'Primer Premolar Inferior Derecho',
        tipo: 'PREMOLAR',
      },
      {
        numero: '45',
        nombre: 'Segundo Premolar Inferior Derecho',
        tipo: 'PREMOLAR',
      },
      { numero: '46', nombre: 'Primer Molar Inferior Derecho', tipo: 'MOLAR' },
      { numero: '47', nombre: 'Segundo Molar Inferior Derecho', tipo: 'MOLAR' },
      { numero: '48', nombre: 'Tercer Molar Inferior Derecho', tipo: 'MOLAR' },
    ];

    const dientesCreados = await Promise.all(
      dientes.map((d) =>
        prisma.diente.upsert({
          where: { numero_diente: d.numero },
          update: {},
          create: {
            numero_diente: d.numero,
            nombre_diente: d.nombre,
            descripcion: `Diente ${d.numero} - ${d.nombre}`,
            edad_diente: 'adulto',
            tipo_diente: d.tipo as any,
          },
        }),
      ),
    );

    console.log(`✅ Creados ${dientesCreados.length} dientes`);

    // 3. SUPERFICIES DENTALES POR CONFIGURACIÓN
    console.log('🔗 Creando superficies dentales...');

    // Superficies para INCISIVOS y CANINOS (3x3)
    const superficiesIncisivoCanino = [
      // Fila 0: Vestibular
      {
        fila: 0,
        columna: 0,
        codigo: 'V',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Vestibular tercio cervical',
      },
      {
        fila: 0,
        columna: 1,
        codigo: 'V2',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Vestibular tercio medio',
      },
      {
        fila: 0,
        columna: 2,
        codigo: 'V3',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_incisal',
        activa: true,
        desc: 'Vestibular tercio incisal',
      },
      // Fila 1: Mesial y Distal
      {
        fila: 1,
        columna: 0,
        codigo: 'M',
        cara: 'MESIAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie mesial completa',
      },
      {
        fila: 1,
        columna: 1,
        codigo: null,
        cara: null,
        ubicacion: null,
        activa: false,
        desc: 'Posición central vacía',
      },
      {
        fila: 1,
        columna: 2,
        codigo: 'D',
        cara: 'DISTAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie distal completa',
      },
      // Fila 2: Lingual
      {
        fila: 2,
        columna: 0,
        codigo: 'L',
        cara: 'LINGUAL',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Lingual tercio cervical',
      },
      {
        fila: 2,
        columna: 1,
        codigo: 'L2',
        cara: 'LINGUAL',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Lingual tercio medio',
      },
      {
        fila: 2,
        columna: 2,
        codigo: 'L3',
        cara: 'LINGUAL',
        ubicacion: 'tercio_incisal',
        activa: true,
        desc: 'Lingual tercio incisal',
      },
    ];

    // Crear superficies para incisivos y caninos
    for (const config of configuracionesSuperficie.filter(
      (c) => c.tipo_diente === 'INCISIVO' || c.tipo_diente === 'CANINO',
    )) {
      await Promise.all(
        superficiesIncisivoCanino
          .filter((s) => s.activa) // Solo crear superficies activas
          .map((s) =>
            prisma.superficieDental.create({
              data: {
                configuracionSuperficieId: config.id,
                fila: s.fila,
                columna: s.columna,
                codigo: s.codigo || '',
                cara_anatomica: s.cara as any,
                ubicacion_especifica: s.ubicacion,
                es_activa: s.activa,
                descripcion: s.desc,
              },
            }),
          ),
      );
    }

    // Superficies para PREMOLARES (3x3 con oclusal)
    const superficiesPremolar = [
      // Fila 0: Vestibular
      {
        fila: 0,
        columna: 0,
        codigo: 'V',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Vestibular tercio cervical',
      },
      {
        fila: 0,
        columna: 1,
        codigo: 'V2',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Vestibular tercio medio',
      },
      {
        fila: 0,
        columna: 2,
        codigo: 'V3',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_oclusal',
        activa: true,
        desc: 'Vestibular tercio oclusal',
      },
      // Fila 1: Mesial, Oclusal y Distal
      {
        fila: 1,
        columna: 0,
        codigo: 'M',
        cara: 'MESIAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie mesial completa',
      },
      {
        fila: 1,
        columna: 1,
        codigo: 'O',
        cara: 'OCLUSAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie oclusal completa',
      },
      {
        fila: 1,
        columna: 2,
        codigo: 'D',
        cara: 'DISTAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie distal completa',
      },
      // Fila 2: Lingual
      {
        fila: 2,
        columna: 0,
        codigo: 'L',
        cara: 'LINGUAL',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Lingual tercio cervical',
      },
      {
        fila: 2,
        columna: 1,
        codigo: 'L2',
        cara: 'LINGUAL',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Lingual tercio medio',
      },
      {
        fila: 2,
        columna: 2,
        codigo: 'L3',
        cara: 'LINGUAL',
        ubicacion: 'tercio_oclusal',
        activa: true,
        desc: 'Lingual tercio oclusal',
      },
    ];

    // Crear superficies para premolares
    for (const config of configuracionesSuperficie.filter(
      (c) => c.tipo_diente === 'PREMOLAR',
    )) {
      await Promise.all(
        superficiesPremolar
          .filter((s) => s.activa) // Solo crear superficies activas
          .map((s) =>
            prisma.superficieDental.create({
              data: {
                configuracionSuperficieId: config.id,
                fila: s.fila,
                columna: s.columna,
                codigo: s.codigo || '',
                cara_anatomica: s.cara as any,
                ubicacion_especifica: s.ubicacion,
                es_activa: s.activa,
                descripcion: s.desc,
              },
            }),
          ),
      );
    }

    // Superficies para MOLARES (3x5 con oclusal compleja)
    const superficiesMolar = [
      // Fila 0: Vestibular
      {
        fila: 0,
        columna: 0,
        codigo: 'V',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Vestibular tercio cervical',
      },
      {
        fila: 0,
        columna: 1,
        codigo: 'V2',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Vestibular tercio medio',
      },
      {
        fila: 0,
        columna: 2,
        codigo: 'V3',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_oclusal',
        activa: true,
        desc: 'Vestibular tercio oclusal',
      },
      {
        fila: 0,
        columna: 3,
        codigo: 'V4',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_medio_distal',
        activa: true,
        desc: 'Vestibular tercio medio distal',
      },
      {
        fila: 0,
        columna: 4,
        codigo: 'V5',
        cara: 'VESTIBULAR',
        ubicacion: 'tercio_cervical_distal',
        activa: true,
        desc: 'Vestibular tercio cervical distal',
      },
      // Fila 1: Mesial, Oclusal y Distal
      {
        fila: 1,
        columna: 0,
        codigo: 'M',
        cara: 'MESIAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie mesial completa',
      },
      {
        fila: 1,
        columna: 1,
        codigo: 'O1',
        cara: 'OCLUSAL',
        ubicacion: 'fosa_mesial',
        activa: true,
        desc: 'Oclusal fosa mesial',
      },
      {
        fila: 1,
        columna: 2,
        codigo: 'O2',
        cara: 'OCLUSAL',
        ubicacion: 'fosa_central',
        activa: true,
        desc: 'Oclusal fosa central',
      },
      {
        fila: 1,
        columna: 3,
        codigo: 'O3',
        cara: 'OCLUSAL',
        ubicacion: 'fosa_distal',
        activa: true,
        desc: 'Oclusal fosa distal',
      },
      {
        fila: 1,
        columna: 4,
        codigo: 'D',
        cara: 'DISTAL',
        ubicacion: 'completa',
        activa: true,
        desc: 'Superficie distal completa',
      },
      // Fila 2: Lingual
      {
        fila: 2,
        columna: 0,
        codigo: 'L',
        cara: 'LINGUAL',
        ubicacion: 'tercio_cervical',
        activa: true,
        desc: 'Lingual tercio cervical',
      },
      {
        fila: 2,
        columna: 1,
        codigo: 'L2',
        cara: 'LINGUAL',
        ubicacion: 'tercio_medio',
        activa: true,
        desc: 'Lingual tercio medio',
      },
      {
        fila: 2,
        columna: 2,
        codigo: 'L3',
        cara: 'LINGUAL',
        ubicacion: 'tercio_oclusal',
        activa: true,
        desc: 'Lingual tercio oclusal',
      },
      {
        fila: 2,
        columna: 3,
        codigo: 'L4',
        cara: 'LINGUAL',
        ubicacion: 'tercio_medio_distal',
        activa: true,
        desc: 'Lingual tercio medio distal',
      },
      {
        fila: 2,
        columna: 4,
        codigo: 'L5',
        cara: 'LINGUAL',
        ubicacion: 'tercio_cervical_distal',
        activa: true,
        desc: 'Lingual tercio cervical distal',
      },
    ];

    // Crear superficies para molares
    for (const config of configuracionesSuperficie.filter(
      (c) => c.tipo_diente === 'MOLAR',
    )) {
      await Promise.all(
        superficiesMolar.map((s) =>
          prisma.superficieDental.create({
            data: {
              configuracionSuperficieId: config.id,
              fila: s.fila,
              columna: s.columna,
              codigo: s.codigo || '',
              cara_anatomica: s.cara as any,
              ubicacion_especifica: s.ubicacion,
              es_activa: s.activa,
              descripcion: s.desc,
            },
          }),
        ),
      );
    }

    console.log('✅ Superficies dentales creadas');

    // 4. CREAR CONFIGURACIONES PARA CADA DIENTE
    console.log('🔗 Creando configuraciones diente...');

    for (const diente of dientesCreados) {
      const configuracion = configuracionesSuperficie.find(
        (c) => c.tipo_diente === diente.tipo_diente,
      );
      if (configuracion) {
        await prisma.configuracionDiente.upsert({
          where: {
            dienteId_configuracionSuperficieId: {
              dienteId: diente.id,
              configuracionSuperficieId: configuracion.id,
            },
          },
          update: {},
          create: {
            dienteId: diente.id,
            configuracionSuperficieId: configuracion.id,
          },
        });
      }
    }

    console.log('✅ Configuraciones diente creadas');

    // 5. HALLAZGOS ODONTOLÓGICOS
    console.log('🔍 Creando hallazgos odontológicos...');

    const hallazgos = [
      // Hallazgos de diente completo
      {
        nombre: 'Diente Sano',
        abrev: 'DS',
        desc: 'Diente en perfecto estado',
        tipo: 'diente',
        color: '#00FF00',
      },
      {
        nombre: 'Diente Ausente',
        abrev: 'DA',
        desc: 'Diente extraído o perdido',
        tipo: 'diente',
        color: '#FF0000',
      },
      {
        nombre: 'Corona Completa',
        abrev: 'CC',
        desc: 'Corona que cubre todo el diente',
        tipo: 'diente',
        color: '#FFD700',
      },
      {
        nombre: 'Implante',
        abrev: 'IMP',
        desc: 'Implante dental',
        tipo: 'diente',
        color: '#C0C0C0',
      },

      // Hallazgos por superficie dental
      {
        nombre: 'Caries',
        abrev: 'C',
        desc: 'Lesión cariosa',
        tipo: 'cara',
        color: '#8B4513',
      },
      {
        nombre: 'Obturación/Amalgama',
        abrev: 'OB',
        desc: 'Restauración con amalgama',
        tipo: 'cara',
        color: '#708090',
      },
      {
        nombre: 'Resina',
        abrev: 'R',
        desc: 'Restauración con resina',
        tipo: 'cara',
        color: '#FFFFFF',
      },
      {
        nombre: 'Corona Parcial',
        abrev: 'CP',
        desc: 'Corona que cubre parte del diente',
        tipo: 'cara',
        color: '#FFD700',
      },
      {
        nombre: 'Fractura',
        abrev: 'F',
        desc: 'Fractura dental',
        tipo: 'cara',
        color: '#FF4500',
      },
    ];

    const hallazgosCreados = await Promise.all(
      hallazgos.map((h) =>
        prisma.hallazgos.create({
          data: {
            nombre_hallazgo: h.nombre,
            abreviacion: h.abrev,
            descripcion: h.desc,
            tipo_hallazgo: h.tipo as any,
            color: h.color,
          },
        }),
      ),
    );

    console.log(
      `✅ Creados ${hallazgosCreados.length} hallazgos odontológicos`,
    );

    console.log(
      '🎉 Seed de registros dentales completado con terminología odontológica correcta!',
    );

    return {
      configuracionesSuperficie: configuracionesSuperficie.length,
      dientes: dientesCreados.length,
      hallazgos: hallazgosCreados.length,
    };
  } catch (error) {
    console.error('❌ Error en seed de registros dentales:', error);
    throw error;
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  seedDentalRecords()
    .catch((e) => {
      console.error('❌ Error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
