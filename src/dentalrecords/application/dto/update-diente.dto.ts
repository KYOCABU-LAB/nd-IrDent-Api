import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDienteDto } from './create-diente.dto';

export class UpdateDienteDto extends PartialType(
  OmitType(CreateDienteDto, ['numeroDiente'] as const),
) {}
