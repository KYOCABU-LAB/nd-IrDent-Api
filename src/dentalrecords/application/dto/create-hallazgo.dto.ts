import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsHexColor,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoHallazgo } from '../../domain/entities/hallazgo.entity';

export class CreateHallazgoDto {
  @ApiProperty({
    description: 'Nombre del hallazgo odontológico',
    example: 'Caries',
  })
  @IsString()
  @IsNotEmpty()
  nombreHallazgo: string;

  @ApiPropertyOptional({
    description: 'Abreviación del hallazgo',
    example: 'C',
  })
  @IsString()
  @IsOptional()
  abreviacion?: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del hallazgo',
    example: 'Lesión cariosa que afecta el esmalte dental',
  })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({
    description:
      'Tipo de hallazgo: si afecta todo el diente o solo una superficie',
    enum: TipoHallazgo,
    example: TipoHallazgo.CARA,
  })
  @IsEnum(TipoHallazgo, {
    message: 'El tipo de hallazgo debe ser: diente o cara',
  })
  tipoHallazgo: TipoHallazgo;

  @ApiPropertyOptional({
    description:
      'Color hexadecimal para representar el hallazgo en el odontograma',
    example: '#8B4513',
  })
  @IsString()
  @IsOptional()
  @IsHexColor({
    message: 'El color debe ser un código hexadecimal válido (ej: #FF0000)',
  })
  color?: string;
}
