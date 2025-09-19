import { IsInt, IsOptional, IsString, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHallazgoPacienteDto {
  @ApiProperty({
    description: 'ID del diente afectado',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  dienteId: number;

  @ApiPropertyOptional({
    description:
      'ID de la superficie dental específica (opcional para hallazgos de diente completo)',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  superficieId?: number;

  @ApiProperty({
    description: 'ID del paciente',
    example: 123,
  })
  @IsInt()
  @IsPositive()
  pacienteId: number;

  @ApiProperty({
    description: 'ID del doctor que registra el hallazgo',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  doctorId: number;

  @ApiProperty({
    description: 'ID del tipo de hallazgo',
    example: 5,
  })
  @IsInt()
  @IsPositive()
  hallazgoId: number;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales del hallazgo',
    example: 'Caries profunda en tercio cervical, requiere tratamiento urgente',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;
}
