import { ApiProperty } from '@nestjs/swagger';

export class HallazgoOdontogramaDto {
  @ApiProperty({
    description: 'ID del hallazgo del paciente',
    example: 10,
  })
  id: number;

  @ApiProperty({
    description: 'ID del tipo de hallazgo',
    example: 5,
  })
  hallazgoId: number;

  @ApiProperty({
    description: 'Nombre del hallazgo',
    example: 'Caries',
  })
  nombreHallazgo: string;

  @ApiProperty({
    description: 'Abreviación del hallazgo',
    example: 'C',
  })
  abreviacion: string;

  @ApiProperty({
    description: 'Color para mostrar en el odontograma',
    example: '#8B4513',
  })
  color: string;

  @ApiProperty({
    description: 'Tipo de hallazgo',
    example: 'cara',
  })
  tipoHallazgo: string;

  @ApiProperty({
    description: 'Observaciones del doctor',
    example: 'Caries profunda, requiere endodoncia',
  })
  observaciones?: string;

  @ApiProperty({
    description: 'Fecha de registro del hallazgo',
    example: '2024-01-15T10:30:00Z',
  })
  fechaRegistro: Date;

  @ApiProperty({
    description: 'Nombre del doctor que registró el hallazgo',
    example: 'Dr. Juan Pérez',
  })
  doctorNombre?: string;
}

export class SuperficieOdontogramaDto {
  @ApiProperty({
    description: 'ID de la superficie dental',
    example: 5,
  })
  id: number;

  @ApiProperty({
    description: 'Posición en la matriz (fila)',
    example: 1,
  })
  fila: number;

  @ApiProperty({
    description: 'Posición en la matriz (columna)',
    example: 2,
  })
  columna: number;

  @ApiProperty({
    description: 'Código de la superficie',
    example: 'O2',
  })
  codigo: string;

  @ApiProperty({
    description: 'Cara anatómica',
    example: 'OCLUSAL',
  })
  caraAnatomica: string;

  @ApiProperty({
    description: 'Ubicación específica en la superficie',
    example: 'fosa_central',
  })
  ubicacionEspecifica?: string;

  @ApiProperty({
    description: 'Si la superficie está activa (clickeable)',
    example: true,
  })
  esActiva: boolean;

  @ApiProperty({
    description: 'Hallazgo específico de esta superficie (si existe)',
    type: HallazgoOdontogramaDto,
    required: false,
  })
  hallazgo?: HallazgoOdontogramaDto;
}

export class DienteOdontogramaDto {
  @ApiProperty({
    description: 'ID del diente',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Número FDI del diente',
    example: '16',
  })
  numeroDiente: string;

  @ApiProperty({
    description: 'Nombre del diente',
    example: 'Primer Molar Superior Derecho',
  })
  nombreDiente: string;

  @ApiProperty({
    description: 'Tipo de diente',
    example: 'MOLAR',
  })
  tipoDiente: string;

  @ApiProperty({
    description: 'Superficies del diente con sus hallazgos',
    type: [SuperficieOdontogramaDto],
  })
  superficies: SuperficieOdontogramaDto[];

  @ApiProperty({
    description: 'Hallazgos que afectan todo el diente',
    type: [HallazgoOdontogramaDto],
  })
  hallazgosDiente: HallazgoOdontogramaDto[];
}

export class ResumenOdontogramaDto {
  @ApiProperty({
    description: 'Total de dientes en el odontograma',
    example: 32,
  })
  totalDientes: number;

  @ApiProperty({
    description: 'Número de dientes con hallazgos',
    example: 8,
  })
  dientesConHallazgos: number;

  @ApiProperty({
    description: 'Número de superficies con hallazgos',
    example: 12,
  })
  superficiesConHallazgos: number;

  @ApiProperty({
    description: 'Conteo de hallazgos por tipo',
    example: {
      Caries: 5,
      Obturación: 3,
      Corona: 2,
    },
  })
  hallazgosPorTipo: { [tipo: string]: number };

  @ApiProperty({
    description: 'Porcentaje de dientes afectados',
    example: 25.0,
  })
  porcentajeAfectado: number;
}

export class OdontogramaResponseDto {
  @ApiProperty({
    description: 'ID del paciente',
    example: 123,
  })
  pacienteId: number;

  @ApiProperty({
    description: 'Lista de dientes con sus superficies y hallazgos',
    type: [DienteOdontogramaDto],
  })
  dientes: DienteOdontogramaDto[];

  @ApiProperty({
    description: 'Fecha de la última actualización del odontograma',
    example: '2024-01-15T10:30:00Z',
  })
  fechaUltimaActualizacion: Date;

  @ApiProperty({
    description: 'Resumen estadístico del odontograma',
    type: ResumenOdontogramaDto,
  })
  resumen: ResumenOdontogramaDto;
}
