import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoDiente } from '../../domain/entities/diente.entity';

export class CreateDienteDto {
  @ApiProperty({
    description: 'Número del diente según numeración FDI',
    example: '16',
    pattern: '^[1-4][1-8]$',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[1-4][1-8]$/, {
    message:
      'El número de diente debe seguir el formato FDI (ej: 11, 16, 31, 48)',
  })
  numeroDiente: string;

  @ApiProperty({
    description: 'Nombre completo del diente',
    example: 'Primer Molar Superior Derecho',
  })
  @IsString()
  @IsNotEmpty()
  nombreDiente: string;

  @ApiPropertyOptional({
    description: 'Descripción adicional del diente',
    example: 'Diente 16 - Primer Molar Superior Derecho',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({
    description: 'Edad del diente (adulto, temporal, etc.)',
    example: 'adulto',
  })
  @IsString()
  @IsOptional()
  edadDiente?: string;

  @ApiProperty({
    description: 'Tipo de diente según clasificación anatómica',
    enum: TipoDiente,
    example: TipoDiente.MOLAR,
  })
  @IsEnum(TipoDiente, {
    message: 'El tipo de diente debe ser: INCISIVO, CANINO, PREMOLAR o MOLAR',
  })
  tipoDiente: TipoDiente;
}
